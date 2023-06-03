import {parse, stringify} from "../src/typescript-flat-serializer";
import {TSFlatObject} from "../src/typescript-flat-object";

class AnyClassExample {
    constructor(public str: string) {
    }
}

@TSFlatObject()
export class AnyClassExampleWithDecorator {
    constructor(public str: string) {
    }
}

@TSFlatObject({
    beforeStringify: (c => {
        c.str = 'before works';
        return c;
    })
})
export class BeforeStringify {
    constructor(public str: string) {
    }
}

@TSFlatObject({
    afterParse: (c => {
        c.str = 'after works';
    })
})
export class AfterParse {
    constructor(public str: string) {
    }
}

test('basic stringify/parse', () => {
    const root: any = {obj2: true};
    const otherObj: any = {obj1: true};
    const classExample = new AnyClassExample('adsdsa');
    root.childs = [otherObj, '99', classExample, 105];

    const str = stringify(root);
    const parsedRoot = parse(str);

    expect(parsedRoot).toEqual(root);
});

test('basic stringify/parse with circular reference', () => {
    const root: any = {obj2: true};
    const otherObj: any = {obj1: true, father: root};
    const classExample = new AnyClassExample('adsdsa');
    root.childs = [otherObj, '99', classExample, 105];

    const str = stringify(root);
    const parsedRoot = parse(str);

    expect(parsedRoot).toEqual(root);
});

test('stringify/parse in a TSFlatObject', () => {
    const root: any = {obj2: true};
    const otherObj: any = {obj1: true};
    const classExample = new AnyClassExampleWithDecorator('adsdsa');
    root.childs = [otherObj, '99', classExample, 105];

    const str = stringify(root);
    const parsedRoot = parse(str);

    expect(parsedRoot).toStrictEqual(root);
});

test('beforeStringify', () => {
    const classExample = new BeforeStringify('adsdsa');

    const str = stringify(classExample);
    const parsedRoot = parse<BeforeStringify>(str);

    expect(parsedRoot.str).toBe('before works');
});

test('afterParse', () => {
    const classExample = new AfterParse('adsdsa');

    const str = stringify(classExample);
    const parsedRoot = parse<AfterParse>(str);

    expect(parsedRoot.str).toBe('after works');
});