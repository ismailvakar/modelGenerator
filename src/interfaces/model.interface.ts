export interface ColumnProperty {
  columnName: string;
  isNullable: string;
  dataType: string;
  columnDefault?: string;
  characterMaxLength?: number;
  hasForeign: string;
  constraintName: string;
}

export interface RuleSet {
  columnName: string;
  Rule: Behavior;
}

export interface Behavior {
  setNull?: boolean;
  dataType?: string;
  setPrimaryKey?: string;
}

const StringTypes = new Map<string, number>();
const NumberTypes = new Map<string, number>();
const DateTypes = new Map<string, number>();
const ObjectTypes = new Map<string, number>();
const BoolTypes = new Map<string, number>();

StringTypes.set('uniqueidentifier', 1);
StringTypes.set('varchar', 2);
StringTypes.set('nvarchar', 3);
StringTypes.set('char', 4);
StringTypes.set('text', 5);
StringTypes.set('ntext', 6);
StringTypes.set('nchar', 7);
StringTypes.set('varbinary', 8);
StringTypes.set('xml', 9);
StringTypes.set('sqlvariant', 10);

DateTypes.set('smalldatetime', 1);
DateTypes.set('datetime', 2);
DateTypes.set('date', 3);
DateTypes.set('time', 4);
DateTypes.set('datetime2', 5);

NumberTypes.set('float', 1);
NumberTypes.set('int', 2);
NumberTypes.set('tinyint', 3);
NumberTypes.set('smallint', 4);
NumberTypes.set('decimal', 4);
NumberTypes.set('bigint', 5);
NumberTypes.set('numeric', 6);
NumberTypes.set('real', 7);

BoolTypes.set('bit', 1);

ObjectTypes.set('image', 1);

export class DataTypes {
  columnName: string;
  type: string;
  priority: number;
  constructor(name: string, type: string, priority: number) {
    this.columnName = name;
    this.type = type;
    this.priority = priority;
  }

  static uniqueidentifier = new DataTypes('uniqueidentifier', 'string', 1);
  static varchar = new DataTypes('varchar', 'string', 2);
  static nvarchar = new DataTypes('nvarchar', 'string', 3);
  static char = new DataTypes('char', 'string', 4);
  static text = new DataTypes('text', 'string', 5);
  static ntext = new DataTypes('ntext', 'string', 6);
  static nchar = new DataTypes('nchar', 'string', 7);
  static varbinary = new DataTypes('varbinary', 'string', 8);
  static xml = new DataTypes('xml', 'string', 9);
  static sqlvariant = new DataTypes('sqlvariant', 'string', 10);

  static smalldatetime = new DataTypes('smalldatetime', 'date', 1);
  static datetime = new DataTypes('datetime', 'date', 2);
  static date = new DataTypes('date', 'date', 3);
  static time = new DataTypes('time', 'date', 4);
  static datetime2 = new DataTypes('datetime2', 'date', 5);

  static float = new DataTypes('float', 'number', 1);
  static int = new DataTypes('int', 'number', 2);
  static tinyint = new DataTypes('tinyint', 'number', 3);
  static smallint = new DataTypes('smallint', 'number', 4);
  static decimal = new DataTypes('decimal', 'number', 5);
  static bigint = new DataTypes('bigint', 'number', 6);
  static numeric = new DataTypes('numeric', 'number', 7);
  static real = new DataTypes('real', 'number', 8);

  static bit = new DataTypes('bit', 'boolean', 9);

  static image = new DataTypes('image', 'image', 10);

  public static getTypeByName(name: string) {
    switch (name) {
      case this.uniqueidentifier.columnName:
        return this.uniqueidentifier.type;

      case this.varchar.columnName:
        return this.varchar.type;

      case this.nvarchar.columnName:
        return this.nvarchar.type;

      case this.char.columnName:
        return this.char.type;
      case this.text.columnName:
        return this.text.type;
      case this.ntext.columnName:
        return this.ntext.type;

      case this.nchar.columnName:
        return this.nchar.type;

      case this.varbinary.columnName:
        return this.varbinary.type;

      case this.xml.columnName:
        return this.xml.type;

      case this.sqlvariant.columnName:
        return this.sqlvariant.type;

      case this.smalldatetime.columnName:
        return this.smalldatetime.type;

      case this.datetime.columnName:
        return this.datetime.type;

      case this.time.columnName:
        return this.time.type;

      case this.date.columnName:
        return this.date.type;

      case this.datetime2.columnName:
        return this.datetime2.type;

      case this.float.columnName:
        return this.float.type;

      case this.tinyint.columnName:
        return this.tinyint.type;

      case this.smallint.columnName:
        return this.smallint.type;

      case this.decimal.columnName:
        return this.decimal.type;

      case this.bigint.columnName:
        return this.bigint.type;

      case this.numeric.columnName:
        return this.numeric.type;

      case this.real.columnName:
        return this.real.type;

      case this.bit.columnName:
        return this.bit.type;

      case this.image.columnName:
        return this.image.type;
    }
  }

  public static getPriorityByName(name: string) {
    switch (name) {
      case this.uniqueidentifier.columnName:
        return this.uniqueidentifier.priority;

      case this.varchar.columnName:
        return this.varchar.priority;

      case this.nvarchar.columnName:
        return this.nvarchar.priority;

      case this.char.columnName:
        return this.char.priority;
      case this.text.columnName:
        return this.text.priority;
      case this.ntext.columnName:
        return this.ntext.priority;

      case this.nchar.columnName:
        return this.nchar.priority;

      case this.varbinary.columnName:
        return this.varbinary.priority;

      case this.xml.columnName:
        return this.xml.priority;

      case this.sqlvariant.columnName:
        return this.sqlvariant.priority;

      case this.smalldatetime.columnName:
        return this.smalldatetime.priority;

      case this.datetime.columnName:
        return this.datetime.priority;

      case this.time.columnName:
        return this.time.priority;

      case this.date.columnName:
        return this.date.priority;

      case this.datetime2.columnName:
        return this.datetime2.priority;

      case this.float.columnName:
        return this.float.priority;

      case this.tinyint.columnName:
        return this.tinyint.priority;

      case this.smallint.columnName:
        return this.smallint.priority;

      case this.decimal.columnName:
        return this.decimal.priority;

      case this.bigint.columnName:
        return this.bigint.priority;

      case this.numeric.columnName:
        return this.numeric.priority;

      case this.real.columnName:
        return this.real.priority;

      case this.bit.columnName:
        return this.bit.priority;

      case this.image.columnName:
        return this.image.priority;
    }
  }
}

export enum PkTypes {
  uniqId = 'uniqId',
  nextInt = 'nextInt',
  autoGenerate = 'autoGenerate',
  setZero = 'setZero',
  setEmpty = 'setEmpty',
}
