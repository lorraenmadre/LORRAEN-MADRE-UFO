import {Entity} from './types';
import {PLAN_SLOTS} from './planSlots';
export type BoardCell={group:string;entity?:Entity};
export function boardCells(entities:Entity[]):BoardCell[]{
 const visible=entities.filter(e=>!e.isArchived);const used=new Set<string>();
 const block=(group:string,items:Entity[])=>Array.from({length:16},(_,i)=>{const entity=items[i];if(entity)used.add(entity.id);return {group,entity};});
 const houses=visible.filter(e=>e.type==='offering').sort((a,b)=>Number(a.house?.match(/\d+/)?.[0]||99)-Number(b.house?.match(/\d+/)?.[0]||99));
 const planets=PLAN_SLOTS.map(s=>visible.find(e=>e.id===s.entityId)).filter(Boolean) as Entity[];
 const dinosaurs=visible.filter(e=>e.type==='dinosaur');
 const cells=[...block('Houses',houses),...block('Planets',planets),...block('Dinosaurs',dinosaurs)];
 return [...cells,...block('Connections',visible.filter(e=>!used.has(e.id)))];
}
