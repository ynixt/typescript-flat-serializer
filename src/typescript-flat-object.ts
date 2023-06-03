import {Type} from './helpers';
import {Reflection} from './reflection';

export const registeredTSFlatObjects: Map<string, Type<any>> = new Map();

export interface TSFlatObjectMetadata {
    constructorParams: Array<unknown>;
    beforeStringify: (obj: any) => any
    afterParse?: (obj: any) => void
}

export interface TSFlatObjectProperties {
    constructorParams?: Array<unknown>;
    beforeStringify?: (obj: any) => any
    afterParse?: (obj: any) => void
}

export const TSFlatObject = (options?: TSFlatObjectProperties): Function => {
    return (target: Type<any>) => {
        const constructorParams = options?.constructorParams ?? [];
        Reflection.setFlatObject(
            {
                constructorParams,
                beforeStringify: options?.beforeStringify ?? ((obj) => obj),
                afterParse: options?.afterParse,
            },
            target
        );
        registeredTSFlatObjects.set(target.name, target);
    };
}
