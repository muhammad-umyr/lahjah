# Feature 1 — New Request Flow

## Goal
A designer can create a new copy request from the dashboard, annotate 
the uploaded screenshots, generate copy, and submit for review — all 
in one continuous flow on the same page.

## Form Fields
- Request title (text input, required)
- Domain (dropdown, required): Shopping, New Verticals, Growth, 
  Fulfillment, Fintech
- Target Audience (dropdown, required): Customer, Vendor, Rider, 
  Internal, External
- Publishing deadline (date picker, required)
- Screenshot upload (multiple images, stored in Firebase Storage, 
  show upload progress per file, show thumbnail preview after upload)
  - Supports drag and drop onto the upload zone
  - Supports paste from clipboard (Cmd+V)
  - Shows "Drop images here" overlay when dragging over the zone
  - Only accepts PNG, JPG, WEBP — shows error for other file types
- Annotation tool (inline, appears immediately after screenshots are uploaded)
- Feature context (textarea, required)
  - Subtitle: "Describe what the feature or design does, how the user 
    will interact with it, and the business rationale behind it. Give 
    full context of the user journey."
- What problem does it solve? (textarea, required)
  - Subtitle: "Explain both the user pain point and the business pain 
    or goal this feature addresses. Why does this feature exist?"
- How do similar competitors do it? (textarea, optional)
  - Subtitle: "How do similar competitors (Keeta, Jahez, Ninja, etc.) 
    do it?"
  - Includes optional screenshot upload field for competitor references
- Tone selector (pills): Friendly, Professional, Playful, Urgent, Formal
- Locked terms (tag input)

## Flow
1. Designer fills in title
2. Selects Domain, Target Audience, Publishing deadline
3. Uploads screenshots (drag/drop, click, or paste)
4. Annotation tool appears inline in the right column — designer annotates 
   at least one element
5. Designer fills in feature context, problem statement, and optionally 
   competitor research
6. Selects tone and adds any locked terms
7. "Generate copy" button becomes enabled only after at least one 
   annotation exists
8. Designer clicks "Generate copy" — results appear inline below the 
   two columns
9. For each annotation, designer sees:
   - New AI suggestion with a one-click copy button (copies to clipboard, 
     shows "Copied!" for 2 seconds)
   - Previous suggestion retained and shown below as "Previous suggestion"
   - "Write my own" option that reveals a text input for custom copy
   - Checkbox to select the string for submission
10. Designer selects preferred EN and AR option per annotation
11. Designer can select multiple strings using checkboxes
    - "Select all" option at the top of results
    - Bulk action bar appears when strings are selected:
      "X strings selected — Submit selected for review"
12. Designer clicks "Save & Submit for review" — saves selections to 
    Firestore and changes status to "submitted"
13. Designer is redirected to the request detail page (read-only view)

## Copy Generation Results
- Each annotation result shows:
  - EN suggestion with copy icon (one-click copy to clipboard)
  - AR suggestion with copy icon (one-click copy to clipboard)
  - Previous suggestion (if regenerated) shown as collapsed option below
  - "Write my own" toggle that reveals a text input for custom copy
  - Checkbox for selecting the string for bulk submission
- "Copied!" toast appears for 2 seconds after copying
- Copy button works for both English and Arabic suggestions

## Behaviour
- Save as Draft → saves to Firestore with status: "draft"
- Save & Submit for review → saves copy selections and changes 
  status to "submitted"
- Each request stores: title, domain, targetAudience, 
  publishingDeadline, context, problemStatement, 
  competitorResearch, competitorScreenshotURLs, tone, 
  lockedTerms, screenshotURLs, annotations, selectedCopy, 
  status, createdBy (user ID), createdAt (timestamp)
- After submitting, redirect to request detail page in read-only mode
- Dashboard lists all requests with title, status badge, date, 
  raised by, and assigned to info

## UI Layout
- Full width liquid layout — no max-width container
- Two column layout side by side:

  LEFT COLUMN (form, ~40% width):
  - Request title
  - Domain, Target Audience, Publishing deadline (grouped in a row)
  - Feature context
  - What problem does it solve?
  - How do similar competitors do it? (with optional screenshot upload)
  - Tone selector
  - Locked terms

  RIGHT COLUMN (screenshots + annotation, ~60% width):
  - Screenshot upload zone at the top
    - Drag and drop enabled
    - Clipboard paste enabled
  - After upload, annotation canvas fills the right column
  - Large annotation workspace so screenshots are easy to draw on
  - Annotation list below the canvas showing all added annotations
  - Each annotation shows: label, type badge, existing copy, 
    designer note

- Copy generation results appear below both columns in full width
- On mobile: stack into single column (form on top, annotation 
  below, results at the bottom)

## Sticky Bottom Bar
- Sticky at the bottom of the viewport, visible at all times 
  while scrolling
- Two elements stacked vertically with a small gap:

  TOP: Generate copy widget (floating above the CTA bar)
  - White background, subtle shadow, rounded corners
  - "Generate copy" heading on the left
  - "Add at least one annotation above to enable generation" subtext
  - "Generate copy" button on the right
  - Visually separated from the CTA bar below

  BOTTOM: CTA bar
  - "Save as draft" (secondary, #F4F5F6 background, #222629 text)
  - "Save & Submit for review" (primary, #FFEA00 background, 
    #222629 text)
  - Both buttons right-aligned
  - Compact width with px-6 padding — not full width
  - Subtle top border or shadow separating from page content

- Form content has enough bottom padding so the last input 
  isn't hidden behind the sticky elements
- Mobile friendly — stack CTAs vertically on small screens

## UI Style
- Clean minimal design using Tailwind
- Primary CTA: #FFEA00 background, #222629 text
- Secondary CTA: #F4F5F6 background, #222629 text
- Show loading states during upload, annotation save, and generation
- Mobile friendly
- Dashboard request cards show the first screenshot as a thumbnail 
  on the left side with a count if multiple screenshots exist
- Dashboard cards show: raised by (displayName), assigned to 
  (Copy Team reviewer if any)