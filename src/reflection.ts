import 'reflect-metadata';

import {TSFlatObjectMetadata} from './typescript-flat-object';
import {TSFlatPropertyMetadata} from './typescript-flat-property';
import {Type} from "./helpers";

export class Reflection {
    static apiMap = 'api:map:';
    static apiMapFlatObject = `${Reflection.apiMap}TSFlatObject`;

    static getTSFlatPropertyMetadata(target: object, name?: string): TSFlatPropertyMetadata | undefined {
        if (!target) {
            return undefined;
        }

        const key = `${Reflection.apiMap}${name || target.constructor.name}`;
        return Reflect.getMetadata(key, target);
    }

    static getFlatObjectMetadata(type: Type<any>): TSFlatObjectMetadata | undefined {
        return type ? (Reflect.getMetadata(Reflection.apiMapFlatObject, type) as TSFlatObjectMetadata) : undefined;
    }

    static setFlatPropertyMetadata(value: TSFlatPropertyMetadata, target: object): void {
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
}
