import React, {useState,useRef,useEffect,useId} from 'react';
import {askLorraine} from '../geminiService';
export type StoryDraft={id:string;text:string;kind:string;context:string};
interface Props {context?:string;onCapture?:(draft:StoryDraft)=>void}
export default function LorraineMadreChat({context='Your UFO',onCapture}:Props){
 const id=useId(); const [query,setQuery]=useState(''); const [messages,setMessages]=useState<{role:string;text:string}[]>([]); const [busy,setBusy]=useState(false); const [listening,setListening]=useState(false); const [notice,setNotice]=useState(''); const [kind,setKind]=useState('Wish'); const recognition=useRef<any>(null);
 useEffect(()=>()=>{recognition.current?.abort();},[]);
 const talk=()=>{if(listening){recognition.current?.stop();return;} const C=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;
 if(!C){setNotice('Voice dictation is unavailable in this browser. You can type your story below.');return;}
 const r=new C();recognition.current=r;r.lang=navigator.language;r.interimResults=false;r.continuous=false;
 r.onresult=(e:any)=>{setQuery(q=>[q,e.results[0][0].transcript].filter(Boolean).join(' '));};r.onend=()=>setListening(false);r.onerror=()=>{setListening(false);setNotice('The microphone could not listen. Check permission or keep typing.');};
 try{r.start();setListening(true);setNotice('Listening. Stop whenever you are ready. Review your words before sending.');}catch{setNotice('The microphone could not start. Please try typing.');}};
 const submit=async(e:React.FormEvent)=>{e.preventDefault();if(!query.trim()||busy)return;recognition.current?.stop();const text=query.trim();setBusy(true);setMessages(m=>[...m,{role:'You',text}]);setNotice('');
 try{const reply=await askLorraine(text,`${context}\nConversation so far: ${messages.slice(-8).map(m=>m.role+': '+m.text).join('\n')}`);setMessages(m=>[...m,{role:'Lorraen',text:reply||'What would you like to make clearer first?'}]);}catch{setNotice('The conversation service is unavailable. Your words are still here; you can keep them as a draft.');}finally{setBusy(false);}};
 return <section className="lm-dialogue" aria-label={`Story and talk: ${context}`}><div className="lm-dialogue-top"><span>LORRAEN MADRE</span><span role="status">{listening?'listening':busy?'considering your story':'ready when you are'}</span></div>
 <h2>What would you like to become possible?</h2><p>Say it in your own words. We’ll find the next piece together.</p>
 <div className="lm-thread" aria-live="polite">{messages.map((m,i)=><article key={i} className={m.role==='Lorraen'?'lm-ai-response':'lm-human-response'}><small>{m.role}</small><p>{m.text}</p></article>)}</div>
 <form onSubmit={submit}><label htmlFor={id}>Your story</label><textarea id={id} value={query} onChange={e=>setQuery(e.target.value)} placeholder="I wish… / Here’s what happened…" rows={3}/><div className="lm-talk-actions"><button type="button" onClick={talk} aria-pressed={listening} className="lm-pill lm-pill-white">{listening?'Stop listening':'Talk out loud'}</button><button className="lm-pill" disabled={busy||!query.trim()}>{busy?'Thinking…':'Continue the story'}</button></div></form>
 {notice&&<p role="status">{notice}</p>}{onCapture&&<div className="lm-draft-actions"><label>Keep this as <select value={kind} onChange={e=>setKind(e.target.value)}>{['Wish','Story','Project','Goal','Plan','Deal','Task','Outcome','Dinosaur brief'].map(k=><option key={k}>{k}</option>)}</select></label><button className="lm-pill lm-pill-white" disabled={!query.trim()} onClick={()=>{onCapture({id:crypto.randomUUID(),text:query.trim(),kind,context});setNotice(`${kind} draft added to this session’s Story board. Nothing has been sent to another tool.`);}}>Keep draft</button></div>}
 </section>;
}
