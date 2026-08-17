# UNDERSTAND YOUR OWN CODE

This is the plain-English map of the **Lorraen Madre UFO / WISH WELL** repository.

You do not need to memorize the codebase.
You need to understand what each layer is responsible for and be able to follow one Wish through the system.

---

# 1. The One Sentence

**WISH WELL turns a human wish into a task, turns the task into a story, uses the story as product-development evidence, and routes the resulting work through a human-governed Universal Family Office.**

The core lifecycle is:

```text
WISH
  ↓
TASK
  ↓
STORY
  ↓
PRODUCT SIGNAL
  ↓
ACTION
  ↓
OUTCOME
  ↓
PATTERN
  ↓
RECIPE
```

A **Wish** is the atomic unit.

The houses, planets, products, tools, documents, and professionals are the environment the Wish moves through.

---

# 2. Start With These Five Files

Do not begin by reading every file. That is how perfectly intelligent people end up staring into `node_modules` wondering where their life went wrong.

Read these in this order:

## 1. `README.md`

This explains the whole ecosystem.

Think of it as the **map legend**.

It answers:

- What is Lorraen Madre?
- What is the UFO?
- What is WISH WELL?
- What are the houses?
- Which tools do what?

## 2. `src/types.ts`

This defines the **nouns** the software understands.

Examples:

```text
Entity
Ecosystem
Wish
WishTask
WishStory
ProductSignal
WishOutcome
```

A TypeScript `interface` is basically a form that says:

> If you call something a Wish, these are the fields it should contain.

## 3. `src/wishCompiler.ts`

This is the best file for learning the actual logic.

It defines how a Wish can move from ordinary human language into structured data.

Read it top to bottom.

The most important function is:

```typescript
compileWish(...)
```

That function collects the other steps and returns one structured `Wish` object.

## 4. `src/App.tsx`

This is the **front-end control room**.

It decides what the user sees and tracks things like:

- signed-in user
- preview mode
- selected ecosystem entity
- Google connection status
- framework view vs business view

Think of React `useState` as the app's short-term memory while the page is open.

## 5. `server.ts`

This is the **back-office worker**.

The browser asks the server to perform actions such as:

- authenticate
- connect Google
- create Drive folders
- create Google Docs
- save metadata

The front end shows things.
The server does protected work.

---

# 3. The Codebase as a Family Office

You can understand the repository using the same organizational language as WISH WELL.

| Code area | Plain-English job |
|---|---|
| `src/App.tsx` | Reception desk / user interface |
| `src/components/` | Individual rooms and visual tools |
| `src/types.ts` | Forms and definitions |
| `src/constants.ts` | Preloaded map of the ecosystem |
| `src/wishCompiler.ts` | Wish-to-story product-development logic |
| `src/geminiService.ts` | AI communication layer |
| `server.ts` | Back-office operations |
| Firebase | User/account database |
| Google Drive | User-owned document vault |
| `/docs` | Operating manuals |

---

# 4. What the Current App Already Does

The current app already has:

1. React front end.
2. Firebase authentication.
3. Google OAuth connection.
4. Google Drive folder creation.
5. Google document generation.
6. Gemini-powered chat and structured generation.
7. WISH WELL ecosystem entities.
8. A documented routing system for Trello, Monday, Drive, GitHub, Canva, New Castle, and other tools.
9. Human-review boundaries for high-stakes work.

The biggest missing product layer was that the code understood the **map** better than it understood the **thing traveling through the map**.

That is why `Wish` was added as a first-class data type.

---

# 5. Understand `src/types.ts`

Here is the most important idea:

```typescript
export interface Wish {
  id: string;
  statement: string;
  currentState?: string;
  desiredState: string;
  tasks: WishTask[];
  story?: WishStory;
  productSignals: ProductSignal[];
  humanReviewRequired: boolean;
  status: WishStatus;
}
```

Read that in English:

> A Wish has an ID, the person's statement, their current and desired states, tasks, a story, product-development signals, governance information, and a status.

The symbols mean:

```text
string       = text
boolean      = true or false
number[]     = a list of numbers
WishTask[]   = a list of tasks
?            = optional
|            = one allowed option OR another
```

So this:

```typescript
humanReviewRequired: boolean;
```

means:

> Every Wish must say either true or false about whether human review is required.

And this:

```typescript
story?: WishStory;
```

means:

> A Wish may have a structured story, but it is allowed to exist before the story has been created.

---

# 6. Understand `src/wishCompiler.ts`

This file is intentionally written like a cookbook.

Each function is a recipe.

## Recipe 1: Normalize text

```typescript
function normalize(text: string): string {
  return text.trim().toLowerCase();
}
```

English:

> Take text, remove extra spaces, and make it lowercase so comparisons are easier.

## Recipe 2: Route a Wish

```typescript
routeWishToHouses(statement)
```

English:

> Look for transparent keywords and identify which WISH WELL houses might be relevant.

This is currently a simple rule-based prototype.

That matters because you can see exactly why something was routed.

## Recipe 3: Check for human review

```typescript
requiresHumanReview(statement)
```

English:

> If the Wish contains high-stakes subjects such as legal, medical, insurance, custody, safety, or financial issues, flag it for a human boundary.

The function does **not** decide the legal, medical, or insurance question.

It only says:

> A qualified human needs to stay in this loop.

