# LORRAEN MADRE UFO

**TIME . space + Story**

LORRAEN MADRE UFO is the public-facing Universal Family Office interface for the WISH WELL operating system. It is designed to help a person move from a wish, story, or signal into a structured family-office-style container with documents, tasks, templates, AI communication, and execution pathways.

This repository is the software mirror for the Lorraen Madre ecosystem: a platform where the user can explore the UFO roadmap, connect Google, create or map a Drive vault, sort work through the WISH WELL houses, and eventually route ideas into tools like Fruitful Frameworks, Dream Backlog, Monday.com, New Castle, Canva, and GitHub.

## Project Purpose

The UFO is not just a dashboard. It is a container for turning story into structure.

The intended flow is:

1. A user enters the Lorraen Madre platform.
2. The user explores the UFO roadmap and WISH WELL system.
3. The user connects Google / Gmail.
4. A personal UFO vault is created or mapped in Google Drive.
5. The user's documents, wishes, tasks, templates, and outputs are organized through the WISH WELL houses.
6. Dream fragments and rabbit holes are captured in Trello as the Dream Backlog.
7. Approved backlog items move into Monday.com for execution.
8. Legal and document-heavy work routes into New Castle.
9. Public assets move into Canva.
10. Software projects become GitHub repos or issues.

## Core System Map

| Layer | Role |
|---|---|
| **Lorraen Madre** | Public front door and TIME . space + Story design studio |
| **UFO** | Personal Universal Family Office container |
| **WISH WELL** | 12/13-house operating system for life, business, documentation, and strategy |
| **Fruitful Frameworks** | Notion headquarters for AI communication, systems, prompts, decisions, and frameworks |
| **Google Drive** | User-owned document vault and output storage |
| **Trello / Dream Backlog** | Rabbit-hole capture layer for wishes, ideas, story sparks, and triggered thoughts |
| **Monday.com** | Execution layer for approved backlog items, projects, sprints, owners, and timelines |
| **New Castle** | Legal/document shell for intake, summaries, case timelines, and drafts |
| **Canva** | Visual and public asset layer |
| **GitHub** | Technical mirror for apps, repos, product development, and automation logic |

## WISH WELL House Structure

The platform organizes life and work through a 12/13-house architecture:

| House | Function |
|---|---|
| House 1 | Identity, timing, family business, UFO entry, New Castle connection |
| House 2 | Value, assets, money movement, pricing, offers |
| House 3 | Energy, technology, communication, domains, AI connectors |
| House 4 | Home, holistic health, care, food, household wellness |
| House 5 | Play, work, projects, creative production |
| House 6 | Systems, habits, Fruitful Frameworks, SOPs, weekly operating rhythm |
| House 7 | Contracts, daily accountability, agreements, scorecards |
| House 8 | Risk, insurance, protection, safety, compliance |
| House 9 | Trust, travel, therapy, education, research, curriculum |
| House 10 | Story, legacy, public authority, press, standards |
| House 11 | Community, network, sponsors, partners, allies |
| House 12 | Mind, body, soul, spiritual practice, nervous system regulation |
| House 13 | Creation, alchemy, meta-templates, wish-to-deal process |

## UFO Planetary Alignment Layer

The UFO also uses a planetary operating layer where each planet or point represents a functional department or product lane.

| Planet / Point | Function |
|---|---|
| Sun | Brand identity and public front door |
| Moon | AI video, testimony, emotional proof, story production |
| Mercury | Internal logic, system framework, communication |
| Venus | Content library, education, beauty, relational design |
| Mars | Business activation, movement, execution |
| Jupiter | Capital container, expansion, funding logic |
| Saturn | Digital architecture, stewardship, structure |
| Uranus | Membership, SaaS, future community |
| Neptune | Myth, movie, immersive story world |
| Pluto | AI agentic framework and transformation logic |
| North Node | Future vision and long-term security |
| South Node | Nonprofit mission and release point |
| Chiron | Core wound, healing architecture, wound-to-wisdom logic |
| Part of Fortune | Trust key and prosperity through alignment |
| Comet | Charter, timing, covenant, and governance trail |

## Google Drive Vault Structure

When a user connects Google, the intended vault root is:

