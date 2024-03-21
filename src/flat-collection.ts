import { Type } from './helpers';
import { Reflection } from './reflection';

export type CollectionTypeString = 'array' | 'dictionary' | 'map' | 'set';
export type CollectionType = Array<any> | { [key: string]: any } | Map<any, any> | Set<any>;

export type CollectionTransformerEach = (item: any, key: any, collection: CollectionType) => any;

export interface TSFlatCollectionMetadata {
  collectionType: CollectionTypeString;
}

export type TSFlatCollectionOptions = TSFlatCollectionMetadata;

export const TSFlatCollection = (options: TSFlatCollectionOptions): Function => {
  return (target: Type<any>, key: string) => {
    registerTSFlatCollection(target, key, options);
  };
};

export function registerTSFlatCollection<T>(target: Type<T>, propertyName: keyof T, options: TSFlatCollectionOptions): void {
  Reflection.setFlatCollectionMetadata(
    {
      collectionType: options.collectionType,
    },
    target,
    propertyName as string,
  );
}
