// WISH WELL interpretation, not a claim about a historical Tree of Life diagram.
// Positions (x, y in % of the map image) follow Rae's watercolor map in /public/wishwell/wishwell-map.webp.
// Circles carry their own watercolor; Dream, Routine and Pride are the words above, between and below the map.
export type GateShape = 'circle' | 'engine' | 'word';
export interface Gate {
  key: string;
  house: number | null;
  title: string;
  day: string;
  prompt: string;
  detail: string;
  context: string;
  color: string;
  shape: GateShape;
  x: number;
  y: number;
}
export const GATES: Gate[] = [
 {key:'6',house:6,title:'Pride',day:'Your people',prompt:'Who is beside you, what comes naturally to you, and what would you like more room for?',detail:'Relationships, talents and the support you want. Share only what feels useful.',context:'Pride is the small product team. Juno: relationships; Vesta: talents; Chiron: healing/trauma. Invite strengths and support needs; never require trauma disclosure.',color:'#111111',shape:'word',x:49.46,y:98.19},
 {key:'4',house:4,title:'Base',day:'Your home base',prompt:'Where does your life happen—and where do your files, tools and unfinished ideas live?',detail:'Begin with your existing home and digital base.',context:'Google can be the initial digital base, with a pathway to a personal home server. Do not assume either is connected.',color:'#a3845f',shape:'circle',x:49.46,y:88.09},
 {key:'5',house:5,title:'Task',day:'Your real day',prompt:'Walk me through a real day. What keeps asking for your attention?',detail:'Small actions, responsibilities and things you want off your mind.',context:'Tasks belong to House 5. Distinguish an action from a project or outcome without correcting the Hero.',color:'#8a6cc0',shape:'circle',x:49.82,y:67.06},
 {key:'13',house:13,title:'Routine',day:'Your rhythm',prompt:'When do you have room to care, create, rest or ask for help?',detail:'Bring your people, base and daily work into a rhythm.',context:'House 13 is Routine/Earth, between Task and Base. Four six-hour blocks: night, morning, afternoon, evening. Existing routine before prescribed priorities.',color:'#111111',shape:'word',x:49.91,y:77.89},
 {key:'11',house:11,title:'Wish',day:'What you hear',prompt:'What do you keep wishing for—and what do your people keep asking for?',detail:'Your wishes and the wishes of the people you serve.',context:'House 11 is wish data: personal, team and customer stories. A wish can lead to a goal, deal, document or tasks.',color:'#3a82c4',shape:'circle',x:65.40,y:40.43},
 {key:'3',house:3,title:'Goal',day:'What could change',prompt:'If one of those stories changed for the better, what would be different?',detail:'Describe the change. Lorraen helps make it clear and measurable.',context:'Goals are central and connect Project, Wish, Backlog, Deal, Task and the Engine above. Propose SMART wording; ask for unknown measures, dates and scope instead of inventing them.',color:'#f3d24b',shape:'circle',x:49.46,y:49.91},
 {key:'1',house:1,title:'Project',day:'What you’re building',prompt:'What are you bringing into the world, or keeping alive, over the next six months?',detail:'Give an existing venture or idea a place to grow.',context:'Planets are Projects on a six-month cadence with Lean Value Canvases. Each Project has a Goal. Only attach a Plan if outcomes exist.',color:'#d42a2f',shape:'circle',x:32.43,y:40.16},
 {key:'2',house:2,title:'Deal',day:'Give & receive',prompt:'What could you offer, what do you need, and who might you work with?',detail:'Offers, exchanges and agreements worth exploring.',context:'Deals belong to House 2 and have a Goal. They are not completed agreements without evidence.',color:'#6c9a3c',shape:'circle',x:65.49,y:61.01},
 {key:'8',house:8,title:'Outcome',day:'What progress looks like',prompt:'What could you point to and say: that is working?',detail:'Evidence of change, in your own words.',context:'Outcomes are evidence of the Goal being realized. Outcome is the North Node: outcomes and retirement direction. Do not equate completed tasks with outcomes.',color:'#6d6d6d',shape:'circle',x:33.15,y:20.76},
 {key:'document',house:null,title:'Document',day:'What’s in writing',prompt:'What papers, agreements and records already exist—and what still needs to be written down?',detail:'Wills, trusts, operating agreements, contracts and the story of your mission.',context:'Document is the South Node: documents, the nonprofit foundation, the mission and where the work goes. Gather what exists and what is missing. Never claim a document was drafted, signed or filed; legal drafting goes to a professional and nothing here is legal advice.',color:'#c7ccce',shape:'circle',x:66.58,y:20.76},
 {key:'9',house:9,title:'Plan',day:'Bring it together',prompt:'Which change matters enough to make room for—and what would help you get there?',detail:'One Goal, eight Outcome spaces and 64 Task spaces.',context:'A Plan has one Goal, eight Outcomes and 64 task spaces, held between Outcome (North Node) and Document (South Node). Keep unknown spaces empty. Reuse existing Plans before proposing another.',color:'#e9e9e7',shape:'circle',x:49.64,y:11.37},
 {key:'10',house:10,title:'Backlog',day:'Keep the loose threads',prompt:'What still needs doing, even if now is not the time?',detail:'Keep tasks together without making everything urgent.',context:'House 10 is the backlog: tasks gathered across the work. Preserve existing tasks and links; do not autoassign priorities.',color:'#ef8a33',shape:'circle',x:32.07,y:59.84},
 {key:'7',house:7,title:'Engine',day:'How it keeps working',prompt:'What would help this keep moving when life gets busy?',detail:'Support, coordination and a rhythm you can return to.',context:'House 7 coordinates the daily Engine at the center of the map. Lines of care: telemedicine, insurance, legal, travel, technology, financial. Connections require verification.',color:'#9a9a9a',shape:'engine',x:49.46,y:30.51},
 {key:'12',house:12,title:'Dream',day:'Your happily ever after',prompt:'With all of this in place, what does the life you are growing toward feel like?',detail:'Your Dream holds the whole picture and the manifestations of every House.',context:'House 12 is the Dream, above the map in this WISH WELL interpretation. It contains goals, plans, tasks, outcomes, prides and bases. Do not present this product map as historical doctrine.',color:'#111111',shape:'word',x:49.46,y:1.62},
];
export type GateRecord={opened?:boolean;wish:string;feeling:string;reviewed?:boolean;history?:{wish:string;feeling:string;at:string}[]};
export type GateState={version:1;selected:string;records:Record<string,GateRecord>};
export const freshGates=():GateState=>({version:1,selected:'6',records:{}});
export function readGates(raw:string|null):GateState{try{const p=JSON.parse(raw||'null');const s=freshGates();if(p?.version!==1)return s;const sel=String(p.selected);if(GATES.some(g=>g.key===sel))s.selected=sel;for(const g of GATES){const r=p.records?.[g.key];if(r&&typeof r.wish==='string'&&typeof r.feeling==='string')s.records[g.key]={...r,opened:r.opened===true,reviewed:r.reviewed===true,history:Array.isArray(r.history)?r.history.filter((v:any)=>v&&typeof v.wish==='string'&&typeof v.feeling==='string'&&typeof v.at==='string'):[]};}return s;}catch{return freshGates();}}
export const gateProgress=(r?:GateRecord)=>r?.reviewed&&r.history?.length?100:r?.history?.length?60:r?.opened?15:0;
