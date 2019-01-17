export const middlewareRx = (store: any) => (next: any) => (action: any) => {
  const type = action.type || action.constructor.type;
  next({ ...action, type });
};