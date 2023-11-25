import { Type } from './helpers';
import { Reflection } from './reflection';

export type PropertyTransformer = (property: any) => any;

export interface TSFlatPropertyMetadata {
  beforeStringify?: PropertyTransformer;
  afterParse?: PropertyTransformer;
  ignore?: boolean
}

export type TSFlatPropertyOptions = TSFlatPropertyMetadata;

export const TSFlatProperty = (options?: TSFlatPropertyOptions): Function => {
  return (target: Type<any>, key: string) => {
    Reflection.setFlatPropertyMetadata(
      {
        beforeStringify: options?.beforeStringify,
        afterParse: options?.afterParse,
        ignore: options?.ignore,
      },
      target,
      key,
    );
  };
};
