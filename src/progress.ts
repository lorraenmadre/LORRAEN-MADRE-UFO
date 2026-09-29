import { Entity } from './types';
import { isUnnamed } from './entityOrder';

/** How far along a box is (0-100), same scoring as the original UFO map, plus naming it. */
export const calculateProgress = (e: Entity) => {
  if (isUnnamed(e)) return 0;
  let score = 1; // named and claimed
  const max = 6;
  if (e.intentions) score++;
  if (e.manifestations) score++;
  if (e.leanValueCanvas) score++;
  if (e.executiveSummary) score++;
  if (e.type === 'trust' && e.vaultDocuments?.length) score++;
  else if (e.type === 'church' && e.councilMembers?.some((m) => m !== '')) score++;
  else if ((e.type === 'north_node' || e.type === 'south_node') && e.fundingStrategies?.length) score++;
  else if (e.type === 'planet' && e.storyCardVideo) score++;
  else if (e.type === 'offering' && e.customerAcquisitionCost) score++;
  else if (e.type === 'dinosaur' && e.platform) score++;
  else if (e.type === 'satellite' && e.status) score++;
  return Math.min(100, Math.round((score / max) * 100));
};
