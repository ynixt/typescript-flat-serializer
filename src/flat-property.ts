import { Type } from './helpers';
import { Reflection } from './reflection';

export type PropertyTransformer = (property: any) => any;

export interface TSFlatPropertyMetadata {
  beforeStringify?: PropertyTransformer;
  afterParse?: PropertyTransformer;
  ignore?: boolean;
}

export type TSFlatPropertyOptions = TSFlatPropertyMetadata;

export const TSFlatProperty = (options?: TSFlatPropertyOptions): Function => {
  return (target: Type<any>, key: string) => {
    registerTSFlatProperty(target, key, options);
  };
};

export function registerTSFlatProperty<T>(target: Type<T>, propertyName: keyof T, options?: TSFlatPropertyOptions): void {
  Reflection.setFlatPropertyMetadata(
    {
      beforeStringify: options?.beforeStringify,
      afterParse: options?.afterParse,
      ignore: options?.ignore,
    },
    target,
    propertyName as string,
  );
}
