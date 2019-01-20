import { Reducer } from 'redux';
import { IStateParams } from './state-params.interface';

export class CoreRawReducer {
  name: string;
  params: IStateParams;
  stateClass: AnyClass;
  createReducer: (children?) => Reducer;
  isChild?: boolean;
  parent?: RawReducer;
}

export class RawReducer extends CoreRawReducer {

  constructor(params: CoreRawReducer){
    super();

    this.name = params.name;
    this.params = params.params;
    this.stateClass = params.stateClass;
    this.createReducer = params.createReducer;
    this.parent = params.parent;
  }

  get path(){
    let path = [this.name];
    if(this.parent){
      path = this.getParentsName(this).concat(path);
    }
    return path;
  }

  get pathString(){
    return this.path.join('.');
  }

  get isChild(){
    return !!this.parent
  }

  private getParentsName(rawReducer: RawReducer, arr: string[] = []){
    if(rawReducer.parent){
      arr.unshift(rawReducer.parent.name);
      this.getParentsName(rawReducer.parent, arr);
    }
    return arr;
  }
}