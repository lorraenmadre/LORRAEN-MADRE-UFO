// Product Houses: what each House's product is for, and where to download or open it.
export const RESOURCES:Record<string,{url:string;label:string;note:string}>={
 'product-house-1':{url:'https://omw.life/',label:'Download omw.life',note:'OMW · Miami Family Travel Club'},
 'product-house-3':{url:'https://github.com/anthropics/claude-cookbooks',label:'Read Anthropic cookbooks',note:'The Cookbook and The Key build on these recipes'},
 'product-house-4':{url:'https://sanctuary-cell.myshopify.com/',label:'Visit Sanctuary Cell',note:'Home server store · products launching soon'},
 'product-house-6':{url:'https://www.notion.com/',label:'Open Notion',note:'Fruitful Frameworks template download not yet linked'},
 'product-house-10':{url:'https://drive.google.com/',label:'Open Google Drive',note:'Newcastle command center not yet built · Drive is its home'},
 'product-house-12':{url:'https://trello.com/',label:'Open Trello',note:'Dream Backlog template download not yet linked'},
 'product-house-13':{url:'https://wishingreel.lorraenmadre.com/',label:'Join the Wishing Reel',note:'2027 movie calendar · $13'},
};

export const HOUSE_PURPOSES:Record<number,string>={
 1:'Get your family moving together. omw.life coordinates recurring family routes and travel, the first product your mothership runs.',
 2:'Run your Home Economy. makeCENTS keeps cash, credit and crypto as departments of your own family bank.',
 3:'Clarify the change you want with the Wish Well GPT, then follow the Cookbook and The Key to build it with AI.',
 4:'Give your family office a home server. Sanctuary Cell has the kits to run it yourself.',
 5:'Bring your people and work together. Coordinate a sprint and keep the next action visible.',
 6:'Give your routines a home. Organize the repeatable ways your family office works.',
 7:'Keep the daily Engine on time. Woo Woo Watch shows when to act, and every action leaves a receipt.',
 8:'Know what progress looks like. Gather Outcomes, evidence, protection and exit questions.',
 9:'Give a Goal a Plan: eight Outcomes and 64 Task spaces, with room for trust, travel and care.',
 10:'Organize your digital life. Newcastle holds your documents, folders and timeline in one private command center.',
 11:'Keep your people connected. Organize relationships, conversations and the next follow-up.',
 12:'Keep the wish before it gets lost. Collect every wish and dream in the Dream Backlog.',
 13:'Choose today’s story. The Wishing Reel gives you one movie, one lesson and one trip to dream about each day.'
};
