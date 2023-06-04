import { Type } from './helpers';
import { Reflection } from './reflection';

export type PropertyTransformer = (property: any) => any;

export interface TSFlatPropertyMetadata {
  beforeStringify?: PropertyTransformer;
  afterParse?: PropertyTransformer;
}

export interface TSFlatPropertyOptions extends TSFlatPropertyMetadata {}

export const TSFlatProperty = (options?: TSFlatPropertyOptions): Function => {
  return (target: Type<any>, key: string) => {
    Reflection.setFlatPropertyMetadata(
      {
        beforeStringify: options?.beforeStringify,
        afterParse: options?.afterParse,
      },
      target,
      key,
    );
  };
};
