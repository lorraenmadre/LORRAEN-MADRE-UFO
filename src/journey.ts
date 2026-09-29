import {useEffect,useState} from 'react';

export const JOURNEY_DAYS = [
 {title:'Vision & retirement',focus:'Begin with the life you want to grow into. Care comes first: Sunshine Pocket Therapy introduces the telemedicine line of the Engine.',cue:'What would happily ever after look like for you—and what support would help you move toward it?'},
 {title:'Your UFO & legal foundation',focus:'Name your mothership and explore what it needs to hold. WealthCounsel is the proposed legal drafting route.',cue:'What do you want your family office to organize and protect?'},
 {title:'Funding & financial',focus:'Describe what needs funding and what resources already exist. Soup Club introduces the business direction around insurance leads and commissions.',cue:'What are you trying to fund, and what do you already have to work with?'},
 {title:'Technology & domains',focus:'Take stock of your domains, accounts and tools. The Cookbook introduces practical recipes for building your family office.',cue:'Where do your ideas, files and work live today?'},
 {title:'Your home server',focus:'Explore Sanctuary Cell: a home for your digital world, starting with your existing hardware and the work you want it to support.',cue:'What would you like your home server to make possible?'},
 {title:'Your next component',focus:'An open space in your journey. Name this day around the component you are working on.',cue:'Which part of your universe needs attention today?',open:true},
 {title:'Your foundation & nonprofit',focus:'Give your mission a place in your mothership. Gather the people, purpose and work you want it to support.',cue:'Who or what do you want your foundation to serve?'},
 {title:'Your next component',focus:'An open space in your journey. Bring a workshop, a question or a piece of work you want to develop.',cue:'What would you like to add to your family office?',open:true},
 {title:'Insurance & protection',focus:'Explore the insurance line of the Engine. Gather your questions and what you want protected before choosing professional support.',cue:'What matters to you to protect, and what do you need to understand?'},
 {title:'Trust & travel',focus:'Connect your plans for trust and travel. On my way! introduces the travel line of the Engine.',cue:'Where are you headed, who is part of that journey, and what needs organizing?'},
 {title:'Career, IP & your work',focus:'Tell the story of your work. Gather your creations and questions about intellectual property, copyright and trademarks.',cue:'What have you created, and what would you like to build next?'},
 {title:'Your next component',focus:'Keep space for another part of your universe. Name the topic when you are ready.',cue:'Which part of your story have we not made room for yet?',open:true},
 {title:'Explore Wonderland',focus:'Meet the product Houses. Choose the tools, resources and connections that fit your work.',cue:'Which House could help with the wish you are working on?',proposed:true},
 {title:'Open Neverland',focus:'Bring your Stories together. Begin with Golden Ticket, Jungle Book and the Story Calendar, then return whenever your story changes.',cue:'What chapter are you ready to carry forward?',proposed:true},
];
export type Contribution={id:string;day:number;wish:string;feeling:string;kind:string;component:number|null;createdAt:string};
export type DayNote={wish:string;feeling:string};
export type JourneyState={version:2;day:number;component:number|null;titles:Record<string,string>;notes:Record<string,DayNote>;contributions:Contribution[]};
export const emptyJourney=():JourneyState=>({version:2,day:0,component:null,titles:{},notes:{},contributions:[]});
export const hasContribution=(state:JourneyState,day:number)=>state.contributions.some(c=>c.day===day&&c.wish.trim());
export function addContribution(state:JourneyState,input:Omit<Contribution,'id'|'createdAt'>,id:string,now:string):JourneyState{
 if(!input.wish.trim()||input.day<0||input.day>13) return state;
 const last=state.contributions[state.contributions.length-1];
 if(last&&last.day===input.day&&last.wish===input.wish.trim()&&last.feeling===input.feeling.trim()&&last.kind===input.kind&&last.component===input.component)return state;
 return {...state,notes:{...state.notes,[input.day]:{wish:input.wish.trim(),feeling:input.feeling.trim()}},contributions:[...state.contributions,{...input,wish:input.wish.trim(),feeling:input.feeling.trim(),id,createdAt:now}]};
}
export function decodeJourney(raw:string|null):JourneyState {
 try {const p=JSON.parse(raw||'null');if(!p||p.version!==2||!Array.isArray(p.contributions))return emptyJourney();
 const s=emptyJourney();s.day=Number.isInteger(p.day)&&p.day>=0&&p.day<14?p.day:0;s.component=Number.isInteger(p.component)&&p.component>=1&&p.component<=12?p.component:null;
 for(const [key,value] of Object.entries(p.titles||{}))if(/^([0-9]|1[0-3])$/.test(key)&&typeof value==='string')s.titles[key]=value;
 for(const [key,value] of Object.entries(p.notes||{})){const n=value as DayNote;if(/^([0-9]|1[0-3])$/.test(key)&&n&&typeof n.wish==='string'&&typeof n.feeling==='string')s.notes[key]=n;}
 s.contributions=p.contributions.filter((c:any)=>c&&typeof c.id==='string'&&Number.isInteger(c.day)&&c.day>=0&&c.day<14&&typeof c.wish==='string'&&c.wish.trim()&&typeof c.feeling==='string'&&typeof c.kind==='string'&&typeof c.createdAt==='string'&&(c.component===null||(Number.isInteger(c.component)&&c.component>=1&&c.component<=12)));
 return s;
 }catch{return emptyJourney();}
}
export function useJourney(scope:string){
 const key=`wishwell:journey:v2:${scope}`;
 const read=()=>{try{return decodeJourney(localStorage.getItem(key));}catch{return emptyJourney();}};
 const [snapshot,setSnapshot]=useState(()=>({key,data:read()}));
 const [storageError,setStorageError]=useState('');
 const data=snapshot.key===key?snapshot.data:read();
 useEffect(()=>{if(snapshot.key!==key){setSnapshot({key,data:read()});setStorageError('');}},[key,snapshot.key]);
 const update=(next:JourneyState)=>{setSnapshot({key,data:next});try{localStorage.setItem(key,JSON.stringify(next));setStorageError('');return true;}catch{setStorageError('This browser could not save your progress. Keep this page open; these changes are in memory only.');return false;}};
 return {data,update,storageError};
}
