import {DefaultCrudRepository} from '@loopback/repository';
import {
  InformationSchemaTables,
  InformationSchemaTablesRelations,
} from '../models';
import {SecDsDataSource} from '../datasources';
import {SchemeColumn} from '../models/scheme-column.model';
import {inject} from '@loopback/core';


export class PrimaryColumn{
  ColumnName: string
}

export class InformationSchemaTablesRepository extends DefaultCrudRepository<
  InformationSchemaTables,
  typeof InformationSchemaTables.prototype.tableName,
  InformationSchemaTablesRelations
> {
  constructor(@inject('datasources.SecDs') dataSource: SecDsDataSource) {
    super(InformationSchemaTables, dataSource);
  }

  async getColumns(tableName: string) {
    return (await this.dataSource.execute(
      'select COLUMN_NAME as ColumnName, IS_NULLABLE as IsNullable, DATA_TYPE as DataType,' +
        "CHARACTER_MAXIMUM_LENGTH as CharacterMaximumLength from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME='" +
        tableName +
        "'",
    )) as Array<SchemeColumn>;
  }

  async getPrimaryKey(tableName: string) {
    console.log('2nd script')
    const a = (await this.dataSource.execute(
      "select COLUMN_NAME as ColumnName from INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_NAME='"+
      tableName + "'"
    )) as Array<PrimaryColumn>;
    return a;
  }
}


