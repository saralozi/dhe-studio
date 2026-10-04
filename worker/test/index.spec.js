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
	Create a safe test environment.

	The real D1 test database is used, but Workers AI
	is replaced with a fake function.
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

	This allows Vitest to control fetch and the AI binding.
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
	Replace the real Turnstile Siteverify request
	with a controlled response.
*/
const mockTurnstileResponse = (result) => {
	return vi
		.spyOn(globalThis, 'fetch')
		.mockResolvedValueOnce({
			ok: true,
			status: 200,

			json: async () => {
				return result;
			},
		});
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

	it('accepts, processes and stores a valid inquiry', async () => {
		mockTurnstileResponse({
			success: true,
			hostname: 'localhost',
			action: 'contact_inquiry',
			'error-codes': [],
		});

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
			Confirm that the Worker asked AI exactly once.
	*/
		expect(aiRun).toHaveBeenCalledTimes(1);

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
							email_status,
							ai_summary,
							ai_project_type,
							ai_brief_json,
							ai_status,
							ai_error,
							ai_processed_at
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
		expect(savedInquiry.consent_given).toBe(1);
		expect(savedInquiry.email_status).toBe(
			'pending'
		);

		expect(savedInquiry.ai_summary).toBe(
			validAiBrief.summary
		);

		expect(savedInquiry.ai_project_type).toBe(
			'Renovation'
		);

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
	});

	it('uses the safe fallback when AI fails', async () => {
		mockTurnstileResponse({
			success: true,
			hostname: 'localhost',
			action: 'contact_inquiry',
			'error-codes': [],
		});

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
			AI failure must not lose the visitor's inquiry.
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
							ai_error
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

		expect(savedInquiry.ai_project_type).toBe(
			'Not provided'
		);

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
		mockTurnstileResponse({
			success: false,
			'error-codes': [
				'invalid-input-response',
			],
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
			AI must never run when Turnstile rejects
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
			key: 'contact-inquiry:local-development',
		});

		/*
			Turnstile and AI must not run for
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