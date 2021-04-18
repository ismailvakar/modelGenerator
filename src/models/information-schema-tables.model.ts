import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    mssql: {
      table: 'TABLES',
    },
  },
})
export class InformationSchemaTables extends Entity {
  @property({
    type: 'string',
    mssql: {
      column: 'TABLE_CATALOG',
    },
  })
  tableCatalog?: string;

  @property({
    type: 'string',
    id: true,
    mssql: {
      column: 'TABLE_SCHEMA',
    },
  })
  tableSchema?: string;

  @property({
    type: 'string',
    mssql: {
      column: 'TABLE_NAME',
    },
  })
  tableName?: string;

  @property({
    type: 'string',
    mssql: {
      column: 'TABLE_TYPE',
    },
  })
  tableType?: string;


  constructor(data?: Partial<InformationSchemaTables>) {
    super(data);
  }
}

export interface InformationSchemaTablesRelations {
  // describe navigational properties here
}

export type InformationSchemaTablesWithRelations = InformationSchemaTables & InformationSchemaTablesRelations;