## Recipe 4: Create the Task

```typescript
createTask(statement, desiredState)
```

English:

> Turn the Wish into a proposed piece of work.

## Recipe 5: Create the Story

```typescript
createStory(statement, currentState, desiredState)
```

English:

> Explain who is trying to change what, why, what could block them, and what success should mean.

This is the product-development layer.

## Recipe 6: Identify Product Signals

```typescript
identifyProductSignals(story)
```

English:

> Turn the gap in the story into something that can be researched as a repeated user problem.

If many Wishes reveal the same problem, that can become evidence for a reusable product, service, program, policy, or recipe.

## Recipe 7: Compile the Wish

```typescript
compileWish(...)
```

English:

> Run the Wish through the recipes and package the result into one structured object.

This is the central idea of the system.

---

# 7. Follow One Example Wish

Input:

```text
I wish I could relocate my family and keep school, housing, money, and healthcare stable.
```

The compiler receives:

```text
current state
+ desired state
+ wish statement
```

Then it creates:

```text
Wish
├── statement
├── currentState
├── desiredState
├── houses
├── task
├── story
├── productSignals
├── humanReviewRequired
└── status
```

The purpose is not to have the computer magically solve someone's life.

The purpose is to convert an ambiguous desire into a structure that a person, AI assistant, project-management system, document system, and professional network can work with together.

---

# 8. TypeScript vs Python

You are learning Python, but this repo is mainly TypeScript.

That is not a problem.

The concepts transfer directly.

| Programming concept | TypeScript | Python |
|---|---|---|
| Variable | `const wish = ...` | `wish = ...` |
| List | `string[]` / `[1, 2]` | `list` / `[1, 2]` |
| Dictionary/object | `{ name: 'Rae' }` | `{ 'name': 'Rae' }` |
| Function | `function compileWish()` | `def compile_wish():` |
| True/false | `boolean` | `bool` |
| Loop | `for (const item of items)` | `for item in items:` |
| Condition | `if (...)` | `if ...:` |
| Data definition | `interface Wish` | `dataclass` or dictionary |

When learning Python, translate the same Wish lifecycle rather than studying disconnected toy problems.

---

# 9. Your Interview-Level Explanation

You should be able to explain the repository without opening every file:

> The UFO is a React and TypeScript interface for a user-owned family-office system. The core object is a Wish, which represents a desired change in the user's real-world state. A Wish can be compiled into structured tasks, a user story, product signals, WISH WELL routing, and governance flags. The front end presents the ecosystem, Firebase maintains user identity, the server handles protected integrations, Google Drive provides a user-owned document vault, and AI can assist with interpretation and drafting while high-stakes actions remain under explicit human review.

Do not memorize that word for word.

Understand the chain.

---

# 10. The Five Questions to Ask When Reading Any File

When code looks confusing, ask only these:

1. **What goes into this file or function?**
2. **What comes out?**
3. **What information does it store?**
4. **What decision does it make?**
5. **What is it NOT allowed to decide?**

If you can answer those five questions, you understand the useful part of the code.

---

# 11. Your First Learning Exercises

Do these in order.

### Exercise 1

Open `src/wishCompiler.ts` and find:

```typescript
EXAMPLE_WISH
```

Change only the `statement`, `currentState`, and `desiredState`.

Predict which houses will activate before running anything.

### Exercise 2

Add one keyword to one house inside:

```typescript
HOUSE_KEYWORDS
```

Explain why you added it.

### Exercise 3

Find:

```typescript
HIGH_STAKES_WORDS
```

Explain why the list causes **review**, rather than making a decision.

### Exercise 4

Translate `normalize()` into Python.

TypeScript:

```typescript
function normalize(text: string): string {
  return text.trim().toLowerCase();
}
```

Python equivalent:

```python
def normalize(text):
    return text.strip().lower()
```

### Exercise 5

Translate `requiresHumanReview()` into Python.

That teaches you:

- variables
- lists
- functions
- loops / comprehensions
- booleans
- string methods
- return values

without making you calculate the area of a rectangle for no earthly reason.

---

# 12. What Comes Next

The next product-development steps should be:

```text
1. Capture a Wish in the UI.
2. Store it as a Wish object.
3. Let the user clarify current state and desired state.
4. Generate or edit the Story.
5. Let the user approve Tasks.
6. Route approved Tasks to the correct tool.
7. Attach documents and provenance.
8. Record the Outcome.
9. Compare repeated Product Signals.
10. Turn recurring patterns into Recipes.
```

That turns the current UFO from an ecosystem map into a working **Wish-to-product-development engine**.

---

# 13. The Mental Model to Keep

You do not need to think like a programmer first.

Think like a systems designer:

```text
DATA = what do we know?
FUNCTION = what recipe are we running?
CONDITION = what rule applies?
LOOP = what are we repeating?
TYPE = what kind of thing is this?
API = what outside system are we talking to?
DATABASE = what needs to be remembered?
UI = what does the human need to see or control?
```

That is programming stripped of the ceremonial robes.

And for WISH WELL:

```text
WISH = desired change
TASK = executable work
STORY = human context
PRODUCT SIGNAL = reusable problem evidence
ACTION = approved intervention
OUTCOME = what actually happened
PATTERN = what repeats
RECIPE = reusable solution
```

If you understand that chain, you understand the heart of this repository.
