# Dream Backlog to Monday.com Flow

The Dream Backlog is the capture layer for wishes, rabbit holes, triggered ideas, story sparks, research trails, and product fragments.

Trello holds the dream.

Monday.com executes the task.

## Purpose

The purpose of this flow is to keep ideas from disappearing while also preventing every idea from becoming an emergency.

A wish should be captured quickly, sorted clearly, and only promoted into execution when it has enough structure to deserve work time.

## Tool Roles

| Tool | Role |
|---|---|
| Trello | Capture and sort wishes, rabbit holes, and dream fragments |
| Notion / Fruitful Frameworks | Decision logic and AI communication rules |
| Monday.com | Execution board for approved work |
| Google Drive | Document output and storage |
| GitHub | Software build tasks and product issues |
| Canva | Visual/public deliverables |
| New Castle | Legal/document-related routing |

## Recommended Trello Lists

```text
00_INBOX_WISHES
01_RABBIT_HOLE
02_SORT_BY_HOUSE
03_READY_FOR_MONDAY
04_RESEARCH_REQUIRED
05_STORY_SPARKS
06_PRODUCT_IDEAS
07_LEGAL_ADMIN_FLAGS
08_WAITING_ON_SIGNAL
99_ARCHIVE
```

## Trello Card Fields

Each card should eventually identify:

- Wish or idea title
- Source
- WISH WELL house
- Planet / department
- Energy level
- Urgency
- Destination tool
- Next action
- Notes / links

## Sources

Possible sources include:

- Dream
- Transit
- Conversation
- Client
- Court / legal
- Content
- Child / family
- Money
- Body
- Research
- App idea
- Grant idea
- Business development

## Promotion Rule

A Trello card becomes a Monday.com item only when it has:

1. A clear next action.
2. A WISH WELL house assignment.
3. A reason to leave the rabbit hole.
4. A destination for execution.

If it does not meet those rules, it stays in Trello.

The rabbit hole may exist. It may not drive the car.

## Monday.com Receiving Groups

Approved cards should land in Monday.com groups such as:

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

## Example Flow

A wish appears:

> Create a user onboarding vault that saves someone's UFO roadmap into Google Drive.

Trello card:

- List: `00_INBOX_WISHES`
- House: House 1 and House 6
- Destination: GitHub + Google Drive + Monday.com

Once clarified:

- Move to `03_READY_FOR_MONDAY`
- Create Monday.com task: Build Google Drive vault creation flow
- Link to GitHub issue or repo doc
- Store supporting notes in Fruitful Frameworks

## Automation Goal

Future automation should:

1. Watch Trello for cards moved into `03_READY_FOR_MONDAY`.
2. Read the card labels and fields.
3. Create a Monday.com item in the correct group.
4. Link the Trello card back to the Monday.com item.
5. Add references to related Drive, GitHub, Canva, or New Castle outputs.

## First Build Priority

1. Create Trello board manually if connector is not available.
2. Create Monday.com execution board.
3. Add the promotion rule to Fruitful Frameworks.
4. Test three example cards.
5. Create Monday.com items from approved cards.

## Outcome

The Dream Backlog protects creative signal without letting it become operational chaos.

Wishes get captured.
Rabbit holes get named.
Execution gets filtered.
Monday.com only receives what is ready to become work.