```text
00_LORRAEN_MADRE_UFO_HOME
```

Starter folder structure:

```text
00_START_HERE
01_UFO_PROFILE
02_WISH_WELL_HOUSES
03_NEW_CASTLE_CONNECTION
04_TEMPLATES_AND_OUTPUTS
05_AI_COMMUNICATION_LOGS
06_SHARED_EXPORTS
99_ARCHIVE
```

The first expansion priority is:

1. UFO Profile + Planetary Alignments
2. House 1: Identity / Timing / Family Business
3. House 6: Systems / Habits / Fruitful Frameworks
4. New Castle Connection
5. Dream Backlog to Monday.com execution flow

## Dream Backlog to Monday.com Execution

Trello acts as the Dream Backlog.

It catches wishes, rabbit holes, story fragments, research trails, product ideas, symbols, triggered thoughts, and creative sparks before they take over the day.

Monday.com acts as the execution layer.

A Trello card becomes a Monday.com item only when it has:

1. A clear next action.
2. A WISH WELL house assignment.
3. A reason to leave the rabbit hole.
4. A real execution destination.

Suggested Monday.com receiving groups:

```text
Body / Home / Regulation
Legal / Admin / New Castle
UFO Build
Content / Canva / Public Assets
Outreach / Partnerships
Money / Grants / Capital
Kids / School / Family
Research / Papers / Doctrine
GitHub / Product Development
```

## New Castle Connection

New Castle is the legal/document shell. It connects through House 1 because House 1 holds identity, timing, family business, entity structure, and the first container.

Intended New Castle functions:

- Legal intake
- Uploaded documents
- Document summaries
- Case timelines
- Legal templates
- Task extraction
- Output drafts
- Routing documents into the correct WISH WELL house

## Current Technical Stack

This app currently uses:

- React
- TypeScript
- Vite
- Express
- Firebase Auth
- Google OAuth flow
- Google APIs
- Gemini / Google GenAI
- Tailwind-related tooling
- Lucide icons
- Motion animations

## Current App Concepts

The repo currently includes concepts such as:

- Ecosystem map
- Entity snapshots
- Lorraen Madre chat
- Initial entity map
- Google connection state
- Firebase sign-in
- Framework / business view modes

## Local Development

### Prerequisites

- Node.js
- npm
- Gemini API key
- Firebase configuration
- Google OAuth credentials if testing Google connection flows

### Install dependencies

```bash
npm install
```

### Environment setup

Create a `.env.local` file and add the required environment variables.

At minimum:

```bash
GEMINI_API_KEY=your_key_here
```

Additional Firebase and Google OAuth variables may be required depending on the local configuration.

### Run locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Type check / lint

```bash
npm run lint
```

## Product Roadmap

Near-term priorities:

1. Rewrite generic starter language across the app into Lorraen Madre / UFO language.
2. Add a clear onboarding path for Google connection.
3. Define the Google Drive vault creation or mapping flow.
4. Add WISH WELL house routing for user documents and tasks.
5. Add Fruitful Frameworks as the AI communication HQ.
6. Add Dream Backlog logic for wishes and rabbit holes.
7. Add Monday.com execution mapping for approved tasks.
8. Define New Castle document intake and routing.
9. Add README-linked documentation under `/docs`.
10. Prepare the app for real user testing.

Recommended documentation files to add next:

```text
docs/fruitful-frameworks-vault-map.md
docs/dream-backlog-to-monday-flow.md
docs/new-castle-document-routing.md
docs/wish-well-house-index.md
docs/google-drive-vault-structure.md
```

## Important Notes

This project touches life organization, family office modeling, legal document organization, therapy-adjacent support systems, and financial planning concepts. It is a platform and documentation architecture, not a replacement for licensed legal, medical, mental health, tax, or financial advice.

## Project Identity

Lorraen Madre is a TIME . space + Story design studio building Universal Family Office systems through the WISH WELL framework.

The UFO is the operating container.

WISH WELL is the house system.

Fruitful Frameworks is the AI communication headquarters.

Dream Backlog catches the wish.

Monday.com executes the task.

New Castle protects the document trail.

Google Drive holds the vault.

GitHub makes the system buildable.
