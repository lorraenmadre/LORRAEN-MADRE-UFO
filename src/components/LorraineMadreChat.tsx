import React,{useState,useRef,useEffect,useId} from 'react';
import {askLorraine} from '../geminiService';
import VoiceOrb from './VoiceOrb';
export type StoryDraft={id:string;text:string;kind:string;context:string};
type Words={wish:string;feeling:string};
interface Props {context?:string;onCapture?:(draft:StoryDraft)=>void;initialWords?:Words;onWordsChange?:(words:Words)=>void;onContribution?:(words:Words&{kind:string})=>boolean;day?:number;dayCue?:string;children?:React.ReactNode}
const CUES:Record<string,string>={'Tell my story':'What happened, and what would you like to happen next?','Imagine a goal':'What change would matter to you—and how would you recognize it?','Shape a project':'What do you want to build or bring into being?','Explore an offering or deal':'What could you offer, to whom, and what would an agreement need?','Find my next task':'What is one action that could move your wish forward?','Connect a Satellite':'Which person, service or tool belongs in your universe?'};
export default function LorraineMadreChat({context='Your UFO',onCapture,initialWords,onWordsChange,onContribution,day,dayCue,children}:Props){
 const id=useId();const [query,setQuery]=useState(initialWords?.wish||'');const [feeling,setFeeling]=useState(initialWords?.feeling||'');const [cue,setCue]=useState('');const [messages,setMessages]=useState<{role:string;text:string}[]>([]);const [busy,setBusy]=useState(false);const [listening,setListening]=useState(false);const [notice,setNotice]=useState('');const [kind,setKind]=useState('Wish');const [saved,setSaved]=useState(false);const recognition=useRef<any>(null);const words=useRef({wish:query,feeling});
 useEffect(()=>()=>recognition.current?.abort(),[]);
 const change=(next:Words)=>{words.current=next;setQuery(next.wish);setFeeling(next.feeling);setSaved(false);onWordsChange?.(next);};
 const talk=()=>{
  if(listening){recognition.current?.stop();return;}
  const C=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;
  if(!C){setNotice('Voice dictation is unavailable in this browser. You can type your story below.');return;}
  const r=new C();recognition.current=r;r.lang=navigator.language;r.interimResults=false;r.continuous=false;
  r.onresult=(e:any)=>change({...words.current,wish:[words.current.wish,e.results[0][0].transcript].filter(Boolean).join(' ')});
  r.onend=()=>setListening(false);r.onerror=()=>{setListening(false);setNotice('The microphone could not listen. Check permission or keep typing.');};
  try{r.start();setListening(true);setNotice('Listening. Review your words before keeping or sending them.');}catch{setNotice('The microphone could not start. Please try typing.');}
 };
 const keep=()=>{
  if(!query.trim())return false;
  recognition.current?.stop();
  if(onContribution){const persisted=onContribution({wish:query,feeling,kind});setSaved(persisted);setNotice(persisted?`Day ${(day??0)+1} contribution saved. You can return and build on it anytime on this browser.`:'Your contribution is in memory, but this browser could not save it. Keep this page open.');return persisted;}
  onCapture?.({id:crypto.randomUUID(),text:[query.trim(),feeling.trim()?`How I feel: ${feeling.trim()}`:null].filter(Boolean).join('\n\n'),kind,context});
  setSaved(true);setNotice(`${kind} draft kept in this session’s Neverland Story board.`);return true;
 };
 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();if(!query.trim()||busy)return;recognition.current?.stop();if(onContribution||onCapture)keep();
  const text=[query.trim(),feeling.trim()?`How I feel: ${feeling.trim()}`:null].filter(Boolean).join('\n\n');setBusy(true);setMessages(m=>[...m,{role:'Hero',text}]);
  try{const reply=await askLorraine(text,`${context}\nWISH WELL cue: ${CUES[cue]||dayCue||'Listen first; clarify the right piece of work together.'}\nConversation so far: ${messages.slice(-8).map(m=>m.role+': '+m.text).join('\n')}`);setMessages(m=>[...m,{role:'Lorraen',text:reply||'Hero, what would you like to make clearer first?'}]);}
  catch{setNotice('The conversation service is unavailable. Your words are still here. Your wish was logged locally; an AI reply is not available right now.');}finally{setBusy(false);}
 };
 return <section className="lm-dialogue" id={onContribution?'daily-conversation':undefined} aria-label={`Story and talk: ${context}`}>
 <div className="lm-dialogue-top"><span>LORRAEN MADRE</span><span role="status">{listening?'listening':busy?'considering your story':'ready when you are'}</span></div>
 <div className="lm-orb-opening"><VoiceOrb state={listening?'listening':busy?'thinking':saved?'saved':'ready'}/><h2 className="lm-section-title">What do you wish for today?</h2><p>Dump, vent, or simply talk. I’ll ask questions along the way.</p><p className="lm-orb-whisper">Wishes get SOAP. Goals get SMART. You don’t have to get the words right.</p></div>
 <div className="lm-thread" aria-live="polite">{messages.map((m,i)=><article key={i} className={m.role==='Lorraen'?'lm-ai-response':'lm-human-response'}><small>{m.role}</small><p>{m.text}</p></article>)}</div>
 <form onSubmit={submit}><label htmlFor={id}>Your wish or story</label><textarea id={id} value={query} onChange={e=>change({wish:e.target.value,feeling})} placeholder="I wish…" rows={2}/><label htmlFor={`${id}-feeling`}>How do you feel about it?</label><textarea id={`${id}-feeling`} value={feeling} onChange={e=>change({wish:query,feeling:e.target.value})} placeholder="Excited, unsure, hopeful… in your own words." rows={2}/><div className="lm-talk-actions"><button type="button" onClick={talk} aria-pressed={listening} className="lm-pill lm-pill-white">{listening?'Stop listening':'Talk out loud'}</button><button className="lm-pill" disabled={busy||!query.trim()}>{busy?'Thinking…':'Send wish ↑'}</button></div></form>
 {notice&&<p role="status" className="lm-save-notice">{notice}</p>}
 </section>;
}
