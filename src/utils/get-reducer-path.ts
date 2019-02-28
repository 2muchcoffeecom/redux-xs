import { coreService } from '../core.service';
import { RawReducer } from '../interfaces/raw-reducer.interface';

export function getReducerPath(state) {
  debugger
  const rawReducer = coreService.getRawReducer(state);
  if(rawReducer){
    return rawReducer.path;
  }

  return [];
}

