# Wish entry and orbit UI

The sign-in and app wordmarks use Belleza. Wish entry uses the rounded monochrome card from the September 17 reference: a multiline wish, Begin button, helper copy and starter prompt. The status says “ready when you are”; microphone capture is not implemented. Requests still use the existing AI service. Connection errors are visible and keep the entered wish.

Pilot Protection replaces the next-project heading.

Framework mode has its own empty entity state, including offering seeds, zodiac dinosaurs and satellites. Structural labels remain; customer names, descriptions, platforms, connection claims, logos and generated content start empty. Edits cannot update the founder example. As before, edits are session-only.

Orbit view uses React, SVG ellipses and CSS rotation/counter-rotation. These are illustrative navigation orbits, not astronomical positions or a new ownership hierarchy. Every workspace opens its existing detail screen. Motion pauses on hover, keyboard focus and the Pause control, and respects reduced-motion preferences. Planet shortcuts and an Outline view provide stationary navigation. Small screens can scroll the orbital canvas horizontally.

Validation: npm test, npm run lint, npm run build. Browser verification could not complete in this environment: agent-browser failed to start and the Chromium download timed out. Review desktop/mobile rendering and real AI/auth behavior in the deployment preview before releasing. Existing AI credentials, auth, hosting and permanent data storage are outside this change.
