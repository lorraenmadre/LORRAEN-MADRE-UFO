import React,{useEffect,useRef,useState} from 'react';
export default function VoiceOrb({state='ready',small=false,allowVideo=false}:{state?:'ready'|'listening'|'thinking'|'saved';small?:boolean;allowVideo?:boolean}){
 const stream=useRef<MediaStream|null>(null);const mounted=useRef(true);const video=useRef<HTMLVideoElement|null>(null);const [camera,setCamera]=useState(false);const [starting,setStarting]=useState(false);const [error,setError]=useState('');
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;stream.current?.getTracks().forEach(t=>t.stop());};},[]);
 useEffect(()=>{if(video.current)video.current.srcObject=stream.current;},[camera]);
 const toggleCamera=async()=>{
  if(camera){stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;setCamera(false);return;}
  if(!navigator.mediaDevices?.getUserMedia){setError('Camera preview is unavailable in this browser. Your voice and text still work.');return;}
  setStarting(true);setError('');try{const next=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});if(!mounted.current){next.getTracks().forEach(t=>t.stop());return;}stream.current=next;setCamera(true);}catch{if(mounted.current)setError('Camera preview could not open. You can continue with voice or text.');}finally{if(mounted.current)setStarting(false);}
 };
 return <div className={`lm-orb-wrap ${small?'is-small':''}`}><div className={`lm-voice-orb is-${state}`} aria-hidden="true">{camera?<video ref={video} autoPlay muted playsInline/>:<><span/><span/><span/></>}</div><span className="lm-orb-caption">{state==='listening'?'Listening to your story':state==='thinking'?'Finding the next piece':state==='saved'?'A piece of your UFO, kept':'Your voice at the center'}</span>{allowVideo&&<><button type="button" className="lm-camera-toggle" disabled={starting} onClick={toggleCamera}>{starting?'Opening camera…':camera?'Turn video off':'Show my video'}</button><small>Local video · no recording or upload</small>{error&&<p role="status">{error}</p>}</>}</div>;
}
