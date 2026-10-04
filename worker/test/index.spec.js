import {
	env,
	SELF,
} from 'cloudflare:test'; import { describe, expect, it } from 'vitest';

describe('DHÈ Studio inquiry API', () => {
	it('confirms that the API is running', async () => {
		const response = await SELF.fetch(
			'http://example.com/'
		);

		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data.message).toBe(
			'DHÈ Studio inquiry API is running.'
		);
	});

	it('accepts a valid inquiry', async () => {
		const response = await SELF.fetch(
			'http://example.com/api/inquiry',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: 'Test User',
					email: 'test@example.com',
					phone: '+355 600000000',
					message: 'This is a test project inquiry.',
					consent: true,
					language: 'en',
				}),
			}
		);

		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data.success).toBe(true);
		expect(data.message).toBe(
			'Your inquiry was received successfully.'
		);

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
          email_status
        FROM inquiries
        WHERE email = ?
      `
				)
				.bind('test@example.com')
				.first();

		expect(savedInquiry).toEqual({
			name: 'Test User',
			email: 'test@example.com',
			phone: '+355 600000000',
			message: 'This is a test project inquiry.',
			language: 'en',
			consent_given: 1,
			email_status: 'pending',
		});
	});

	it('rejects an inquiry with missing required fields', async () => {
		const response = await SELF.fetch(
			'http://example.com/api/inquiry',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: '',
					email: 'test@example.com',
					message: '',
					consent: false,
				}),
			}
		);

		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data.success).toBe(false);
		expect(data.message).toBe(
			'Please complete all required fields.'
		);
	});

	it('rejects invalid JSON', async () => {
		const response = await SELF.fetch(
			'http://example.com/api/inquiry',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: '{invalid-json}',
			}
		);

		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data.success).toBe(false);
		expect(data.message).toBe(
			'The submitted data is not valid.'
		);
	});

	it('rejects a project message longer than 3000 characters', async () => {
		const response = await SELF.fetch(
			'http://example.com/api/inquiry',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: 'Test User',
					email: 'test@example.com',
					message: 'a'.repeat(3001),
					consent: true,
				}),
			}
		);

		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data.success).toBe(false);
		expect(data.message).toBe(
			'The project message is too long.'
		);
	});

	it('returns 404 for an unknown endpoint', async () => {
		const response = await SELF.fetch(
			'http://example.com/unknown'
		);

		const data = await response.json();

		expect(response.status).toBe(404);
		expect(data.success).toBe(false);
		expect(data.message).toBe(
			'Endpoint not found.'
		);
	});

	it('rejects an invalid email address', async () => {
		const response = await SELF.fetch(
			'http://example.com/api/inquiry',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: 'Test User',
					email: 'invalid-email',
					message: 'This is a project inquiry.',
					consent: true,
				}),
			}
		);

		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data.success).toBe(false);
		expect(data.message).toBe(
			'Please enter a valid email address.'
		);
	});
});