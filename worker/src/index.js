const allowedOrigins = [
  'http://localhost:5173',
];

const createHeaders = (request) => {
  const origin = request.headers.get('Origin');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
};

const sendJson = (request, data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: createHeaders(request),
  });
};

const cleanText = (value) => {
  return typeof value === 'string'
    ? value.trim()
    : '';
};

// Verify Turnstile token with Cloudflare's Turnstile API
const verifyTurnstileToken = async ({
  token,
  secretKey,
  remoteIp,
}) => {
  if (!secretKey) {
    console.error(
      'TURNSTILE_SECRET_KEY is not configured.'
    );

    return {
      success: false,
      internalError: true,
    };
  }

  try {
    const verificationData = {
      secret: secretKey,
      response: token,
    };

    if (remoteIp) {
      verificationData.remoteip = remoteIp;
    }

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationData),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Turnstile returned HTTP ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      'Turnstile verification failed:',
      error
    );

    return {
      success: false,
      internalError: true,
    };
  }
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Browser CORS check

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...createHeaders(request),
          'Access-Control-Allow-Methods':
            'POST, OPTIONS',
          'Access-Control-Allow-Headers':
            'Content-Type',
        },
      });
    }

    // API health check

    if (
      request.method === 'GET' &&
      url.pathname === '/'
    ) {
      return sendJson(request, {
        message:
          'DHÈ Studio inquiry API is running.',
      });
    }

    // Receive a new inquiry

    if (
      request.method === 'POST' &&
      url.pathname === '/api/inquiry'
    ) {
      let formData;

      try {
        formData = await request.json();
      } catch {
        return sendJson(
          request,
          {
            success: false,
            message:
              'The submitted data is not valid.',
          },
          400
        );
      }

      if (
        !formData ||
        typeof formData !== 'object' ||
        Array.isArray(formData)
      ) {
        return sendJson(
          request,
          {
            success: false,
            message:
              'The submitted data is not valid.',
          },
          400
        );
      }

      const name = cleanText(formData.name);
      const email = cleanText(formData.email);
      const phone = cleanText(formData.phone);
      const message = cleanText(formData.message);
      const turnstileToken = cleanText(
        formData.turnstileToken
      );
      const consent = formData.consent;

      const supportedLanguages = [
        'en',
        'sq',
        'tr',
      ];

      const language =
        supportedLanguages.includes(formData.language)
          ? formData.language
          : 'en';

      // Required fields

      if (
        !name ||
        !email ||
        !message ||
        consent !== true
      ) {
        return sendJson(
          request,
          {
            success: false,
            message:
              'Please complete all required fields.',
          },
          400
        );
      }

      // Email validation

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        return sendJson(
          request,
          {
            success: false,
            message:
              'Please enter a valid email address.',
          },
          400
        );
      }

      // Length validation

      if (name.length > 120) {
        return sendJson(
          request,
          {
            success: false,
            message: 'The name is too long.',
          },
          400
        );
      }

      if (email.length > 254) {
        return sendJson(
          request,
          {
            success: false,
            message:
              'The email address is too long.',
          },
          400
        );
      }

      if (phone.length > 50) {
        return sendJson(
          request,
          {
            success: false,
            message:
              'The phone number is too long.',
          },
          400
        );
      }

      if (message.length > 3000) {
        return sendJson(
          request,
          {
            success: false,
            message:
              'The project message is too long.',
          },
          400
        );
      }

      if (
        !turnstileToken ||
        turnstileToken.length > 2048
      ) {
        return sendJson(
          request,
          {
            success: false,
            message:
              'Please complete the security verification.',
          },
          400
        );
      }
      
      // Validate the token before the D1 insertion
      const turnstileResult =
        await verifyTurnstileToken({
          token: turnstileToken,
          secretKey: env.TURNSTILE_SECRET_KEY,
          remoteIp: request.headers.get(
            'CF-Connecting-IP'
          ),
        });

      if (!turnstileResult.success) {
        console.error(
          'Turnstile rejected the submission:',
          turnstileResult['error-codes']
        );

        return sendJson(
          request,
          {
            success: false,
            message: turnstileResult.internalError
              ? 'Security verification is temporarily unavailable. Please try again.'
              : 'Security verification failed. Please try again.',
          },
          turnstileResult.internalError ? 503 : 400
        );
      }

      // Store the validated inquiry in D1

      try {
        await env.dhe_studio_inquiries_db
          .prepare(
            `
              INSERT INTO inquiries (
                name,
                email,
                phone,
                message,
                language,
                consent_given,
                email_status
              )
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `
          )
          .bind(
            name,
            email,
            phone || null,
            message,
            language,
            1,
            'pending'
          )
          .run();
      } catch (databaseError) {
        console.error(
          'Failed to store inquiry:',
          databaseError
        );

        return sendJson(
          request,
          {
            success: false,
            message:
              'The inquiry could not be saved. Please try again.',
          },
          500
        );
      }

      // Only return success after D1 finishes saving

      return sendJson(request, {
        success: true,
        message:
          'Your inquiry was received successfully.',
      });
    }

    return sendJson(
      request,
      {
        success: false,
        message: 'Endpoint not found.',
      },
      404
    );
  },
};