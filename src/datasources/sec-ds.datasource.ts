import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

export const config = {
  name: 'SecDs',
  connector: 'mssql',
  host: process.env.SEC_HOST,
  instance: process.env.SEC_INST,
  port: parseInt(process.env.SEC_PORT ?? '1443', 10),
  user: process.env.SEC_USER,
  scheme: 'INFORMATION_SCHEMA',
  password: process.env.SEC_PASSWORD,
  database: process.env.SEC_DATABASE,
  encrypt: false,
  enableArithAbort : true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class SecDsDataSource extends juggler.DataSource
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
