import { registerTSFlat } from '../src';
import { parse, stringify } from '../src/flat-serializer';

export abstract class AnimalNoDecorators {
  like: Map<string, boolean>;

  constructor(public name: string) {
    registerTSFlat(
      { target: AnimalNoDecorators },
      {
        collectionName: 'like',
        options: {
          collectionType: 'map',
        },
      },
    );
  }
}

export class DogNoDecorators extends AnimalNoDecorators {
  constructor(name: string) {
    super(name);

    registerTSFlat({ target: DogNoDecorators });
  }
}

export class CatNoDecorators extends AnimalNoDecorators {
  constructor(name: string) {
    super(name);

    registerTSFlat({ target: CatNoDecorators });
  }
}

export class RatNoDecorators extends AnimalNoDecorators {
  points: Map<string, number>;

  constructor(name: string) {
    super(name);

    registerTSFlat(
      { target: RatNoDecorators },
      {
        collectionName: 'points',
        options: {
          collectionType: 'map',
        },
      },
    );
  }
}

test('stringify/parse with inheritance', () => {
  const animal: AnimalNoDecorators = new DogNoDecorators('adsdsa');

  const str = stringify(animal);
  const parsedRoot = parse<AnimalNoDecorators>(str);

  expect(parsedRoot).toStrictEqual(animal);
});

test('stringify/parse with inheritance and collection', () => {
  const animal: AnimalNoDecorators = new RatNoDecorators('adsdsa');
  const rat = animal as RatNoDecorators;

  rat.points = new Map<string, number>();
  rat.like = new Map<string, boolean>();

  rat.like.set('cat', false);
  rat.points.set('test', 15);

  const str = stringify(animal);
  const parsedRoot = parse<RatNoDecorators>(str);

  expect(parsedRoot).toStrictEqual(rat);
});
