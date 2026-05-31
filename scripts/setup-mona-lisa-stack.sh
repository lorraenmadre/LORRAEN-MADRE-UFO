#!/usr/bin/env bash

set -euo pipefail

ROOT="$HOME/MonaLisaStack"
REPOS="$ROOT/repos"

printf "\nCreating Mona Lisa Stack local workspace...\n"
mkdir -p "$ROOT"
mkdir -p "$REPOS"
mkdir -p "$ROOT/local-ai"
mkdir -p "$ROOT/legal-test"
mkdir -p "$ROOT/content-engine"
mkdir -p "$ROOT/exports"
mkdir -p "$ROOT/agent-protocols"
mkdir -p "$ROOT/workflow-imports"
mkdir -p "$ROOT/kdp-publishing"
mkdir -p "$ROOT/shopify-sanctuary-cell"
mkdir -p "$ROOT/vercel-deployments"
mkdir -p "$ROOT/logs"

printf "\nCloning or updating repositories...\n"
cd "$REPOS"

clone_or_pull() {
  local repo_url="$1"
  local dir_name="$2"

  if [ -d "$dir_name/.git" ]; then
    printf "Updating %s...\n" "$dir_name"
    cd "$dir_name"
    git pull --ff-only || true
    cd "$REPOS"
  else
    printf "Cloning %s...\n" "$dir_name"
    git clone "$repo_url" "$dir_name"
  fi
}

clone_or_pull "https://github.com/lorraenmadre/LORRAEN-MADRE-UFO.git" "LORRAEN-MADRE-UFO"
clone_or_pull "https://github.com/lorraenmadre/New-Castle-vibes-.git" "New-Castle-vibes-"

cat > "$ROOT/README.md" <<'EOF'
# Mona Lisa Stack Local Workspace

This folder is the local workstation container for Lorraen Madre UFO, New Castle, Fruitful Frameworks, and the Mona Lisa content-to-cash system.

## Folder Map

- repos: cloned GitHub repositories
- local-ai: Ollama, AnythingLLM, Open WebUI, and local model testing notes
- legal-test: New Castle legal and document testing workspace
- content-engine: clips, captions, content plans, and platform drafts
- exports: rendered and exported assets
- agent-protocols: prompts and role instructions for Mona Lisa agents
- workflow-imports: Dify, Flowise, n8n, CrewAI, or other workflow files
- kdp-publishing: Amazon KDP book upload notes, metadata, descriptions, keywords
- shopify-sanctuary-cell: Shopify product notes and product page drafts
- vercel-deployments: app deployment notes, domains, build checks, env var checklist
- logs: local setup and testing notes

## Source Repos

- repos/LORRAEN-MADRE-UFO
- repos/New-Castle-vibes-

## First Use

1. Open this folder in VS Code or Cursor.
2. Install dependencies inside each repo with npm install.
3. Create environment files only from official project requirements.
4. Never commit local environment files or private tokens.
EOF

cat > "$ROOT/agent-protocols/mona-lisa-operator-agent.md" <<'EOF'
# Mona Lisa Operator Agent

## Role

The Mona Lisa Operator Agent receives an idea, wish, task, content concept, product thought, legal/admin note, or story spark and routes it into the correct operating lane.

## Output Format

Input Summary:
WISH WELL House:
Planet / Day:
Content Path:
Destination Tool:
Next Action:
Needs Approval:
Risk / Human Review:
Suggested Task Name:
Suggested Slack Update:

## Routing Rules

- Rabbit hole or dream fragment goes to Trello / Dream Backlog.
- Execution task goes to Monday.com.
- Technical build goes to GitHub issue.
- Document or legal/admin item goes to New Castle / Drive.
- Receipt or decision goes to Notion / Fruitful Frameworks.
- Public content goes to the platform path for the day.
- Visual asset goes to Canva.
- Product task goes to Shopify.
- App deploy task goes to Vercel.

## Approval Rule

Anything involving publishing, money, legal/admin, health/safety, platform credentials, domains, or user data requires founder approval before action.
EOF

printf "\nMona Lisa Stack setup complete.\n"
printf "Workspace created at: %s\n" "$ROOT"
printf "Repos located at: %s\n" "$REPOS"
printf "\nNext: open %s in VS Code or Cursor.\n" "$ROOT"
