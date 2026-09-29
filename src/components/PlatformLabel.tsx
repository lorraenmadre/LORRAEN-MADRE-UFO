import React from 'react';
import PlatformIcon,{matchPlatform} from './PlatformIcon';
export default function PlatformLabel({platform}:{platform?:string}){
 if(!platform||platform==='Unassigned')return <span className="lm-platform-label">Choose a platform</span>;
 return <span className="lm-platform-label">{matchPlatform(platform)&&<PlatformIcon platform={platform} size={24}/>}<span>{platform}</span></span>;
}
