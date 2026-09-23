# DHÈ Studio

A modern portfolio website for **DHÈ — Designing Human Experiences**, an architecture and interior design studio focused on how people experience the spaces around them.

I am building the project as more than a static portfolio. The goal is to create a complete digital platform where the architect can manage projects and services, receive structured client inquiries, and eventually understand how visitors interact with the studio’s work.

## Current features

* Responsive React website
* Animated exterior-to-interior hero
* About, Services, Projects, Contact and 404 pages
* Dynamic project detail pages using URL slugs
* Services and projects managed through Sanity CMS
* Responsive projects carousel
* Sanity image optimization
* Accessible navigation and semantic page structure
* Client inquiry form with validation
* Cloudflare Worker API for securely processing inquiries

## Planned features

* AI-assisted project brief organization
* Structured inquiry emails for the architect
* Safe handling of client contact information
* Spam protection and request validation
* Website analytics and project engagement tracking
* Production deployment and custom domain connection

The AI feature will not design projects or give architectural advice. Its purpose is to turn a client’s natural message into an organized brief containing details such as project type, location, area, style, timeline and budget. Missing information will remain clearly marked instead of being invented.

## Technology

* React
* Vite
* React Router
* JavaScript
* CSS
* Sanity CMS
* GROQ
* Cloudflare Workers
* Cloudflare Workers AI

## How the project works

Public website content such as services, project information and images is stored in Sanity. React retrieves that content and displays it throughout the website.

Client inquiries follow a separate path:

1. A visitor completes the contact form.
2. React sends the inquiry to the Cloudflare Worker.
3. The Worker validates the request.
4. Only the project message is sent to the AI.
5. Personal details rem
