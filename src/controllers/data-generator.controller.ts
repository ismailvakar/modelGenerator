// Uncomment these imports to begin using these cool features!

import {get, param} from '@loopback/rest';

// import {inject} from '@loopback/core';

export class DataGeneratorController {
  constructor() {}
  @get('/generateData')
  async generateData(@param.query.string('tableName') tableName: string) {}
}
