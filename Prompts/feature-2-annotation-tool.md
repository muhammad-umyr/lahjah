# Feature 2 — Annotation Tool

## Goal
After uploading screenshots on the new request page, a designer can draw 
boxes around specific UI elements that need copy. Each annotation becomes a 
copy slot that the AI will generate copy for in Feature 3. The tool 
attempts to extract existing text from the drawn area using OCR as a 
starting point to save designer time.

## How it works
- Annotation tool appears inline on the new request page immediately after 
  screenshots are uploaded (in the right column)
- A canvas/drawing mode is activated on top of the screenshot
- Designer draws a rectangle by clicking and dragging over a UI element
- The app attempts to run OCR on the drawn region and extract any text
- After drawing, a popup appears with the annotation details (OCR text 
  pre-filled if detected, empty otherwise)
- The annotation is saved with a colored border and label visible on the screenshot
- Designer can add multiple annotations per screenshot
- Designer can delete an annotation by clicking on it and pressing delete
- All annotations are saved to the request in Firestore
- "Generate copy" button becomes active once at least one annotation exists

## Annotation Popup Fields
- Label (text input, required) — e.g. "Main CTA button"
- Type (dropdown): CTA, Heading, Error Message, Tooltip, Body Copy
- Existing copy (text input, auto-populated via OCR when possible) — 
  the current text on the UI element
  - When a designer draws a rectangle, the app attempts to read text 
    from within the drawn area using OCR
  - If OCR detects text, it's pre-filled in the field as a starting point
  - OCR accuracy varies depending on font, size, and image quality — 
    designer should always review and edit as needed
  - If OCR fails or returns empty, the field stays empty for manual input
  - Shows a small loading indicator in the field while OCR is processing
- Character limit (dropdown):
  - Keep approximately the same (±10 characters flexibility)
  - Keep exactly the same as existing copy
  - No character limit
- Task (dropdown) — what the AI should do:
  - Revise English + provide Arabic translation
  - Arabic translation only (keep English as is)
  - English revision only (no Arabic needed)

## OCR Implementation
- Uses Tesseract.js (client-side OCR library)
- Two-phase approach:
  - Phase 1 (pre-scan): when a screenshot is uploaded, full-image OCR 
    runs in the background and caches detected words with positions
  - Phase 2 (on draw): when annotation is drawn, pre-scanned words 
    overlapping the drawn area are returned as the existing copy
  - Fallback: if pre-scan isn't ready, per-crop OCR runs with 
    upscaling and thresholding for better small-text accuracy
- Supports both English and Arabic text recognition
- OCR runs fully client-side with no backend changes

## Data Structure
Each annotation stores:
- id (unique)
- screenshotURL (which screenshot it belongs to)
- label (designer's name for it e.g. "Main CTA button")
- type (CTA / Heading / Error Message / Tooltip / Body Copy)
- existingCopy (current text on the element, OCR extracted or manually entered)
- characterLimit (approximately_same / exactly_same / no_limit)
- task (revise_and_translate / arabic_only / english_only)
- coordinates (x, y, width, height as percentages for responsiveness)

## UI
- Clean toolbar above the screenshot with: Draw mode toggle, Delete button
- Annotations shown as colored rectangles with labels
- Different colors per annotation type:
  - CTA → blue (#1B4FD8)
  - Heading → purple
  - Error Message → red
  - Tooltip → yellow
  - Body Copy → green
- Loading spinner in "Existing copy" field during OCR processing
- Mobile friendly
- Save annotations button to persist to Firestore