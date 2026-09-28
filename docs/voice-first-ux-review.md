# Voice-first UX review — September 28, 2026

Built on main commit 30d5af6, retaining Claude’s Time view, birth-chart calculations, entity detail pages and framework data. Review branch: codex/voice-first-onboarding. Do not replace newer main changes wholesale.

## Implemented

- A fourteen-day, self-paced orientation with day markers and no prescribed daily questionnaire replaces mandatory formation steps as the first experience. The old mothership checklist is retained under disclosure.
- Shared story/talk component on the home screen and entity detail screens: optional browser dictation, explicit stop, editable transcript, user-initiated submit, dialogue context, error recovery and typed fallback.
- Lighter Mulish 300 AI responses, preserved line breaks and clear speaker labels.
- Story tab collects explicitly selected draft types. Wishes, Stories, Projects, Goals, Plans, Deals, Tasks, Outcomes and Dinosaur briefs remain distinct. AI does not silently create operational records.
- Space uses the canonical sixteen PLAN_SLOTS. Earth, Houses, agents and satellites remain available outside the Plan board.
- Translucent gray assignment pieces and a separate gold Queen. Hover/focus shows assignment details; tap opens an editable person, role, Goals and Tasks panel.
- Wonderland names the Houses; Rabbit Hole names the existing sky wheel. Time/Space/Story remain the main views.
- Twenty-three original social SVG assets are reused from the website repository. Incorrect Claude→Canva and CRM→Clubhouse substitutions were removed. Platforms without a supplied matching asset use their name.
- Gradual House links include Trello, Notion, Anthropic cookbooks and Composio. They do not pretend to be published WISH WELL template downloads or active integrations.

## Execution limits to retain in the UI

Notes, assignments and Story drafts are session-only. Reloading loses them. No database persistence, agent activation, external task creation or automatic plan generation is claimed. Microphone availability depends on browser support and permission; browser speech recognition can use the browser provider’s speech service. No live microphone or AI-provider call was exercised during verification.

The rejected fourteen prompts have been removed. The two opening questions are “What do you wish for today?” and “How do you feel about it?” Optional WISH WELL cues guide dialogue. Engine categories introduce Sunshine Pocket Therapy, WealthCounsel, On my way!, Sanctuary Cell, The Cookbook (tech and kitchen), and Soup Club. They are not House numbers, fixed days, verified partnerships or active enrollment. Neverland collects Stories and introduces Golden Ticket / Jungle Book / Story Calendar. Satellite creation adds session-only records in the selected framework/example; Plans retain sixteen slots. A Plan retains one Goal, eight Outcome spaces and 64 Task spaces. Do not fill unknown spaces with invented work. Dinosaur briefs describe agents supporting Goals; they do not convert Goal records into agent records.

Next integration work: stable record IDs linking captured stories to existing Project/Goal/Plan/Deal/Task models; persistence scoped to the signed-in person; validated template URLs for Dream Backlog and Fruitful Frameworks; WISH WELL Cookbook download; cross-app shared voice component and a microphone test on supported devices. Person assignment fields currently record entered Goals/Tasks as text, not database relations.

## Verification

TypeScript check and production build pass. Seven tests pass, including sixteen-plan cardinality, separate Queen, correct platform matching, founder/framework isolation and existing orbit navigation. Visual browser verification of the new branch and live voice-provider testing remain outstanding. Production has not been merged or changed by this branch.
