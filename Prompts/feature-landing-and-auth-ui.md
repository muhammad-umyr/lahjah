# Feature — Landing Page & Auth UI

## Goal
Update the visual design and content of the landing page, login page, 
and onboarding page to reflect Lahjah's brand identity and internal 
HungerStation audience.

## 1. Animated Gradient Background (Global)

Create a shared CSS animation that will be used across the landing 
page, login page, and onboarding page.

Add to app/globals.css:

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-gradient-bg {
  background: linear-gradient(
    -45deg,
    #FFFDE7,
    #87CEEF,
    #FFB3BA,
    #D4B8F0
  );
  background-size: 400% 400%;
  animation: gradient-shift 20s ease-in-out infinite;
  min-height: 100vh;
}

## 2. Floating Arabic Letters Component

Create components/FloatingLetters.tsx:

- Use useEffect to generate 20-25 letter instances on mount
- Each letter randomly picks from this Arabic alphabet array:
  ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 
   'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 
   'ل', 'م', 'ن', 'ه', 'و', 'ي']
- Each letter has randomized:
  - x position (0-100vw)
  - y position (0-100vh)
  - font size (40px-120px)
  - animation duration (15s-30s)
- Color: rgba(255, 255, 255, 0.20) — flat opacity, no variation
- Font: Noto Kufi Arabic, bold
- Animation: drift upward slowly with slight sway
- z-index: 0 (behind all content)
- All content above it uses z-index: 1

Add CSS to globals.css:

@keyframes float-letter {
  0% { transform: translateY(0px) translateX(0px); opacity: 0; }
  10% { opacity: 0.20; }
  90% { opacity: 0.20; }
  100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
}

## 3. Lahjah Logo Font

Import Noto Kufi Arabic in app/layout.tsx:

import { Noto_Kufi_Arabic } from 'next/font/google'
const notoKufi = Noto_Kufi_Arabic({ 
  subsets: ['arabic'], 
  weight: '700',
  variable: '--font-noto-kufi'
})

Apply this font to the "لهجة" logo text on ALL pages:
- app/page.tsx (landing page header)
- app/login/page.tsx
- app/onboarding/page.tsx

## 4. Landing Page (app/page.tsx)

### Header
- Logo: "لهجة" in Noto Kufi Arabic Bold
- Keep HungerStation logo mark on the left
- Keep "Sign in" and "Get started" buttons on the right

### Hero Section
- Apply animated-gradient-bg class to the full page wrapper
- Add <FloatingLetters /> component behind all content
- Badge: "♥ Built by HS Product Design Team"
  (use SVG heart icon, not emoji)
- Headline: "The copy tool built for HungerStation teams"
- Subtitle: "Generate and review product copy in English 
  and Arabic, in minutes."
  (no em dashes)
- Single CTA button: "Start generating copy" 
  (yellow #FFEA00, #222629 text)
- Below CTA, small gray text: "Available to all HungerStation 
  employees. Sign in with your Google account."

### Features Section
- Section title: "Faster copy. Less back and forth."
- No subtitle paragraph
- Three cards with frosted glass style:
  background: rgba(255, 255, 255, 0.70)
  backdrop-filter: blur(12px)
  border: 1px solid rgba(255, 255, 255, 0.80)
  border-radius: 1rem

  Card 1:
  Title: "For Designers"
  Description: "Submit copy requests without leaving 
  your workflow"

  Card 2:
  Title: "For Copy Team"
  Description: "Review, approve, and give feedback 
  in one place"

  Card 3:
  Title: "For Everyone"
  Description: "Bilingual by default — EN and AR 
  generated together"

### Footer
- Left: "لهجة · Lahjah" in Noto Kufi Arabic
- Right: Link to /adapt that says "Adapt Lahjah for your entity"
- Remove all copyright text

## 5. Login Page (app/login/page.tsx)

- Apply animated-gradient-bg to the page wrapper
- Add <FloatingLetters /> behind the card
- Card: white background, soft shadow, rounded-2xl
- Logo "لهجة" in Noto Kufi Arabic Bold centered above card
- Card title: "Sign in to Lahjah"
- Remove "By continuing you agree to our Terms of Service."
- Keep email/password fields and sign in/create account flow
- Keep yellow #FFEA00 CTA button

## 6. Onboarding Page (app/onboarding/page.tsx)

- Apply animated-gradient-bg to the page wrapper
- Add <FloatingLetters /> behind the card
- Card: white background, soft shadow, rounded-2xl
- Selected role card state: #222629 black border, white background
- Selected role title: #222629 black (not yellow)
- Keep "Get started" CTA button yellow (#FFEA00)

## General Rules
- No em dashes (—) anywhere in visible copy
- Yellow (#FFEA00) is ONLY used for primary CTA buttons
- Selected/active states use #222629 black
- All content sits above FloatingLetters at z-index: 1

## After Changes
- Run npm run build to verify no errors
- Update CLAUDE.md to reflect new UI components
- Commit and push