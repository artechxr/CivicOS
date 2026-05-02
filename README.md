# CivicOS – AI Election Companion

CivicOS is a production-ready, AI-powered election assistant designed to help citizens track their election readiness, find polling booths, and compare candidates objectively.

## Features
- **Civic Journey**: Step-by-step interactive roadmap for election readiness.
- **AI Election Coach**: Context-aware AI (Powered by Gemini) that provides proactive nudges and neutral election guidance.
- **Smart Navigator**: Google Maps integration showing nearby polling booths, distances, and wait times with a robust fallback UI.
- **Candidate Comparison**: Detailed side-by-side view of candidates, their education, and records.
- **Data Insights**: Visualized previous election turnout and vote margins to remind users why their vote matters.

## Tech Stack
- **Framework**: Next.js (React 18)
- **Styling**: Material UI (MUI), Framer Motion
- **Services (Google Cloud)**:
  - Gemini 2.5 Flash API (AI Coach)
  - Google Maps JavaScript API (Navigator)
  - Firebase Auth / Firestore SDKs (Prepared)
- **Testing**: Jest + React Testing Library

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_key_here
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Access the application at [http://localhost:3000](http://localhost:3000).

## Testing Coverage

This project includes a robust test suite covering core logic, component rendering, mock APIs, and UI fallbacks.

To run the tests and view the coverage report:
```bash
npm run test
```

**Current Test Coverage includes:**
- Action and Insight Card UI rendering.
- Readiness Score calculation and accurate prop rendering.
- Google Maps fallback rendering and badge checks.
- AI Coach (`ChatPanel`) interactions, input validation, typing states, and proactive contextual nudges.

## Accessibility
The application implements strict ARIA labeling (`aria-label`, `role="main"`), readable color contrast, semantic HTML, and keyboard navigation to ensure maximum accessibility.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Design Decisions

- Modular architecture with separation of concerns
- Lightweight intent engine without external APIs
- Scalable Firebase-based backend

## Edge Case Handling

- Handles empty and invalid inputs safely
- Prevents unsafe input usage
- Graceful fallback for unknown queries

## Testing Strategy

- Unit tests for intent detection
- Validation of translation structure
- UI component rendering tests

## Accessibility

- ARIA labels added for better usability
- Semantic roles used for assistive technologies

## Security

- Firestore rules enforce authentication
- Input sanitization implemented
- Security headers defined
