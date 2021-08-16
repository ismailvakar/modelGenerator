import {BindingScope, inject, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {WordNinjaService} from '.';
import {
  InformationSchemaTablesRepository,
  PrimaryColumn,
} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class ModelGeneratorService {
  constructor(
    @inject('repositories.InformationSchemaTablesRepository')
    protected informationSchemaRepository: InformationSchemaTablesRepository,
    @inject('services.WordNinjaService')
    protected wordsNinjaService: WordNinjaService,
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
    targetLanguage: string,
    sourceLanguage: string,
  ): Promise<string> {
    let uniqueString = '';
    if (property === 'uniqueidentifier') {
      uniqueString = `
        @property({
          type: 'string',
          id: true,
          generated: true,
          mssql: {
            dataType: 'UniqueIdentifier',
            column: @columnOriginalName,
          },
        })
        @columnName: string;
        `;
      uniqueString = uniqueString.replace(
        '@columnOriginalName',
        "'" + columnName + "'",
      );
    } else if (property === 'bit') {
      uniqueString = `  @property({
        type: 'boolean',
        mssql: {
          column: @columnOriginalName,
        },
      })
      @columnName: boolean;
      `;
      uniqueString = uniqueString.replace(
        '@columnOriginalName',
        "'" + columnName + "'",
      );
    } else if (
      property === 'nvarchar' ||
      property === 'varchar' ||
      property === 'text' ||
      property === 'nchar' ||
      property === 'ntext' ||
      property === 'char'
    ) {
      uniqueString = `
      @property({
        type: 'string',
        mssql: {
          column: @columnOriginalName,
        },
      })
      @columnName: string;
      `;

      uniqueString = uniqueString.replace(
        '@columnOriginalName',
        "'" + columnName + "'",
      );
    } else if (
      property === 'float' ||
      property === 'int' ||
      property === 'decimal' ||
      property === 'bigint' ||
      property === 'money' ||
      property === 'tinyint'
    ) {
      uniqueString = `
      @property({
        type: 'number',
        @id @length
        mssql: {
          dataType:'@originalType',
          column: @columnOriginalName,
        },
      })
      @columnName: number;
      `;
      uniqueString = uniqueString.replace(
        '@columnOriginalName',
        "'" + columnName + "'",
      );
      uniqueString = uniqueString.replace('@originalType', property);
    } else if (
      property === 'date' ||
      property === 'datetime2' ||
      property === 'datetime'
    ) {
      uniqueString = `
      @property({
        type: 'date',
        @id @length
        mssql: {
          dataType:'@originalType',
          column: @columnOriginalName,
        },
      })
      @columnName: Date;
      `;
      uniqueString = uniqueString.replace(
        '@columnOriginalName',
        "'" + columnName + "'",
      );
    }
    if (maximumColumnLength !== '0' && property !== 'text') {
      uniqueString = uniqueString.replace(
        '@length',
        '   , jsonSchema: {       maxLength: @maxNumber,     }',
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
    let elem = columnName.replace(/\W/g, '');
    const columnList = (await this.wordsNinjaService
      .splitSentence(elem, {
        camelCaseSplitter: false,
        capitalizeFirstLetter: false,
        joinWords: false,
      })
      .catch(err => {
        console.log('err', err);
      })) as [string];
    elem = columnList.join(' ');
    const translatedColumnName = await translate(elem, {
      from: sourceLanguage,
      to: targetLanguage,
    });
    if (primaryColumn.some(item => item.ColumnName === columnName)) {
      uniqueString = uniqueString.replace('@id', ', id:true');
    } else {
      uniqueString = uniqueString.replace('@id', '');
    }
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

  async generateModel(
    tableName: string,
    sourceLanguage: string,
    targetLanguage: string,
  ) {
    const columnTables = await this.informationSchemaRepository.getColumns(
      tableName,
    );
    const primaryColumn = await this.informationSchemaRepository.getPrimaryKey(
      tableName,
    );

    if (columnTables === undefined) {
      throw new HttpErrors[404]("Columns couldn't for " + tableName);
    }
    const camelCase = require('camelcase');
    const variableTableName = camelCase(tableName, {pascalCase: true});
    let modelText = `
    import {Entity, model, property} from '@loopback/repository';

    @model({
      settings: {
        mssql: {
          table: '@TableName',
        },
      },
    })
    export class @variableTableName extends Entity {
    `;

    modelText = modelText.replace('@TableName', tableName);
    modelText = modelText.replace('@variableTableName', variableTableName);
    await this.wordsNinjaService.loadDictionary(sourceLanguage);
    for (const column of columnTables) {
      modelText += await this.getNodeEquivelant(
        column.DataType,
        column.ColumnName,
        column.CharacterMaximumLength ?? '0',
        column.IsNullable ?? true,
        primaryColumn,
        targetLanguage,
        sourceLanguage,
      );
    }
    modelText +=
      ' constructor(data?: Partial<' +
      variableTableName +
      '>) {     super(data);   } }  ' +
      '\nexport interface ' +
      variableTableName +
      'Relations {   ' +
      '} \n export type ' +
      variableTableName +
      'WithRelations = ' +
      variableTableName +
      ' & ' +
      variableTableName +
      'Relations;';

    modelText = modelText.replace(' ?', '?');

    return modelText;
  }
}
