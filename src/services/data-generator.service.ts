import {BindingScope, inject, injectable} from '@loopback/core';
import {
  ColumnProperty,
  DataTypes,
  PkTypes,
  RuleSet,
} from '../interfaces/model.interface';
import {InformationSchemaTablesRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class DataGeneratorService {
  constructor(
    @inject('repositories.InformationSchemaTablesRepository')
    protected informationSchemaRepository: InformationSchemaTablesRepository,
  ) {}

  async getColumnProperties(tableName: string) {
    const columnPropertyList = await this.informationSchemaRepository
      .getColumnProperties(tableName)
      .catch(err => {
        throw new Error(err);
      });

    const ruleSet: RuleSet = {
      columnName: '',
      Rule: {setNull: false},
    };

    for (const columnProperty of columnPropertyList) {
      await this.handleDataType(columnProperty, ruleSet);
      await this.handleNullable(columnProperty, ruleSet);
      await this.handlePrivateKey(columnProperty, ruleSet);
    }
  }

  async handleDataType(columnProperty: ColumnProperty, ruleSet: RuleSet) {
    const dataType = DataTypes.getTypeByName(columnProperty.dataType);
    console.log('dataType', dataType);

    if (!dataType) {
      throw new Error('data tipi bulunamadı');
    }
    ruleSet.columnName = columnProperty.columnName;
  }

  async handleNullable(columnProperty: ColumnProperty, ruleSet: RuleSet) {
    const priority = DataTypes.getPriorityByName(columnProperty.columnName);
    const isNullable = columnProperty.isNullable === 'YES';
    const dataType = DataTypes.getTypeByName(columnProperty.dataType);

    if (isNullable) {
      if (!columnProperty.columnDefault) {
        ruleSet.Rule.setNull = true;
      }
      switch (dataType) {
        case 'string':
          if (priority && priority >= 5) {
            ruleSet.Rule.setNull = true;
          }
          break;
        case 'number':
          if (priority && priority >= 3) {
            ruleSet.Rule.setNull = true;
          }
          break;
        case 'date':
          if (priority && priority >= 4) {
            ruleSet.Rule.setNull = true;
          }
          break;
        case 'image':
          ruleSet.Rule.setNull = true;
          break;
        case 'boolean':
          ruleSet.Rule.setNull = false;
          break;
      }
    } else {
      ruleSet.Rule.setNull = false;
    }
  }

  async handlePrivateKey(columnProperty: ColumnProperty, ruleSet: RuleSet) {
    const keyName = columnProperty.constraintName.slice(0, 2);
    if (keyName === 'PK') {
      if (columnProperty.columnDefault === '(newid())') {
        ruleSet.Rule.setPrimaryKey = PkTypes.autoGenerate;
      }
      if (columnProperty.columnDefault === null) {
        if (columnProperty.dataType === DataTypes.uniqueidentifier.columnName) {
          ruleSet.Rule.setPrimaryKey = 'uniqId';
        } else if (columnProperty.dataType === DataTypes.int.columnName) {
          ruleSet.Rule.setPrimaryKey = PkTypes.nextInt;
        } else if (columnProperty.dataType === DataTypes.varchar.columnName) {
          ruleSet.Rule.setPrimaryKey = PkTypes.uniqId;
        }
      }
      if (columnProperty.columnDefault === `create default [sbrnull] as ''`) {
        ruleSet.Rule.setPrimaryKey = PkTypes.setEmpty;
      }
      if (columnProperty.columnDefault === `create default [sbrzero] as 0`) {
        ruleSet.Rule.setPrimaryKey = PkTypes.setZero;
      }
    }
  }

  async generateData() {}
}
