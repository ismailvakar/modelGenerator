import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SecDsDataSource} from '../datasources';
import {ColumnProperty} from '../interfaces/model.interface';
import {
  InformationSchemaTables,
  InformationSchemaTablesRelations,
} from '../models';
import {SchemeColumn} from '../models/scheme-column.model';

export class PrimaryColumn {
  ColumnName: string;
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
    console.log('2nd script');
    const a = (await this.dataSource.execute(
      "select COLUMN_NAME as ColumnName from INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_NAME='" +
        tableName +
        "'",
    )) as Array<PrimaryColumn>;
    return a;
  }

  async getColumnProperties(tableName: string) {
    const tableInformation = (await this.dataSource.execute(
      `select c.COLUMN_NAME as columnName, c.IS_NULLABLE as isNullable, c.DATA_TYPE as dataType,c.COLUMN_DEFAULT as columnDefault,
            c.CHARACTER_MAXIMUM_LENGTH as characterMaximumLength, kcu.COLUMN_NAME as hasForeign, kcu.CONSTRAINT_NAME as constraintName from INFORMATION_SCHEMA.COLUMNS c
            left outer join INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu on c.COLUMN_NAME = kcu.COLUMN_NAME and c.TABLE_NAME = kcu.TABLE_NAME
    where c.TABLE_NAME = @param1`,
      [tableName],
    )) as ColumnProperty[];
    return tableInformation;
  }
}
