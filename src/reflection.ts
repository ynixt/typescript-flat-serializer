import 'reflect-metadata';

import { TSFlatObjectMetadata, TSFlatObjectProperties } from './typescript-flat-object';
import { TSFlatPropertyMetadata } from './typescript-flat-property';

export class Reflection {
  static apiMap = 'api:map:';
  static apiMapFlatObject = `${Reflection.apiMap}TSFlatObject`;
  static designType = 'design:type';
  static designParamTypes = 'design:paramtypes';

  static getBaseClass(target: object): { name: string } | undefined {
    return target ? (Reflect.getPrototypeOf(target) as { name: string }) : undefined;
  }

  static getTSFlatPropertyMetadata(target: object, name?: string): TSFlatPropertyMetadata | undefined {
    if (!target) {
      return undefined;
    }

    const key = `${Reflection.apiMap}${name || target.constructor.name}`;
    return Reflect.getMetadata(key, target);
  }

  static getParamTypes(target: object): any | undefined {
    return target && typeof target !== 'string' ? Reflect.getMetadata(Reflection.designParamTypes, target) : undefined;
  }

  static getTSFlatObjectMetadata(type: object): TSFlatObjectMetadata | undefined {
    return type ? (Reflect.getMetadata(Reflection.apiMapFlatObject, type) as TSFlatObjectMetadata) : undefined;
  }

  static getType(target: object, key: string): any | undefined {
    return target ? Reflect.getMetadata(Reflection.designType, target, key) : undefined;
  }

  static isTSFlatObject(type: object): boolean {
    return type ? Reflect.hasOwnMetadata(Reflection.apiMapFlatObject, type) : false;
  }

  static setTSFlatPropertyMetadata(value: TSFlatPropertyMetadata, target: object): void {
    if (!target) {
      return;
    }

    const key = `${Reflection.apiMap}${target.constructor.name}`;
    Reflect.defineMetadata(key, value, target);
  }

  static setFlatObject(value: TSFlatObjectMetadata, target: object): void {
    if (!target) {
      return;
    }

    Reflect.defineMetadata(Reflection.apiMapFlatObject, value, target);
  }

  static setType(type: any, target: object, key: string): void {
    if (!target || !type) {
      return;
    }

    Reflect.defineMetadata(Reflection.designType, type, target, key);
  }
}
