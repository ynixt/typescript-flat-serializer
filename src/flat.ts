import { TSFlatCollectionOptions, registerTSFlatCollection } from './flat-collection';
import { TSFlatObjectProperties, registerTSFlatObject } from './flat-object';
import { TSFlatPropertyOptions, registerTSFlatProperty } from './flat-property';
import { Type } from './helpers';

export type FlatObjectRegistration<T> = {
  target: Type<T>;
  options?: TSFlatObjectProperties;
};

export type FlatPropertyRegistration<T> = {
  propertyName: keyof T;
  options?: TSFlatPropertyOptions;
};

export type FlatCollectionRegistration<T> = {
  collectionName: keyof T;
  options: TSFlatCollectionOptions;
};

export type FlatItem<T> = FlatPropertyRegistration<T> | FlatCollectionRegistration<T>;

export function registerTSFlat<T>(objectRegistration: FlatObjectRegistration<T>, ...items: FlatItem<T>[]) {
  registerTSFlatObject(objectRegistration.target, objectRegistration.options);

  if (items) {
    for (const item of items) {
      if ('collectionName' in item) {
        registerTSFlatCollection(objectRegistration.target.prototype, item.collectionName, item.options);
      } else if ('propertyName' in item) {
        registerTSFlatProperty(objectRegistration.target.prototype, item.propertyName, item.options);
      }
    }
  }
}
