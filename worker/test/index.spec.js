import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from 'cloudflare:test';

import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import worker from '../src/index.js';

const turnstileUrl =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const resendUrl =
  'https://api.resend.com/emails';

const validAiBrief = {
  summary:
    'Renovation of a 140 m² apartment in Tirana.',
  projectType: 'Renovation',
  location: 'Tirana',
  approximateArea: '140 m²',
  timeline: 'Next spring',
  budget: 'Not provided',

  priorities: [
    'Improve natural light',
    'Create an open kitchen',
    'Add storage',
  ],

  missingInformation: [
    'Budget',
    'Current floor plan',
  ],
};

/*
  Create a controlled environment for each test.

  The test database is real, but Workers AI and the
  rate limiter are replaced with fake functions.
*/
const createTestEnv = ({
  aiRun = vi.fn().mockResolvedValue({
    response: JSON.stringify(validAiBrief),
  }),

  rateLimit = vi.fn().mockResolvedValue({
    success: true,
  }),
} = {}) => {
  return {
    dhe_studio_inquiries_db:
      env.dhe_studio_inquiries_db,

    TURNSTILE_SECRET_KEY:
      'test-turnstile-secret',

    RESEND_API_KEY:
      're_test_key',

    INQUIRY_FROM_EMAIL:
      'inquiries@send.studiodhe.com',

    INQUIRY_TO_EMAIL:
      'info@studiodhe.com',

    AI: {
      run: aiRun,
    },

    INQUIRY_RATE_LIMITER: {
      limit: rateLimit,
    },
  };
};

/*
  Run the Worker directly inside the test environment.
*/
const callWorker = async ({
  path = '/',
  method = 'GET',
  body,
  testEnv = createTestEnv(),
}) => {
  const request = new Request(
    `http://example.com${path}`,
    {
      method,

      headers:
        body === undefined
          ? undefined
          : {
              'Content-Type':
                'application/json',
            },

      body:
        body === undefined
          ? undefined
          : typeof body === 'string'
            ? body
            : JSON.stringify(body),
    }
  );

  const executionContext =
    createExecutionContext();

  const response = await worker.fetch(
    request,
    testEnv,
    executionContext
  );

  await waitOnExecutionContext(
    executionContext
  );

  return response;
};

/*
  Return a minimal Response-like object for mocked
  Turnstile and Resend requests.
*/
const createMockResponse = (
  body,
  status = 200
) => {
  return {
    ok: status >= 200 && status < 300,
    status,

    json: async () => {
      return body;
    },

    text: async () => {
      return JSON.stringify(body);
    },
  };
};

const getRequestUrl = (input) => {
  return typeof input === 'string'
    ? input
    : input.url;
};

