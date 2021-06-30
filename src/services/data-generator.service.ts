import {BindingScope, inject, injectable} from '@loopback/core';
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

    for (const columnProperty of columnPropertyList) {
    }
  }
}
