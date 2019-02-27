import { coreService } from '../core.service';

export function getReducerPath(state) {
  const rawReducer = coreService.getRawReducer(state);
  if(rawReducer){
    return rawReducer.path;
  }

  return [];
}

