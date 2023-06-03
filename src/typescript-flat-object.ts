import { Type } from './helpers';
import { Reflection } from './reflection';

export const registeredTSFlatObjects: Map<string, Type<any>> = new Map();

export interface TSFlatObjectMetadata {
  constructorParams: Array<unknown>;
  childFilter?: {
    property: string;
    child: Array<{
      type: string | Type<any>;
      value: unknown;
    }>;
  };
}

export interface TSFlatObjectProperties extends TSFlatObjectMetadata {}

export const TSFlatObject = (options?: TSFlatObjectProperties): Function => {
  return (target: Type<any>) => {
    const constructorParams = options?.constructorParams ?? [];
    const childFilter = options?.childFilter;
    Reflection.setFlatObject({ constructorParams, childFilter }, target);
    registeredTSFlatObjects.set(target.name, target);
  };
}
