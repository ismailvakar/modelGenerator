// Uncomment these imports to begin using these cool features!
import { inject} from '@loopback/core';
import { param, get } from '@loopback/rest';
import {ModelGeneratorService} from '../services/model-generator.service';


export class ModelGeneratorController {
  constructor(
    @inject('services.ModelGeneratorService')
    protected modelGeneratorService: ModelGeneratorService,
  ) {}


  @get('/generateModel')
  async generateModel(
    @param.query.string('modelName')
    modelName: string,
  ) {
    
    return this.modelGeneratorService.generateModel(modelName);
  }

}
