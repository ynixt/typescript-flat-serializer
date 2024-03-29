import { Type } from './helpers';
import { Reflection } from './reflection';

export const registeredTSFlatObjects: Map<string, Type<any>> = new Map();

export interface TSFlatObjectMetadata {
  constructorParams: Array<unknown>;
}

export interface TSFlatObjectProperties {
  constructorParams?: Array<unknown>;
}

export const TSFlatObject = (options?: TSFlatObjectProperties): Function => {
  return (target: Type<any>) => {
    registerTSFlatObject(target, options);
  };
};

export function registerTSFlatObject(target: Type<any>, options?: TSFlatObjectProperties): void {
  const constructorParams = options?.constructorParams ?? [];
  Reflection.setFlatObject(
    {
      constructorParams,
    },
    target,
  );
  registeredTSFlatObjects.set(target.name, target);
}
