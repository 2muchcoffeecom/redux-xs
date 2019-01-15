export class IncrementCount {
  static readonly type = '[Test] Increment';
  //
  constructor(public payload: number) {
  }

}

export class IncrementCount2 {
  static readonly type = '[Test] Increment2';
}