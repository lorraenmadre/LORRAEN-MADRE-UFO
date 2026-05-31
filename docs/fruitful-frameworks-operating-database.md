# Fruitful Frameworks Operating Database Protocol

The Fruitful Frameworks Operating Database is the automation-friendly Google Sheets layer for the Lorraen Madre UFO / WISH WELL / Mona Lisa Stack system.

Google Sheet:
https://docs.google.com/spreadsheets/d/1Dlef6lPpQYUJvl1aIRcRidURgcMICu5kVGxHKEjqtFU/edit

## Core Rule

Sheets routes. Notion remembers. Slack talks. Monday executes. GitHub builds. Drive stores. CrewAI thinks. Composio gives agents hands.

## Why Google Sheets

Google Sheets is the first operating database because it is free, automation-friendly, easy for CrewAI and Composio to read/write, and already lives inside the Google ecosystem with Gmail, Calendar, and Drive.

Notion remains the visual headquarters and receipt layer. Google Sheets is the routing table and automation database. Supabase can become the app backend later.

## Sheet Tabs

| Tab | Purpose |
|---|---|
| README | Root instructions and important links |
| WISH WELL Houses | Canonical house map with Notion page URLs |
| Startup Templates | Startup in a Box templates mapped to WISH WELL houses and agents |
| Mona Lisa Agents | Seven agents plus the Operator Agent |
| Content Paths | Seven platform paths by weekday/planet |
| Tool Routing | Where each input type should go |
| Task Queue | Execution-ready work items |
| Approval Queue | Items requiring founder approval |
| Content Engine Log | Daily one-hour content engine record |
| App Deployment | Lorraen Madre UFO and New Castle deployment tracker |
| Book KDP Tracker | Book and publishing workflow |
| Credit Repair Tracker | Factual documentation tracker; human review required |
| Drive Vault Index | Google Drive folder and document routing |
| Decision Log | Operating decisions and reasons |

## Automation Flow

1. Input arrives from Slack, manual note, Gmail, Drive, GitHub, or another connected tool.
2. CrewAI runs the Mona Lisa Operator Agent.
3. Operator checks the Operating Database tabs.
4. Operator classifies the input by WISH WELL house, agent, content path, destination tool, approval requirement, and human-review requirement.
5. Composio executes only approved tool actions.
6. Slack receives approval requests and blocker updates.
7. Monday receives execution-ready work.
8. GitHub receives technical issues or protocol/document updates.
9. Notion receives receipts and operating context.
10. Drive stores source files and outputs.

## Approval Rule

Founder approval is required before actions involving:

- Public publishing
- Money, pricing, checkout, banking, finance, credit, insurance, or fundraising
- Legal/admin matters
- Health, safety, custody, benefits, or compliance matters
- Credentials, domains, account creation, app deployment, file deletion, sending messages, or user data

## Human Review Rule

Human review is required for legal, medical, tax, financial, insurance, safety, custody, benefits, compliance, or credit-related actions. The system may organize facts, links, files, and next-action drafts, but must not create final claims, final filings, final disputes, or final advice.

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

## Current Status

The seed Google Sheet has been created and populated with the current WISH WELL houses, agents, content paths, tool routing rules, operating queues, deployment tracker, book/KDP tracker, Drive vault index, and Startup in a Box template mappings.

A final Startup in a Box 47-template audit remains open because Notion database query tooling returned an internal error during row extraction. The currently mapped rows came from accessible Notion pages and targeted searches.