import {Reflection} from "./reflection";
import {registeredTSFlatObjects} from "./typescript-flat-object";

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

    return `[${outputArray.join(',')}]`;
}

export function parse(str: string): any {
    const array: any[] = JSON.parse(str);
    const root = array[0];

    if (typeof root !== 'object') return root;

    // Restore the type of the object
    array.forEach((item, index) => {
        if (typeof item === 'object') {
            const className = item[ATTR_CLASS_NAME];

            if (className != null && registeredTSFlatObjects.has(className)) {
                const obj = Object.assign(Object.create(registeredTSFlatObjects.get(className).prototype), item);
                array[index] = obj;
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

    return root;
}