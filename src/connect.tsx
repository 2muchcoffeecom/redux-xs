import { Component } from 'react';
import * as React from 'react';
import { combineLatest, merge, Subject, timer } from 'rxjs';
import {
  debounce,
  first,
  map,
} from 'rxjs/operators';

export function XsConnect() {
  return <T extends { new(...args: any[]): Component }, Y>(WrappedComponent: T): any => {

    const getSelectValues = <T extends {new(...args:any[]):{}}>(target: T): Subject<any>[] => {
      const metadataKeys: string[] = Reflect.getMetadataKeys(target.prototype) || [];
      return metadataKeys.map((key: string) => Reflect.getMetadata(key, target.prototype));
    };

    return class ConnectDecorator extends Component<T> {
      render$ = new Subject();
      selectedValues = {};
      isSetState = true; // Todo remove variable

      constructor(public props: any, public context: any) {
        super(props);

        this.state = {};

        // Todo unsubscribe
        this.render$.subscribe(() => {
          this.isSetState = false;
        });

        const selectValues = getSelectValues(WrappedComponent);

        // Todo unsubscribe & refactor
        combineLatest([...selectValues])
        .pipe(
          debounce(() => {
            return merge(
              this.render$,
              timer(0)
            )
            .pipe(
              first(),
            );
          }),
          map((selectValues) => {
            return selectValues.reduce((acc, selectValue) => {
              return {
                ...acc,
                [selectValue.propertyKey]: selectValue.state
              };
            }, {});
          }),
        )
        .subscribe((selectedValues) => {
          this.selectedValues = selectedValues;
          if(this.isSetState){
            this.setState(selectedValues);
          }
          this.isSetState = true;
        })
      }

      render() {
        this.render$.next();

        const propsWithContext = {...this.props, ...this.selectedValues};
        return <WrappedComponent {...propsWithContext}/>;
      }
    };
  };
}