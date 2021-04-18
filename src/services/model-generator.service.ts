import {injectable, inject, BindingScope} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {
  InformationSchemaTablesRepository,
  PrimaryColumn,
} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class ModelGeneratorService {
  constructor(
    /* Add @inject to inject parameters */
    @inject('repositories.InformationSchemaTablesRepository')
    protected informationSchemaRepository: InformationSchemaTablesRepository,
  ) {}

  /*
   * Add service methods here
   */
  async getNodeEquivelant(
    property: string,
    columnName: string,
    maximumColumnLength: string,
    isNullable: boolean,
    primaryColumn: Array<PrimaryColumn>,
  ): Promise<string> {
    let uniqueString = '';
    if (property === 'uniqueidentifier') {
      uniqueString =
        "@property({type:'string' @id @length,mssql: {dataType:'UniqueIdentifier'," +
        'column: @columnOriginalName},}) @columnName: string';
      uniqueString = uniqueString.replace('@columnOriginalName', "'"+ columnName + "'");
    } else if (property === 'bit') {
      uniqueString =
        "@property({type:'boolean' @id @length,mssql: {" +
        'column: @columnOriginalName},}) @columnName: boolean';
      uniqueString = uniqueString.replace('@columnOriginalName', "'"+ columnName + "'");
    } else if (
      property === 'nvarchar' ||
      property === 'varchar' ||
      property === 'text' ||
      property === 'nchar' ||
      property === 'ntext' ||
      property === 'char'
    ) {
      uniqueString =
        "@property({type:'string' @id @length, mssql: {" +
        'column: @columnOriginalName},}) @columnName: string';
      uniqueString = uniqueString.replace('@columnOriginalName', "'"+ columnName + "'");
    } else if (
      property === 'float' ||
      property === 'int' ||
      property === 'decimal' ||
      property === 'bigint' ||
      property === 'money' ||
      property === 'tinyint'
    ) {
      uniqueString =
        "@property({type:'number' @id @length, mssql: {dataType:'@originalType'," +
        'column: @columnOriginalName},}) @columnName: number';
      uniqueString = uniqueString.replace('@columnOriginalName', "'"+ columnName + "'");
      uniqueString = uniqueString.replace('@originalType', property);
    } else if (
      property === 'date' ||
      property === 'datetime2' ||
      property === 'datetim'
    ) {
      uniqueString =
        "@property({type:'date' @id @length, mssql: {" +
        'column: @columnOriginalName},}) @columnName: Date';
      uniqueString = uniqueString.replace('@columnOriginalName', "'"+ columnName + "'");
    }
    if (maximumColumnLength != '0') {
      uniqueString = uniqueString.replace(
        '@length',
        '   jsonSchema: {       maxLength: @maxNumber,     },',
      );
      uniqueString = uniqueString.replace(
        '@maxNumber',
        Number.parseInt(maximumColumnLength).toString(),
      );
    } else {
      uniqueString = uniqueString.replace('@length', '');
    }
    const translate = require('@vitalets/google-translate-api');
    const camelCase = require('camelcase');
    const translatedColumnName = await translate(columnName, {to: 'en'});
    if (primaryColumn.some(item => item.ColumnName === columnName)) {
      uniqueString = uniqueString.replace('@id', ', id:true');
    } else {
      uniqueString = uniqueString.replace('@id', '');
    }
    console.log('tra', translatedColumnName.text);
    const variableName =
      translatedColumnName != null
        ? camelCase(translatedColumnName.text)
        : camelCase(columnName);
    uniqueString = uniqueString.replace(
      '@columnName',
      variableName + (isNullable ? '?' : ''),
    );
    return uniqueString;
  }

  async generateModel(tableName: string) {
    const columnTables = await this.informationSchemaRepository.getColumns(
      tableName,
    );
    const primaryColumn = await this.informationSchemaRepository.getPrimaryKey(
      tableName,
    );

    if (columnTables === undefined) {
      throw new HttpErrors[404]("Columns couldn't for " + tableName);
    }
    console.log('t', columnTables);
    const camelCase = require('camelcase');
    let variableTableName = camelCase(tableName, {pascalCase: true});
    let modelText =
      "import {Entity, model, property} from '@loopback/repository'; " +
      "@model({   settings: {     mssql: {       table: '@TableName',     },   }, }) export class " +
      variableTableName +
      ' extends Entity {';
    modelText = modelText.replace('@TableName', tableName);
    for (const column of columnTables) {
      modelText += await this.getNodeEquivelant(
        column.DataType,
        column.ColumnName,
        column.CharacterMaximumLength ?? '0',
        column.IsNullable ?? true,
        primaryColumn,
      );
    }
    modelText +=
      ' constructor(data?: Partial<' +
      variableTableName +
      '>) {     super(data);   } }  export interface ' +
      variableTableName +
      'Relations {   ' +
      '}  export type ' +
      variableTableName +
      'WithRelations = ' +
      variableTableName +
      ' & ' +
      variableTableName +
      'Relations;';

    return modelText;
  }
}
