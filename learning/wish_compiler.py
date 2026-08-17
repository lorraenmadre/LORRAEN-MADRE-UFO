"""WISH WELL Wish Compiler - Python learning version.

This file mirrors the ideas in src/wishCompiler.ts using beginner Python.
Run it directly and read it from top to bottom.

WISH -> TASK -> STORY -> PRODUCT SIGNAL -> ACTION -> OUTCOME -> RECIPE

This is a learning prototype. It does not make legal, medical, financial,
insurance, custody, or safety decisions. It only structures information and
flags subjects that require human review.
"""


HIGH_STAKES_WORDS = [
    "legal",
    "court",
    "custody",
    "medical",
    "therapy",
    "insurance",
    "safety",
    "violence",
    "abuse",
    "benefits",
    "credit",
    "tax",
]


HOUSE_KEYWORDS = {
    1: ["identity", "family", "business", "entity"],
    2: ["money", "budget", "income", "asset", "price", "financial"],
    3: ["technology", "communication", "email", "phone", "ai"],
    4: ["home", "house", "housing", "health", "food", "care"],
    5: ["project", "build", "create", "product", "play"],
    6: ["system", "habit", "routine", "process", "workflow"],
    7: ["contract", "agreement", "accountability", "legal"],
    8: ["risk", "insurance", "safety", "protection", "compliance"],
    9: ["travel", "therapy", "education", "school", "research", "trust"],
    10: ["story", "legacy", "press", "public", "authority"],
    11: ["community", "partner", "network", "sponsor"],
    12: ["mind", "body", "soul", "regulation", "meditation"],
    13: ["creation", "template", "recipe", "deal", "alchemy"],
}


def normalize(text):
    """Make text easier to compare."""
    return text.strip().lower()


def route_wish_to_houses(statement):
    """Return WISH WELL houses whose visible keywords match the Wish."""
    text = normalize(statement)
    houses = []

    # A loop repeats the same check for every house.
    for house_number, keywords in HOUSE_KEYWORDS.items():
        # any(...) becomes True if at least one keyword appears in the text.
        matches_house = any(keyword in text for keyword in keywords)

        if matches_house:
            houses.append(house_number)

    # House 13 represents the wish-to-deal / creation process.
    if 13 not in houses:
        houses.append(13)

    return houses


def requires_human_review(statement):
    """Flag high-stakes subject matter without deciding the underlying issue."""
    text = normalize(statement)
    return any(word in text for word in HIGH_STAKES_WORDS)


def create_task(statement, desired_state):
    """Turn the Wish into proposed executable work."""
    return {
        "action": f"Create an executable plan for: {desired_state}",
        "source_wish": statement,
        "dependencies": [
            "confirm the current state",
            "identify constraints",
            "identify people and resources involved",
        ],
        "status": "proposed",
    }


def create_story(statement, current_state, desired_state):
    """Turn the task into human context for product development."""
    return {
        "actor": "the person or household making the wish",
        "situation": current_state,
        "need": statement,
        "desired_outcome": desired_state,
        "barriers": [],
        "acceptance_criteria": [
            "the desired state is specific enough to evaluate",
            "the next actions are understandable to the user",
            "high-stakes actions remain under human review",
        ],
    }


def identify_product_signals(story):
    """Turn the gap in the story into reusable product-development evidence."""
    return [
        {
            "problem": (
                f'A gap exists between "{story["situation"]}" and '
                f'"{story["desired_outcome"]}".'
            ),
            "affected_users": [story["actor"]],
            "reusable": True,
            "evidence_needed": [
                "user confirmation",
                "barriers encountered during execution",
                "outcome after the task is completed",
            ],
        }
    ]


def compile_wish(wish_id, owner_id, statement, current_state, desired_state):
    """Run the smaller recipes and return one structured Wish dictionary."""
    task = create_task(statement, desired_state)
    story = create_story(statement, current_state, desired_state)
    human_review_required = requires_human_review(statement)

    wish = {
        "id": wish_id,
        "owner_id": owner_id,
        "statement": statement,
        "current_state": current_state,
        "desired_state": desired_state,
        "houses": route_wish_to_houses(statement),
        "tasks": [task],
        "story": story,
        "product_signals": identify_product_signals(story),
        "approval_required": human_review_required,
        "human_review_required": human_review_required,
        "status": "captured",
    }

    return wish


def explain_wish(wish):
    """Print the important parts in human language."""
    print("\nWISH")
    print(wish["statement"])

    print("\nDESIRED STATE")
    print(wish["desired_state"])

    print("\nWISH WELL HOUSES")
    print(wish["houses"])

    print("\nTASK")
    print(wish["tasks"][0]["action"])

    print("\nSTORY")
    print(wish["story"])

    print("\nPRODUCT SIGNAL")
    print(wish["product_signals"][0]["problem"])

    print("\nHUMAN REVIEW REQUIRED")
    print(wish["human_review_required"])


if __name__ == "__main__":
    # Change these three lines first when you practice.
    example_wish = compile_wish(
        wish_id="wish-example-001",
        owner_id="example-user",
        statement=(
            "I wish I could relocate my family and keep school, housing, "
            "money, and healthcare stable."
        ),
        current_state="The household is preparing for a major transition.",
        desired_state=(
            "The family is established in a stable new home with essential "
            "services connected."
        ),
    )

    explain_wish(example_wish)
