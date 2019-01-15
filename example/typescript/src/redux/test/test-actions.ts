export class IncrementCount {
  readonly type = '[Test] Increment';

  constructor(public payload: number) {
  }
}

export class IncrementCount2 {
  readonly type = '[Test] Increment2';

  constructor(public payload: number) {
  }
}