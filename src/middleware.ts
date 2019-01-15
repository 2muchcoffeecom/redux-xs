export const middlewareRx = (store: any) => (next: any) => (action: any) => {
  next({ ...action });
};