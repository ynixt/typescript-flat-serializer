import {Type} from './helpers';
import {Reflection} from "./reflection";

export type PropertyTransformer = (property: any) => any;
export type DataStructure = 'array' | 'dictionary' | 'map' | 'set';

export interface TSFlatPropertyMetadata {
    dataStructure?: DataStructure;
    beforeStringify?: PropertyTransformer;
    afterParse?: PropertyTransformer;
}

export interface TSFlatPropertyOptions extends TSFlatPropertyMetadata {
}

export const TSFlatProperty = (options?: TSFlatPropertyOptions): Function => {
    return (target: Type<any>) => {
        Reflection.setFlatPropertyMetadata(
            {
                beforeStringify: options?.beforeStringify,
                afterParse: options?.afterParse,
            },
            target
        );
    };
}