/*
  Mock both external services called by the Worker:

  1. Cloudflare Turnstile
  2. Resend
*/
const mockExternalRequests = ({
  turnstileResult = {
    success: true,
    hostname: 'localhost',
    action: 'contact_inquiry',
    'error-codes': [],
  },

  resendResult = {
    status: 200,

    body: {
      id: 'email_test_123',
    },
  },
} = {}) => {
  return vi
    .spyOn(globalThis, 'fetch')
    .mockImplementation(
      async (input) => {
        const requestUrl =
          getRequestUrl(input);

        if (requestUrl === turnstileUrl) {
          return createMockResponse(
            turnstileResult
          );
        }

        if (requestUrl === resendUrl) {
          return createMockResponse(
            resendResult.body,
            resendResult.status
          );
        }

        throw new Error(
          `Unexpected external request: ${requestUrl}`
        );
      }
    );
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('DHÈ Studio inquiry API', () => {
  it('confirms that the API is running', async () => {
    const response = await callWorker({});

    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data.message).toBe(
      'DHÈ Studio inquiry API is running.'
    );
  });

  it('accepts, processes, stores and emails a valid inquiry', async () => {
    const externalFetch =
      mockExternalRequests();

    const aiRun = vi.fn().mockResolvedValue({
      response: JSON.stringify(validAiBrief),
    });

    const response = await callWorker({
      path: '/api/inquiry',
      method: 'POST',

      testEnv: createTestEnv({
        aiRun,
      }),

      body: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+355 600000000',

        message:
          'I want to renovate a 140 m² apartment in Tirana next spring.',

        consent: true,
        language: 'en',

        turnstileToken:
          'test-turnstile-token',
      },
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    expect(data.message).toBe(
      'Your inquiry was received successfully.'
    );

    /*
      The AI model should process the inquiry once.
    */
    expect(aiRun).toHaveBeenCalledTimes(1);

    /*
      The Worker should make two external requests:
      one to Turnstile and one to Resend.
    */
    expect(externalFetch).toHaveBeenCalledTimes(
      2
    );

    const requestedUrls =
      externalFetch.mock.calls.map(
        ([input]) => getRequestUrl(input)
      );

    expect(requestedUrls).toEqual([
      turnstileUrl,
      resendUrl,
    ]);

    /*
      Inspect the request sent to Resend.
    */
    const resendCall =
      externalFetch.mock.calls.find(
        ([input]) =>
          getRequestUrl(input) === resendUrl
      );

    expect(resendCall).toBeDefined();

    const resendOptions = resendCall[1];
    const resendBody = JSON.parse(
      resendOptions.body
    );

    expect(
      resendOptions.headers.Authorization
    ).toBe('Bearer re_test_key');

    expect(
      resendOptions.headers[
        'Idempotency-Key'
      ]
    ).toMatch(/^dhe-inquiry-\d+$/);

    expect(resendBody.from).toBe(
      'DHÈ Studio Website <inquiries@send.studiodhe.com>'
    );

    expect(resendBody.to).toEqual([
      'info@studiodhe.com',
    ]);

    expect(resendBody.reply_to).toBe(
      'test@example.com'
    );

    expect(resendBody.subject).toContain(
      'Test User'
    );

    expect(resendBody.html).toContain(
      'Renovation'
    );

    /*
      Confirm the inquiry and email information
      were stored in D1.
    */
    const savedInquiry =
      await env.dhe_studio_inquiries_db
        .prepare(
          `
            SELECT
              name,
              email,
              phone,
              message,
              language,
              consent_given,

              ai_summary,
              ai_project_type,
              ai_brief_json,
              ai_status,
              ai_error,
              ai_processed_at,

              email_status,
              resend_email_id,
              email_error,
              email_sent_at

            FROM inquiries
            WHERE email = ?
            ORDER BY id DESC
            LIMIT 1
          `
        )
        .bind('test@example.com')
        .first();

    expect(savedInquiry.name).toBe(
      'Test User'
    );

    expect(savedInquiry.email).toBe(
      'test@example.com'
    );

    expect(savedInquiry.phone).toBe(
      '+355 600000000'
    );

    expect(savedInquiry.language).toBe('en');

    expect(savedInquiry.consent_given).toBe(
      1
    );

    expect(savedInquiry.ai_summary).toBe(
      validAiBrief.summary
    );

    expect(
      savedInquiry.ai_project_type
    ).toBe('Renovation');

    expect(savedInquiry.ai_status).toBe(
      'completed'
    );

    expect(savedInquiry.ai_error).toBeNull();

    expect(
      savedInquiry.ai_processed_at
    ).toEqual(expect.any(String));

    expect(
      JSON.parse(savedInquiry.ai_brief_json)
    ).toEqual(validAiBrief);

    /*
      Resend successfully accepted the email.
    */
    expect(savedInquiry.email_status).toBe(
      'sent'
    );

    expect(
      savedInquiry.resend_email_id
    ).toBe('email_test_123');

    expect(
      savedInquiry.email_error
    ).toBeNull();

    expect(
      savedInquiry.email_sent_at
    ).toEqual(expect.any(String));
  });

  it('uses the safe fallback when AI fails', async () => {
    mockExternalRequests();

    const aiRun = vi
      .fn()
      .mockRejectedValue(
        new Error('AI service unavailable')
      );

    const originalMessage =
      'I would like help with an apartment renovation.';

    const response = await callWorker({
      path: '/api/inquiry',
      method: 'POST',

      testEnv: createTestEnv({
        aiRun,
      }),

      body: {
        name: 'Fallback Test',
        email: 'fallback@example.com',
        phone: '',
        message: originalMessage,
        consent: true,
        language: 'en',

        turnstileToken:
          'test-turnstile-token',
      },
    });

    const data = await response.json();

    /*
      An AI failure must not lose the inquiry.
    */
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    const savedInquiry =
      await env.dhe_studio_inquiries_db
        .prepare(
          `
            SELECT
              message,
              ai_summary,
              ai_project_type,
              ai_brief_json,
              ai_status,
              ai_error,
              email_status

            FROM inquiries
            WHERE email = ?
            ORDER BY id DESC
            LIMIT 1
          `
        )
        .bind('fallback@example.com')
        .first();

    expect(savedInquiry.message).toBe(
      originalMessage
    );

    expect(savedInquiry.ai_status).toBe(
      'fallback'
    );

    expect(savedInquiry.ai_summary).toBe(
      originalMessage
    );

    expect(
      savedInquiry.ai_project_type
    ).toBe('Not provided');

    expect(savedInquiry.ai_error).toEqual(
      expect.any(String)
    );

    expect(
      JSON.parse(savedInquiry.ai_brief_json)
    ).toEqual(
      expect.objectContaining({
        summary: originalMessage,
        projectType: 'Not provided',
      })
    );

    /*
      The fallback brief should still be emailed.
    */
    expect(savedInquiry.email_status).toBe(
      'sent'
    );
  });

  it('stores the inquiry when Resend email delivery fails', async () => {
    mockExternalRequests({
      resendResult: {
        status: 500,

        body: {
          message:
            'Temporary Resend failure',
        },
      },
    });

    const response = await callWorker({
      path: '/api/inquiry',
      method: 'POST',

      body: {
        name: 'Email Failure Test',

        email:
          'email-failure@example.com',

        phone: '',

        message:
          'Please help with an apartment renovation.',

        consent: true,
        language: 'en',

        turnstileToken:
          'valid-turnstile-token',
      },
    });

    const data = await response.json();

    /*
      The inquiry was already saved successfully,
      so the visitor still receives success.
    */
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    const savedInquiry =
      await env.dhe_studio_inquiries_db
        .prepare(
          `
            SELECT
              name,
              email,
              email_status,
              resend_email_id,
              email_error,
              email_sent_at

            FROM inquiries
            WHERE email = ?
            ORDER BY id DESC
            LIMIT 1
          `
        )
        .bind(
          'email-failure@example.com'
        )
        .first();

    expect(savedInquiry.name).toBe(
      'Email Failure Test'
    );

    expect(savedInquiry.email_status).toBe(
      'failed'
    );

    expect(
      savedInquiry.resend_email_id
    ).toBeNull();

    expect(savedInquiry.email_error).toContain(
      'Temporary Resend failure'
    );

    expect(
      savedInquiry.email_sent_at
    ).toBeNull();
  });

  it('rejects an inquiry with missing required fields', async () => {
    const response = await callWorker({
      path: '/api/inquiry',
      method: 'POST',

      body: {
        name: '',
        email: 'test@example.com',
        message: '',
        consent: false,
      },
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);

    expect(data.message).toBe(
      'Please complete all required fields.'
    );
  });

  it('rejects invalid JSON', async () => {
    const response = await callWorker({
      path: '/api/inquiry',
      method: 'POST',
      body: '{invalid-json}',
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);

    expect(data.message).toBe(
      'The submitted data is not valid.'
    );
  });

  it('rejects a project message longer than 3000 characters', async () => {
    const response = await callWorker({
      path: '/api/inquiry',
      method: 'POST',

      body: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'a'.repeat(3001),
        consent: true,
      },
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);

    expect(data.message).toBe(
      'The project message is too long.'
    );
  });

  it('returns 404 for an unknown endpoint', async () => {
    const response = await callWorker({
      path: '/unknown',
    });

    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);

    expect(data.message).toBe(
      'Endpoint not found.'
    );
  });

  it('rejects an invalid email address', async () => {
    const response = await callWorker({
      path: '/api/inquiry',
      method: 'POST',

      body: {
        name: 'Test User',
        email: 'invalid-email',

        message:
          'This is a project inquiry.',

        consent: true,
      },
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);

    expect(data.message).toBe(
      'Please enter a valid email address.'
    );
  });

  it('rejects an inquiry when Turnstile fails', async () => {
    const externalFetch =
      mockExternalRequests({
        turnstileResult: {
          success: false,

          'error-codes': [
            'invalid-input-response',
          ],
        },
      });

    const aiRun = vi.fn();

    const response = await callWorker({
      path: '/api/inquiry',
      method: 'POST',

      testEnv: createTestEnv({
        aiRun,
      }),

      body: {
        name: 'Blocked User',
        email: 'blocked@example.com',

        message:
          'This must not be stored.',

        consent: true,
        language: 'en',
        turnstileToken: 'invalid-token',
      },
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);

    expect(data.message).toBe(
      'Security verification failed. Please try again.'
    );

    /*
      Only Turnstile should be contacted.
      Resend must not be called.
    */
    expect(externalFetch).toHaveBeenCalledTimes(
      1
    );

    expect(
      getRequestUrl(
        externalFetch.mock.calls[0][0]
      )
    ).toBe(turnstileUrl);

    /*
      AI must not run when Turnstile rejects
      the submission.
    */
    expect(aiRun).not.toHaveBeenCalled();

    const storedInquiry =
      await env.dhe_studio_inquiries_db
        .prepare(
          `
            SELECT id
            FROM inquiries
            WHERE email = ?
          `
        )
        .bind('blocked@example.com')
        .first();

    expect(storedInquiry).toBeNull();
  });

  it('rejects an inquiry when the rate limit is exceeded', async () => {
    const rateLimit = vi
      .fn()
      .mockResolvedValue({
        success: false,
      });

    const aiRun = vi.fn();

    const response = await callWorker({
      path: '/api/inquiry',
      method: 'POST',

      testEnv: createTestEnv({
        rateLimit,
        aiRun,
      }),

      body: {
        name: 'Limited User',
        email: 'limited@example.com',

        message:
          'This request should be stopped.',

        consent: true,
        language: 'en',
        turnstileToken: 'test-token',
      },
    });

    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.success).toBe(false);

    expect(data.message).toBe(
      'Too many inquiry attempts. Please wait a minute and try again.'
    );

    expect(rateLimit).toHaveBeenCalledWith({
      key:
        'contact-inquiry:local-development',
    });

    /*
      Turnstile, AI and Resend must not run for
      a rate-limited request.
    */
    expect(aiRun).not.toHaveBeenCalled();

    const storedInquiry =
      await env.dhe_studio_inquiries_db
        .prepare(
          `
            SELECT id
            FROM inquiries
            WHERE email = ?
          `
        )
        .bind('limited@example.com')
        .first();

    expect(storedInquiry).toBeNull();
  });
});