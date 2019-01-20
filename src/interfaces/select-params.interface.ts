export type pathSelectType = string[];
export type handlerSelectType = (state: any) => any;
export type stateSelectType = new (...args: any[]) => any;
export type selectParamsType =  handlerSelectType & stateSelectType & pathSelectType;