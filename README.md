# Cypher Analytica — Stitch redesign

The homepage retains the supplied Stitch layout and compiled styles. The site includes 29 responsive HTML pages, course filtering, real syllabus PDFs, existing student media, a mobile menu, and counseling through a WhatsApp draft.

## Run

Install Node.js, then run `npm run dev` in this folder and open `http://127.0.0.1:4173/`.

## Build and deploy

Run `npm run build`. Upload the contents of `dist/` to a static web host. Existing `.html` course URLs are retained. The `.openai/hosting.json` file identifies the private Sites preview.

## Inquiry behavior

The counseling form validates the details and opens a prefilled WhatsApp draft. The visitor must press Send in WhatsApp. It does not claim that a callback was booked or silently submit to the old CRM. An automated email/CRM submission requires a separately configured backend endpoint.

## Content

Brand assets, syllabi, review videos, placement graphics and inner-page text come from the supplied old-site ZIP. Three photographic assets come from the supplied Stitch design. Google Fonts supplies Manrope, Hanken Grotesk and Material Symbols. The compiled layout CSS is local and does not require Tailwind's browser CDN.

Illustrative salary guarantees, numeric course review ratings and certificate-verification claims from the prototype have been removed or replaced with supported content. Current batches, course durations and marketing copy should receive a business review before replacing the public domain.

## Validation

Production build checks page/asset links. Source checks cover unique IDs, internal anchors and the four functional course filters. Responsive media rules cover mobile, tablet and desktop; a browser/device matrix was not run. The live domain has not been changed.

## Existing backend

The original ZIP also contains a larger Express/MongoDB backend. It has not been copied into this static website deliverable, and its environment credentials have not been published.
