import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

export const config = {
  name: 'SecDs',
  connector: 'mssql',
  host: process.env.SEC_HOST ?? '192.168.0.106\\TEST',
  instance: process.env.SEC_INST ?? 'TEST',
  port: parseInt(process.env.SEC_PORT ?? '1443', 10),
  user: process.env.SEC_USER ?? 'hwn83',
  scheme: 'dbo',
  password: process.env.SEC_PASSWORD ?? 'nwH83',
  database: process.env.SEC_DATABASE ?? 'SEB2021',
  encrypt: false,
  enableArithAbort: true,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class SecDsDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'SecDs';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.SecDs', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
