# Success Tunnel Professional Service — Project Brief

Project file for engineers to implement the website at successtunnel.in. This document converts the user's high-level requirements into actionable engineering tasks, acceptance criteria, API/DB notes, and deliverables.

## Summary
- Business: Success Tunnel Professional Service
- Domain: successtunnel.in
- Goals: present services (Consultancy, Finance, Education, Investment, Real Estate, Rental), generate leads, provide downloadable study material, manage property listings, and be SEO/performance/secure production-ready.

## Scope (MVP)
- Public website: Home, About, Services overview, Services detail pages, Blog, Downloads, Education portal listing, Property listing & rental pages, Contact, FAQ, Privacy/Terms.
- Admin panel: manage services and subservices, manage blogs, manage downloadable assets, manage property listings, view/export enquiries.
- Lead capture forms on all key pages; email notifications and DB storage.
- Integrations: WhatsApp floating button, click-to-call, Google Maps embed, Google Analytics, reCAPTCHA v3 (or equivalent).

## High-level Requirements
1. Responsive design (mobile-first). Works on modern Chrome, Firefox, Safari, Edge.
2. SEO friendly: semantic HTML, sitemap.xml, robots.txt, meta titles/descriptions, OpenGraph tags, structured data for services and blog posts.
3. Performance: <3s page load on 4G (optimised assets, lazy-loading images, CDN hosting).
4. Security: SSL/TLS, input validation, CSRF protection for forms, reCAPTCHA for spam, daily backups.
5. Accessibility: WCAG 2.1 AA basics (semantic landmarks, labels for forms, alt text for images, keyboard navigable).

## Functional Specification (by area)

Homepage
- Hero with CTA buttons: `Book Consultation`, `Contact Us`, `Apply Now`.
- 6 service cards linking to dedicated service pages.
- Lead capture area + newsletter subscribe.

Services & Subservices
- Services: Consultancy, Finance, Education, Investment, Real Estate, Commercial/Residential Space.
- Each service has a page listing subservices (e.g., Consultancy → Income Tax, GST, MSME, Trademark, Company Services, NPO/Trust, Firm/LLP).
- Each subservice page contains: intro, benefits, required documents, process flow, FAQs, enquiry form.

Education Portal
- Listing of articles, notes, downloadable PDFs, and a special Tally course page.
- Blog CMS for posts with categories and tags.

Finance & Investment
- Pages describing products; optional downloadable brochures; contact advisor CTA.

Real Estate & Rental
- Property listing system with filters (type, city, budget, featured). Each property page with gallery, specs, contact/whatsapp button.

Contact & Lead Capture
- Enquiry form fields: Name, Mobile, Email, City, Service Required, Message.
- Store leads in DB and email to admin address (configurable).
- Admin export to CSV/Excel.

Admin Panel
- Authentication for admin users.
- CRUD for services, subservices, blog posts, downloads, properties, loan/investment products.
- Enquiry viewer with export.

Integrations
- WhatsApp floating button (click => open chat to configured number with prefilled message).
- Click-to-call for mobile.
- Google Maps embed for office address.
- Google Analytics + Google Search Console verification file / meta tag.

## Non-Functional Requirements
- Tech choices: WordPress (Elementor Pro) recommended for fast delivery; alternative: Laravel + MySQL for custom needs.
- PHP >= 8.0 (if using WordPress/Laravel), MySQL 5.7+/MariaDB, or managed DB in hosting.
- CDN (Cloudflare or provider), SSL via Let’s Encrypt or hosting provider.
- Hosting: managed cloud (e.g., Cloudways, DigitalOcean App Platform, AWS Lightsail) or traditional cPanel.

## Data Model (high level)
- Users(admin): id, name, email, password_hash, role, created_at
- Services: id, title, slug, description, icon, meta_title, meta_desc, created_at
- Subservices: id, service_id, title, slug, content, faqs, docs_required (json), created_at
- BlogPosts: id, title, slug, content, excerpt, author_id, category, tags(json), featured_image, published_at
- Properties: id, title, slug, type, city, price, area, bedrooms, bathrooms, images(json), description, features(json), contact_number, status
- Enquiries: id, name, email, phone, city, service, message, source_page, created_at

## API / Endpoints (MVP)
- Public: GET / (home), GET /services, GET /services/:slug, GET /blog, GET /blog/:slug, GET /properties, GET /properties/:slug
- Forms: POST /api/enquiries (validates, stores, emails admin)
- Admin (authenticated): CRUD endpoints for services, posts, properties, enquiries export

## Acceptance Criteria — MVP
- Homepage renders with hero, service cards, and CTA buttons and passes responsive checks on mobile and desktop.
- Each service page loads content and enquiry form; submitting stores lead and sends email to admin.
- Admin user can authenticate and create/edit/delete: services, blog posts, properties.
- Property listing page supports filtering by type/city/budget and property detail gallery opens.
- Blog posts are searchable and category/tag pages are present.
- Sitemap.xml generated and accessible at `/sitemap.xml` and `robots.txt` present.
- Google Analytics is installed and events for form-submissions are tracked.
- Basic automated tests for form submission and a smoke test for public endpoints.

## Deliverables
1. Source code repository (public/private as agreed) with clear README and setup instructions.
2. Deployed staging site URL and production deployment to `successtunnel.in` (DNS changes by client).
3. Admin credentials and user guide (PDF) for content management.
4. DB dump and export of initial seed content (if any).
5. 1 month of post-launch bug-fix support.

## Recommended Development Plan & Milestones
1. Week 0: Kickoff, finalize acceptance criteria, content collection.
2. Week 1: Wireframes + design system + homepage mockup.
3. Week 2: Frontend templates + responsive implementation of homepage and services pages.
4. Week 3: Admin panel + CMS integration, blog & downloads management.
5. Week 4: Property listing module, search & filters, lead capture QA.
6. Week 5: SEO, performance optimizations, accessibility checks, final testing.
7. Week 6: Staging review, client feedback, production deploy, DNS/SSL.

## Tests & QA
- Cross-browser smoke tests: Chrome, FF, Edge, Safari.
- Responsive checks: mobile, tablet, desktop breakpoints.
- Form validation and spam protection tests.
- Accessibility spot checks with Lighthouse / axe.
- Performance checks with Lighthouse; target LCP < 2.5s on 4G simulated.

## Handover & Training
- Provide a 60–90 minute recorded walkthrough of the admin panel and content update flows.
- Provide written quick-start guide `README.md` with deployment and environment steps.

## Notes for the Engineer
- Use slugs for URLs (kebab-case). Keep URLs short and descriptive.
- Use lazy-loading for images and WebP fallback where possible.
- Implement structured data for Organization, Website, BreadcrumbList, Article (for blog posts) and Product/Service where appropriate.
- Keep third-party scripts minimal; defer non-critical scripts to reduce render-blocking.

---
If you'd like, I can now: produce a developer-ready task breakdown for the repo (tickets with acceptance criteria), or create the design system next. Which do you prefer?
