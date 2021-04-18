import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class SchemeColumn extends Model {
  @property({
    type: 'string',
  })
  ColumnName: string;

  @property({
    type: 'boolean',
  })
  IsNullable?: boolean;

  @property({
    type: 'string',
  })
  DataType: string;

  @property({
    type: 'string',
  })
  CharacterMaximumLength?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<SchemeColumn>) {
    super(data);
  }
}

export interface SchemeColumnRelations {
  // describe navigational properties here
}

export type SchemeColumnWithRelations = SchemeColumn & SchemeColumnRelations;
