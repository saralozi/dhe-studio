import { useState } from 'react';
import './contact.css';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  message: '',
  consent: false,
};

const Contact = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [submissionStatus, setSubmissionStatus] =
    useState('idle');
  const [submissionMessage, setSubmissionMessage] =
    useState('');

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmissionStatus('submitting');
    setSubmissionMessage('');

    try {
      const response = await fetch(
        'http://localhost:8787/api/inquiry',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
          'The inquiry could not be sent.'
        );
      }

      setSubmissionStatus('success');
      setSubmissionMessage(responseData.message);
      setFormData(initialFormData);
    } catch (error) {
      console.error(error);

      setSubmissionStatus('error');
      setSubmissionMessage(
        error.message ||
        'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <main className="contact-page">
      <section className="contact-introduction">
        <p className="contact-label">
          <span></span>
          START A PROJECT
        </p>

        <h1>
          Tell us about
          <br />
          <span>your idea.</span>
        </h1>

        <p className="contact-introduction-text">
          Share what you have in mind. You do not need to have
          everything figured out—we will begin with a conversation.
        </p>
      </section>

      <section className="contact-form-section">
        <div className="contact-form-heading">
          <p>PROJECT INQUIRY</p>

          <h2>
            A few details to help us understand your project.
          </h2>
        </div>

        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >
          <div className="contact-field">
            <label htmlFor="name">Name *</label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="contact-field">
            <label htmlFor="email">Email *</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="contact-field">
            <label htmlFor="phone">Phone</label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
          </div>

          <div className="contact-field contact-message-field">
            <label htmlFor="message">
              Tell us about your project *
            </label>

            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="8"
              maxLength="3000"
              required
            />

            <p className="contact-field-help">
              You do not need to include your contact details here.
              You can mention the project type, location, approximate
              area, needs, preferred style, timeline, or budget.
            </p>
          </div>

          <label className="contact-consent">
            <input
              name="consent"
              type="checkbox"
              checked={formData.consent}
              onChange={handleChange}
              required
            />

            <span>
              I agree that DHÈ Studio may use these details to respond
              to my inquiry.
            </span>
          </label>

          <button
            type="submit"
            className="contact-submit"
            disabled={submissionStatus === 'submitting'}
          >
            {submissionStatus === 'submitting'
              ? 'Sending...'
              : 'Send inquiry'}

            <span>↗</span>
          </button>

          {submissionMessage && (
            <p
              className={`contact-form-message ${submissionStatus}`}
              role={
                submissionStatus === 'error'
                  ? 'alert'
                  : 'status'
              }
            >
              {submissionMessage}
            </p>
          )}
        </form>
      </section>
    </main>
  );
};

export default Contact;