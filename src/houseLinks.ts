// Product Houses: what each House's product is for, and where to download or open it.
export const RESOURCES:Record<string,{url:string;label:string;note:string}>={
 'product-house-1':{url:'https://omw.life/',label:'Download omw.life',note:'OMW · Miami Family Travel Club'},
 'product-house-4':{url:'https://github.com/anthropics/claude-cookbooks',label:'Read Anthropic cookbooks',note:'Tech recipes · WISH WELL tech and kitchen edition to follow'},
 'product-house-6':{url:'https://www.notion.com/',label:'Open Notion',note:'Fruitful Frameworks template download not yet linked'},
 'product-house-10':{url:'https://trello.com/',label:'Open Trello',note:'Dream Backlog template download not yet linked'},
 'product-house-12':{url:'https://junglebook.lorraenmadre.com/',label:'Explore Jungle Book',note:'Golden Ticket · Story Calendar'},
};

export const HOUSE_PURPOSES:Record<number,string>={
 1:'Get your family moving together. omw.life coordinates recurring family routes and travel, the first product your mothership runs.',
 2:'Explore your resources and timing. Keep the questions behind your money decisions in view.',
 3:'Clarify the change you want. Shape a Goal and the evidence that will tell you it is working.',
 4:'Build with practical recipes for technology, food and family life. Start with what you have.',
 5:'Bring your people and work together. Coordinate a sprint and keep the next action visible.',
 6:'Give your routines a home. Organize the repeatable ways your family office works.',
 7:'Coordinate the daily Engine. Keep your documents, actions and accountability connected.',
 8:'Know what progress looks like. Gather Outcomes, evidence, protection and exit questions.',
 9:'Give a Goal a Plan: eight Outcomes and 64 Task spaces, with room for trust, travel and care.',
 10:'Keep the wish before it gets lost. Collect your intentions and stories in the Dream Backlog.',
 11:'Keep your people connected. Organize relationships, conversations and the next follow-up.',
 12:'Gather your Stories across the Houses. Let the Story Calendar invite your next chapter.'
};
