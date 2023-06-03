import { Type } from './helpers';

export type IOProto = (property: any) => any;
export type DataStructure = 'array' | 'dictionary' | 'map' | 'set';

export interface TSFlatPropertyMetadata {
  dataStructure?: DataStructure;
  required?: boolean;
  beforeSerialize?: IOProto;
  afterSerialize?: IOProto;
  beforeDeserialize?: IOProto;
  afterDeserialize?: IOProto;
  type?: Type<any> | string;
  name?: string | Array<string>;
}

export interface TSFlatPropertyOptions extends TSFlatPropertyMetadata {}
