import { useState } from 'react';

import {
  useLanguage,
} from '../../context/LanguageContext';
import {
  getTranslations,
} from '../../i18n/translations';

import './contact.css';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  message: '',
  consent: false,
};

const Contact = () => {
  const { language } = useLanguage();

  const text =
    getTranslations(language).contactPage;

  const [formData, setFormData] =
    useState(initialFormData);

  const [submissionStatus, setSubmissionStatus] =
    useState('idle');

  const [submissionMessage, setSubmissionMessage] =
    useState('');

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]:
        type === 'checkbox' ? checked : value,
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
          body: JSON.stringify({
            ...formData,
            language,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(text.error);
      }

      setSubmissionStatus('success');
      setSubmissionMessage(text.success);
      setFormData(initialFormData);
    } catch (error) {
      console.error(error);

      setSubmissionStatus('error');
      setSubmissionMessage(text.error);
    }
  };

  return (
    <main className="contact-page">
      {/* Introduction */}

      <section className="contact-introduction">
        <p className="contact-label">
          <span></span>
          {text.label}
        </p>

        <h1 className="page-hero-title">
          {text.titleFirstLine}
          <br />
          <span>{text.titleSecondLine}</span>
        </h1>

        <div className="contact-introduction-bottom">
          <p className="contact-introduction-text">
            {text.introduction}
          </p>

          <a
            href="#project-inquiry"
            className="contact-scroll-link"
          >
            <span>{text.scrollLink}</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      {/* Project inquiry */}

      <section className="contact-form-section">
        <div className="contact-form-heading">
          <p>{text.formLabel}</p>

          <h2>
            {text.formHeadingFirst}{' '}
            <span className="spanTitleContact">
              {text.formHeadingEmphasis}
            </span>
          </h2>
        </div>

        <form
          id="project-inquiry"
          className="contact-form"
          onSubmit={handleSubmit}
        >
          {/* Name */}

          <div className="contact-field">
            <label htmlFor="name">
              {text.name} <span>*</span>
            </label>

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

          {/* Email */}

          <div className="contact-field">
            <label htmlFor="email">
              {text.email} <span>*</span>
            </label>

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

          {/* Phone */}

          <div className="contact-field">
            <label htmlFor="phone">
              {text.phone}
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
          </div>

          {/* Project message */}

          <div className="contact-field contact-message-field">
            <label htmlFor="message">
              {text.message} <span>*</span>
            </label>

            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="8"
              maxLength="3000"
              placeholder={text.messagePlaceholder}
              required
            />

            <p className="contact-field-help">
              {text.help}
            </p>
          </div>

          {/* Consent */}

          <label className="contact-consent">
            <input
              name="consent"
              type="checkbox"
              checked={formData.consent}
              onChange={handleChange}
              required
            />

            <span>{text.consent}</span>
          </label>

          {/* Submit button */}

          <button
            type="submit"
            className="contact-submit"
            disabled={
              submissionStatus === 'submitting'
            }
          >
            {submissionStatus === 'submitting'
              ? text.submitting
              : text.submit}

            <span>↗</span>
          </button>

          {/* Result message */}

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