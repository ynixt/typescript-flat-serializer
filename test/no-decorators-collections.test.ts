import {
  CustomWayOfCloningObjectMap,
  RFDCOptions,
  parse,
  registerTSFlat,
  registerTSFlatCollection,
  registerTSFlatObject,
  stringify,
} from '../src';
import { Animal, Cat, Dog } from './inheritance.test';

export class ExampleArrayNoDecorator {
  public items: Array<number>;

  constructor(items: Array<number>) {
    registerTSFlat(
      {
        target: ExampleArrayNoDecorator,
      },
      { collectionName: 'items', options: { collectionType: 'array' } },
    );

    this.items = items;
  }
}

export class ExampleSetNoDecorator {
  public items: Set<string>;

  constructor(items: Set<string>) {
    this.items = items;

    registerTSFlat(
      {
        target: ExampleSetNoDecorator,
      },
      { collectionName: 'items', options: { collectionType: 'set' } },
    );
  }
}

export class ExampleMapNoDecorator {
  public items: Map<string, boolean>;

  constructor(items: Map<string, boolean>) {
    registerTSFlat(
      {
        target: ExampleMapNoDecorator,
      },
      { collectionName: 'items', options: { collectionType: 'map' } },
    );

    this.items = items;
  }
}

export class ExampleDictNoDecorator {
  public items: { [key: string]: any };

  constructor(items: { [key: string]: any }) {
    registerTSFlat(
      {
        target: ExampleDictNoDecorator,
      },
      { collectionName: 'items', options: { collectionType: 'dictionary' } },
    );

    this.items = items;
  }
}

export class ExampleComplexMapNoDecorator {
  public items: Map<string, Animal>;

  constructor(items: Map<string, Animal>) {
    registerTSFlat(
      {
        target: ExampleComplexMapNoDecorator,
      },
      { collectionName: 'items', options: { collectionType: 'map' } },
    );

    this.items = items;
  }
}

test('array', () => {
  const example = new ExampleArrayNoDecorator([3, 5]);

  const str = stringify(example);
  const parsedRoot = parse<ExampleArrayNoDecorator>(str);

  expect(parsedRoot).toEqual(example);
  expect(parsedRoot.items).toBeInstanceOf(Array);
});

test('set', () => {
  const example = new ExampleSetNoDecorator(new Set(['a', 'asd']));

  const str = stringify(example);
  const parsedRoot = parse<ExampleSetNoDecorator>(str);

  expect(parsedRoot).toEqual(example);
  expect(parsedRoot.items).toBeInstanceOf(Set);
});

test('map', () => {
  const map = new Map<string, boolean>();
  map.set('asd', true);
  map.set('b', false);

  const example = new ExampleMapNoDecorator(map);

  const str = stringify(example);
  const parsedRoot = parse<ExampleMapNoDecorator>(str);

  expect(parsedRoot).toEqual(example);
  expect(example.items).toBeInstanceOf(Map);
  expect(parsedRoot.items).toBeInstanceOf(Map);
});

test('dict', () => {
  const dict = {
    'bb': true,
    'adsasd': 'asd',
  };

  const example = new ExampleDictNoDecorator(dict);

  const str = stringify(example);
  const parsedRoot = parse<ExampleDictNoDecorator>(str);

  expect(parsedRoot).toEqual(example);
});

test('complex map', () => {
  const map = new Map<string, Animal>();
  map.set('asd', new Dog('Luffy'));
  map.set('b', new Cat('Eros'));

  const example = new ExampleComplexMapNoDecorator(map);

  const str = stringify(example);
  const parsedRoot = parse<ExampleComplexMapNoDecorator>(str);

  expect(parsedRoot).toEqual(example);
  expect(parsedRoot.items).toBeInstanceOf(Map);
});

test('custom rFDCOptions', () => {
  const customWayOfCloningObject: CustomWayOfCloningObjectMap = new Map();
  const rFDCOptions: RFDCOptions = {
    customWayOfCloningObject,
  };

  const map = new Map<string, boolean>();
  map.set('asd', true);
  map.set('b', false);

  const fakeMap = new Map<number, string>();
  fakeMap.set(10, 'ads');

  customWayOfCloningObject.set(Map, obj => fakeMap);

  const classExample = new ExampleMapNoDecorator(map);

  const str = stringify(classExample, { rFDCOptions });
  const parsedRoot = parse<ExampleMapNoDecorator>(str);

  expect(parsedRoot.items).toEqual(fakeMap);
});
