# Hero journey design review — September 28, 2026

Review branch: `codex/voice-first-onboarding`; draft PR #6. Production is unchanged. Built on main 30d5af6; do not replace newer work wholesale.

## This revision

- Explain the Universal Family Office before asking for input: an operating layer for family care, resources, people, technology and work. The mothership holds the universe; wishes fuel its Engine; the Hero is mind, body and soul.
- Keep “What do you wish for today?” and “How do you feel about it?” exactly. Optional WISH WELL cues help clarify distinct Wishes, Stories, Projects, Goals, Plans, Deals, Tasks, Outcomes and agent briefs.
- Fourteen days are revisitable topics. A checkmark requires a nonempty contribution explicitly kept or submitted for dialogue. Selecting a day or typing alone does not complete it. No timer, expiry, forced order or auto-advance.
- Persist day selection, edited day titles, unfinished words and contribution history in versioned browser storage scoped to signed-in UID or anonymous preview. Retain earlier contributions on revision. Show an error if storage fails. No cross-device sync is claimed. Entity board edits and entity-detail drafts remain session-only.
- Engine geometry: 4×4 outer perimeter, twelve cells, center 2×2 open. Existing product House IDs remain intact. Explicitly assigning a contribution to a component lights that cell. A story added is NOT verified provider activation.
- Shared animated voice orb reacts to listening / thinking / kept contribution. Optional circular camera preview shows the participant locally, requests camera only on click, does not record/upload video, and stops tracks when closed/unmounted. No supplied video asset has been replaced or invented.
- Story view is Neverland; displays saved day contributions plus session drafts, with revisit actions. Golden Ticket / Jungle Book / Story Calendar remain the introductory story route.
- Wonderland is one collection of House resource cards: short context, product, platform, purpose, detail action and available setup/resource link. No duplicate four-card resource section.
- Dinosaurs are living domains serving Goals, with zodiac glyphs and platform logos directly beside platform names. Shopify belongs beside Shopify, not Sanctuary Sell. Corrected the confirmed Sanctuary Self typo to Sanctuary Sell; Sanctuary Cell remains the home-server offering.
- Time / Space / Story share heading styling. Only the Time header was consolidated; Claude’s sky math, wheel, controls and transit behavior are untouched.
- Shared ActionPills styling updated app-wide; local callback actions now work instead of being masked by default external URLs.

## Day topic provenance

Days 1–5 follow the explicit sequence: vision/retirement + telemedicine; UFO/holding company + legal; funding/financial; technology/domains; home server.

The earlier spoken rundown had gaps around the next “small…” topic and another unnamed day. Days 6 and 8 remain editable “Your next component” spaces. Day 7 uses the stated nonprofit/foundation topic; Days 9–11 use insurance, trust/travel, and career/IP. Day 12 also remains open because the remaining numbering was unresolved. Wonderland and Neverland are editable proposed closing topics on Days 13–14, following the stated “then” transition. These day numbers do not remap canonical Houses. Do not present the gaps or proposed closing placements as an approved full curriculum.

## Boundaries

Provider links, partner agreements, enrollment and tool activation are not verified by a checkmark. Template URLs not supplied remain clearly labeled. No automatic medical, legal, insurance or financial action occurs. Plans retain 16 board spaces; each Plan has one Goal, eight Outcomes and 64 Task spaces. Dinosaurs support Goals rather than replacing them.

## Verification

Check TypeScript, production build and tests covering contribution completion, out-of-order resume, revision history, damaged storage, twelve-cell geometry, House resource consolidation, platform labels, CTA semantics and existing framework/board behavior. Live microphone, camera, AI provider and visual browser review are not verified. The deployed preview previously led toward protected Vercel account access and automatic approval review blocked browser access; do not bypass that restriction.
