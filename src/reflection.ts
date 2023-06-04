import { Type } from './helpers';
import { TSFlatCollectionMetadata } from './typescript-flat-collection';
import { TSFlatObjectMetadata } from './typescript-flat-object';
import { TSFlatPropertyMetadata } from './typescript-flat-property';
import 'reflect-metadata';

export class Reflection {
  static apiMap = 'api:map:';
  static apiMapFlatObject = `${Reflection.apiMap}TSFlatObject`;
  static apiMapFlatProperty = `${Reflection.apiMap}TSFlatProperty`;
  static apiMapCollection = '${Reflection.apiMap}TSFlatCollection';

  private static getApiMapFlatPropertyKey(target: object, propertyKey: string): string {
    return `${Reflection.apiMapFlatProperty}${target.constructor.name}.${propertyKey}`;
  }

  private static getApiMapFlatCollectionKey(target: object, propertyKey: string): string {
    return `${Reflection.apiMapCollection}${target.constructor.name}.${propertyKey}`;
  }

  static getFlatPropertyMetadata(target: Type<any>, propertyKey: string): TSFlatPropertyMetadata | undefined {
    if (!target) {
      return undefined;
    }

    const key = Reflection.getApiMapFlatPropertyKey(target, propertyKey);
    return Reflect.getMetadata(key, target);
  }

  static getFlatCollectionMetadata(target: Type<any>, propertyKey: string): TSFlatCollectionMetadata | undefined {
    if (!target) {
      return undefined;
    }

    const key = Reflection.getApiMapFlatCollectionKey(target, propertyKey);
    return Reflect.getMetadata(key, target);
  }

  static getFlatObjectMetadata(type: Type<any>): TSFlatObjectMetadata | undefined {
    return type ? (Reflect.getMetadata(Reflection.apiMapFlatObject, type) as TSFlatObjectMetadata) : undefined;
  }

  static setFlatPropertyMetadata(value: TSFlatPropertyMetadata, target: Type<any>, propertyKey: string): void {
    if (!target) {
      return;
    }

    const key = Reflection.getApiMapFlatPropertyKey(target, propertyKey);
    Reflect.defineMetadata(key, value, target);
  }

  static setFlatCollectionMetadata(value: TSFlatCollectionMetadata, target: Type<any>, propertyKey: string): void {
    if (!target) {
      return;
    }

    const key = Reflection.getApiMapFlatCollectionKey(target, propertyKey);
    Reflect.defineMetadata(key, value, target);
  }

  static setFlatObject(value: TSFlatObjectMetadata, target: Type<any>): void {
    if (!target) {
      return;
    }

    Reflect.defineMetadata(Reflection.apiMapFlatObject, value, target);
  }
}
