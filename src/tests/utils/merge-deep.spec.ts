import { mergeDeep } from '../../utils/merge-deep';


describe('Merge Deep', () => {
  it('should return merged object', () => {
    const object = mergeDeep({a: 1, b: 2, c: {v: 3}}, {a: 3});
    expect(object).toEqual({"a": 3, "b": 2, "c": {"v": 3}});
  });

  it('should return merged object', () => {
    const object = mergeDeep({a: 1, b: 2, c: {v: 3}}, {v: 10});
    expect(object).toEqual({"a": 1, "b": 2, "c": {"v": 3}, "v": 10});
  });

  it('should return merged object', () => {
    const object = mergeDeep({a: 1, b: 2, c: {v: 3}}, {c: {v: 10}});
    expect(object).toEqual({"a": 1, "b": 2, "c": {"v": 10}});
  });

  it('should return merged object', () => {
    const object = mergeDeep({a: 1, b: 2, c: {v: 3}}, {c: {x: 10}});
    expect(object).toEqual({"a": 1, "b": 2, "c": {"v": 3, "x": 10}});
  });

  it('should return merged object', () => {
    const object = mergeDeep({a: 1, b: 2, c: {v: 3}}, {c: {v: 20, x: 10}});
    expect(object).toEqual({"a": 1, "b": 2, "c": {"v": 20, "x": 10}});
  });
});