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

export default {
  // Worker entry point to handle incoming requests.
  async fetch(request) {

    // Read the request URL to determine the endpoint being called.
    const url = new URL(request.url);

    // Allow the browser to check whether it can call the API.
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...createHeaders(request),
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // A simple check that the Worker is running.
    if (request.method === 'GET' && url.pathname === '/') {
      return sendJson(request, {
        message: 'DHÈ Studio inquiry API is running.',
      });
    }

    // Receive a new inquiry.
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
            message: 'The submitted data is not valid.',
          },
          400
        );
      }

      const name = formData.name?.trim();
      const email = formData.email?.trim();
      const phone = formData.phone?.trim();
      const message = formData.message?.trim();
      const consent = formData.consent;

      if (!name || !email || !message || consent !== true) {
        return sendJson(
          request,
          {
            success: false,
            message: 'Please complete all required fields.',
          },
          400
        );
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        return sendJson(
          request,
          {
            success: false,
            message: 'Please enter a valid email address.',
          },
          400
        );
      }

      if (message.length > 3000) {
        return sendJson(
          request,
          {
            success: false,
            message: 'The project message is too long.',
          },
          400
        );
      }

      // AI processing and email delivery will be added later.
      return sendJson(request, {
        success: true,
        message: 'Your inquiry was received successfully.',
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