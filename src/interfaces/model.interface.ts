export interface ColumnProperties {
  columnName: string;
  isNullable: string;
  dataType: string;
  columnDefault?: string;
  characterMaxLength?: number;
  hasForeign: string;
  constraintName: string;
}
