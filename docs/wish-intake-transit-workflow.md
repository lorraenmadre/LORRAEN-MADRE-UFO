# WISH WELL — Wish intake and transit-guided daily work
Status: workflow specification, 2026-09-24. Complements planning contract 2026-09-24.1.
Implemented this turn: verified Steer read, Slack read/post and daily Steer-to-Slack schedule. Full execution routing and dashboards remain unimplemented.

## Screen structure
1. Upper half: Gantt lanes for planetary Projects. Each bar has a project ID, planet, confirmed start/end dates, linked Goals and milestones. Missing dates show as unscheduled, never fabricated.
2. Timing overlay: source-dated Steer transits and Panchang windows. Daily snapshots are point-in-time observations; do not extrapolate them into six months of precise transit bars. Longer transit windows need an actual date-range source.
3. Lower half: today's work sample, split into Rae / AI / Waiting, with owner, estimated duration, output, dependency, task URL and state.
4. House and agent dashboards: filtered views of the same task records, showing assigned, running, testing, waiting and completed-with-evidence work. Agent assignment is not proof of dispatch; a Slack post is not proof of execution.

## Distinct mappings
A Project belongs to a planet lane. Its Tasks belong operationally to House 5 and link to House 3 Goals, House 8 Outcomes and House 9 Plans. Store natal_house_from_ascendant, natal_house_from_moon and wish_well_house in distinct fields.
Steer data is sidereal Vedic; do not mix tropical natal placements. Keep planet-to-project mapping versioned. Do not invent transits for Uranus, Neptune, Pluto or asteroids when Steer has not returned them.

## Wish intake
Keep Symphony as the first pilot intake candidate because Rae already uses it for UGC; its cross-app capabilities must be verified. A future WhatsApp channel should use the same intake contract.
Input: original_text, author, source_channel, source_message_id, received_at, home_id.
Classification: wish / clarification / status request / task update. Preserve original wording.
Routing: identify existing Project and Goal; propose missing Goal/Outcome relationships. A simple actionable wish may produce a linked Task before a full Mandalart plan is complete.
Idempotency: source_channel + source_message_id uniquely identifies intake. Retries update/link existing records rather than duplicating tasks. One wish can yield several distinct tasks using stable child keys.
Receipt: respond with captured wish, proposed routing, task link, owner, next action and any blocker. Never say 'added to Trello' without the returned card ID and URL.

## Prioritization
First apply deadlines, urgent needs, readiness/dependencies and available time. Then consider user-confirmed impact and optional transit alignment as a qualitative tie-breaker. Explain the reason for each selected task; do not invent a numerical astrology score.
Start with no more than three daily priorities. Move a task to EAST only after the assigned human or agent begins. NORTH means evidence awaits validation; DONE requires the relevant acceptance check. WEST records a waiting reason and next review date.
A favorable transit cannot complete a task, overcome a missing dependency, prove an outcome or justify making commitments without authorization.

## AI execution contract
Dispatch requires a task ID, owner, approved scope, accessible input, exact expected output/destination, time or spending limits where relevant and acceptance criteria.
Return run ID, actual tool actions, artifact links, errors, timestamps and test evidence.
Do not let agents reply under another agent's identity. Leonardo messages begin LEONARDO (ChatGPT); Steve and Bruce provide their own responses.
No blanket permission for brand outreach, purchases or publishing is created by wish intake.

## First pilot
Test wish: 'I wish to turn the smart/home technology I already use into paid UGC opportunities.'
Proposed route: Mercury / integrated marketing, supported by Venus / content; actual Project and Goal IDs must be resolved.
First proposed task: create an inventory of three existing products and one filmable demonstration idea for each.
AI output: a draft inventory and three hooks, based on supplied evidence.
Human input: confirm ownership/use and choose the demonstrations.
Acceptance: original wish retained, one correctly routed card returned, same-message retry creates no duplicate, AI output linked, human review recorded, completion visible in the House and daily views.
Do not send brand pitches during this routing test.

## Verified status and blockers
- Steer Astro birth/transit and Panchang calls succeeded for 2026-09-24 and Miami.
- Slack #ai-board C0C43DJK21J read and first LEONARDO transit post succeeded.
- Daily briefing scheduled for mornings around 8 AM America/New_York, starting September 25. This initial schedule reads Steer and Slack, and proposes work; it does not activate Trello cards.
- Trello board listing failed with 401 invalid key despite a listed active connection. Reconnection is required before testing card creation through that connection.
- Symphony MCP connection list currently exposes TikTok. Other integrations are being assessed with Symphony; absence from that MCP list is not evidence that all native integrations are absent.
- Direct WhatsApp Business connection is not active here.
- Gantt UI, full House dashboards, task dispatch, receipt synchronization and messaging intake adapters have not been built by this specification.
