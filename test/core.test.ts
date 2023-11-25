import { TSFlatObject, TSFlatProperty, parse, stringify } from '../src';

class AnyClassExample {
  constructor(public str: string) {}
}

class AnyClassExampleWithIgnore {
  @TSFlatProperty({ ignore: true })
  public ignoredField: string;

  constructor(public str: string) {}
}

@TSFlatObject()
export class AnyClassExampleWithDecorator {
  constructor(public str: string) {}
}

@TSFlatObject()
export class BeforeStringify {
  @TSFlatProperty({ beforeStringify: str => 'before works' }) public str: string;

  constructor(str: string) {
    this.str = str;
  }
}

@TSFlatObject()
export class AfterParse {
  @TSFlatProperty({ afterParse: str => 'after works' }) public str: string;

  constructor(str: string) {
    this.str = str;
  }
}

test('basic stringify/parse', () => {
  const root: any = { obj2: true };
  const otherObj: any = { obj1: true };
  const classExample = new AnyClassExample('adsdsa');
  root.childs = [otherObj, '99', classExample, 105];

  const str = stringify(root);
  const parsedRoot = parse(str);

  expect(parsedRoot).toEqual(root);
});

test('basic stringify/parse with circular reference', () => {
  const root: any = { obj2: true };
  const otherObj: any = { obj1: true, father: root };
  const classExample = new AnyClassExample('adsdsa');
  root.childs = [otherObj, '99', classExample, 105];

  const str = stringify(root);
  const parsedRoot = parse(str);

  expect(parsedRoot).toEqual(root);
});

test('stringify/parse in a TSFlatObject', () => {
  const root: any = { obj2: true };
  const otherObj: any = { obj1: true };
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

test('basic stringify/parse with ignore', () => {
  const root = new AnyClassExampleWithIgnore('adsdsa');
  root.ignoredField = 'nnn';

  const str = stringify(root);
  const parsedRoot = parse<AnyClassExampleWithIgnore>(str);

  expect(parsedRoot.str).toEqual(root.str);
  expect(parsedRoot.ignoredField).toBeUndefined()
});
