# Fruitful Frameworks Operating Database Protocol

The Fruitful Frameworks Operating Database is the automation-friendly Google Sheets layer for the Lorraen Madre UFO / WISH WELL / Mona Lisa Stack system.

Google Sheet:
https://docs.google.com/spreadsheets/d/1NazA22tK9pAMokK7D5GqZgg-vrpl_do2ajjRCgj2Kow/edit

## Core Rule

Sheets routes. Notion remembers. Slack talks. Monday executes. GitHub builds. Drive stores. CrewAI thinks. Composio gives agents hands.

## Why Google Sheets

Google Sheets is the first operating database because it is free, automation-friendly, easy for CrewAI and Composio to read/write, and already lives inside the Google ecosystem with Gmail, Calendar, and Drive.

Notion remains the visual headquarters and receipt layer. Google Sheets is the routing table and automation database. Supabase can become the app backend later.

## Sheet Tabs

| Tab | Purpose |
|---|---|
| `00_README` | Root instructions and important links |
| `01_WISH_WELL_HOUSES` | Canonical house map with Notion page URLs |
| `02_STARTUP_TEMPLATES` | Startup in a Box templates mapped to WISH WELL houses and agents |
| `03_MONA_LISA_AGENTS` | Seven agents plus the Mona Lisa Operator Agent |
| `04_CONTENT_PATHS` | Seven platform paths by weekday/planet |
| `05_TOOL_ROUTING` | Where each input type should go |
| `06_TASK_QUEUE` | Execution-ready work items |
| `07_APPROVAL_QUEUE` | Items requiring founder approval |
| `08_CONTENT_ENGINE_LOG` | Daily one-hour content engine record |
| `09_APP_DEPLOYMENT_TRACKER` | Lorraen Madre UFO and New Castle deployment tracker |
| `10_BOOK_KDP_TRACKER` | Book and publishing workflow |
| `11_DRIVE_VAULT_INDEX` | Google Drive folder and document routing |
| `12_CREDIT_REPAIR_TRACKER` | Factual documentation tracker with human review boundary |

## Automation Flow

1. Input arrives from Slack, manual note, Gmail, Drive, GitHub, Notion, Google Calendar, or another connected tool.
2. CrewAI runs the Mona Lisa Operator Agent.
3. The Operator checks the Operating Database tabs.
4. The Operator classifies the input by WISH WELL house, agent, content path, destination tool, approval requirement, and human-review requirement.
5. Composio executes only approved tool actions.
6. Slack receives approval requests, blocker updates, and agent status messages.
7. Monday receives execution-ready work.
8. GitHub receives technical issues or protocol/document updates.
9. Notion receives receipts and operating context.
10. Drive stores source files and outputs.

## Agent Read Order

When routing any task, agents should read the tabs in this order:

1. `01_WISH_WELL_HOUSES`
2. `02_STARTUP_TEMPLATES`
3. `03_MONA_LISA_AGENTS`
4. `04_CONTENT_PATHS`
5. `05_TOOL_ROUTING`
6. Matching queue/log tab for the action

## Approval Rule

Founder approval is required before actions involving:

- Public publishing
- Money, pricing, checkout, banking, finance, credit, insurance, or fundraising
- Legal/admin matters
- Health, safety, custody, benefits, or compliance matters
- Credentials, domains, account creation, app deployment, file deletion, sending messages, or user data

## Human Review Rule

Human review is required for legal, medical, tax, financial, insurance, safety, custody, benefits, compliance, or credit-related actions. The system may organize facts, links, files, and next-action drafts, but must not create final claims, final filings, final disputes, or final advice.

## Queue Rules

### Task Queue

Use `06_TASK_QUEUE` only for execution-ready work.

A task is execution-ready only when it has:

- Clear next action
- WISH WELL house
- Agent owner
- Destination tool
- Approval flag
- Status

### Approval Queue

Use `07_APPROVAL_QUEUE` when an agent recommends action but founder approval is required.

### Content Engine Log

Use `08_CONTENT_ENGINE_LOG` for daily content engine receipts and published links.

### App Deployment Tracker

Use `09_APP_DEPLOYMENT_TRACKER` for Lorraen Madre UFO, New Castle, Vercel, environment variable, domain, and build-status work.

## Startup in a Box Sync

The Notion Startup in a Box template database has been mirrored into `02_STARTUP_TEMPLATES` with:

- Template name
- Startup stage
- WISH WELL house
- Primary agent
- Template URL
- Destination tool
- Approval flag
- Status
- Notes

This tab is the automation database mirror of the Notion template routing system.

## Repo Usage

This repo should reference the Operating Database when building:

- Routing logic
- CrewAI agent prompts
- Composio tool permissions
- Content-path automations
- Vercel deployment checklists
- GitHub issue templates
- Monday.com mirroring logic
- Google Drive vault routing
- New Castle document intake routing

## Current Status

The Google Sheet has been created and seeded with WISH WELL houses, Startup in a Box template mappings, Mona Lisa agents, content paths, tool routing rules, operating queues, deployment tracker, book/KDP tracker, Drive vault index, and credit repair tracker.

A final Startup in a Box 47-template audit remains open because Notion database query tooling returned an internal error during row extraction. The currently mapped rows came from accessible Notion pages and targeted searches.
