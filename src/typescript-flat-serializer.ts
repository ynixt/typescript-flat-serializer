import {Reflection} from "./reflection";
import {registeredTSFlatObjects, TSFlatObjectMetadata} from "./typescript-flat-object";

function getId(index: number): string {
    return `#_${index}_#`;
}

function getIndex(id: string): number {
    return parseInt(id.split('#_')[1], 10);
}

function isId(str: string): boolean {
    const regex = /^#_(\d+)_#$/gm;
    return regex.exec(str) != null;
}

function addItem(value: any, input: any[], positionsByObj: Map<any, number>) {
    const index = input.push(value) - 1;
    positionsByObj.set(value, index);
    return index;
}

export const ATTR_CLASS_NAME = '__class__';

function formatValue(value: any) {
    if (value != null && typeof value === 'object' && registeredTSFlatObjects.has(value.constructor.name)) {
        value[ATTR_CLASS_NAME] = value.constructor.name;
        return value;
    }

    return value;
}

export function stringify(obj: any): string {
    const positionsByObj = new Map<any, number>();
    const inputArray: any[] = [];
    const outputArray: any[] = [];
    let i = 0;
    let first = true;

    addItem(obj, inputArray, positionsByObj);

    while (i < inputArray.length) {
        first = true;
        outputArray.push(
            JSON.stringify(inputArray[i++], (key, value) => {
                if (value != null && typeof value === 'object') {
                    for (const childKey of Object.keys(value)) {
                        const propertyMetadata = Reflection.getTSFlatPropertyMetadata(value.constructor);

                        if (propertyMetadata != null && propertyMetadata.beforeStringify) {
                            value[childKey] = propertyMetadata.beforeStringify(value[childKey]);
                        }
                    }
                }

                if (first) {
                    first = false;
                    return formatValue(value);
                }

                if (obj == null) return value;

                if (typeof value === 'object') {
                    if (positionsByObj.has(value)) {
                        return getId(positionsByObj.get(value)!);
                    }

                    return getId(addItem(formatValue(value), inputArray, positionsByObj));
                }

                return formatValue(value);
            }),
        );
    }

    // Remove ATTR_CLASS_NAME from the original items
    inputArray.forEach(item => {
        delete item[ATTR_CLASS_NAME];
    })

    return `[${outputArray.join(',')}]`;
}

export function parse<T>(str: string): T {
    const array: any[] = JSON.parse(str);

    if (typeof array[0] !== 'object') return array[0];

    // Restore the type of the object
    array.forEach((item, index) => {
        if (typeof item === 'object') {
            const className = item[ATTR_CLASS_NAME];

            if (className != null && registeredTSFlatObjects.has(className)) {
                const prototype = registeredTSFlatObjects.get(className).prototype;
                const tempObj = Object.create(prototype);
                const metadata = Reflection.getFlatObjectMetadata(tempObj.constructor);
                array[index] = Object.assign(new tempObj.constructor(...metadata.constructorParams), item);
            }
        }
    });

    // Restore references
    array.forEach((item, index) => {
        if (typeof item === 'object') {
            for (const key of Object.keys(item)) {
                if (isId(item[key])) {
                    const indexOnFlat = getIndex(item[key]);
                    item[key] = array[indexOnFlat];
                }
            }
        }
    });

    array.forEach(item => {
        // After parse
        if (typeof item === 'object') {
            if (item != null && typeof item === 'object') {
                for (const key of Object.keys(item)) {
                    const propertyMetadata = Reflection.getTSFlatPropertyMetadata(item.constructor);

                    if (propertyMetadata != null && propertyMetadata.afterParse) {
                        item[key] = propertyMetadata.afterParse(item[key]);
                    }
                }
            }

            const className = item[ATTR_CLASS_NAME];

            if (className != null && registeredTSFlatObjects.has(className)) {
                const metadata = Reflection.getFlatObjectMetadata(item.constructor);

            }
        }

        // ATTR_CLASS_NAME is not needed anymore
        delete item[ATTR_CLASS_NAME];
    })

    return array[0];
}