export interface IStateParams<Y = any> {
  name: string;
  defaults: Y;
  children?: any[]
}