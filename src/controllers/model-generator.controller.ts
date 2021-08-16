// Uncomment these imports to begin using these cool features!
import {inject} from '@loopback/core';
import {get, param} from '@loopback/rest';
import {ModelGeneratorService} from '../services/model-generator.service';

export class ModelGeneratorController {
  constructor(
    @inject('services.ModelGeneratorService')
    protected modelGeneratorService: ModelGeneratorService,
  ) {}

  @get('/generateModel', {
    responses: {
      '200': {
        description: 'Returns model typescript of the given model',
        content: {
          'application/text': {
            schema: {type: 'string'},
          },
        },
      },
    },
  })
  async generateModel(
    @param.query.string('modelName', {
      description: 'model name of the required database',
      required: true,
    })
    modelName: string,
    @param.query.string('sourceLanguage', {
      description:
        'naming language on database https://github.com/vitalets/google-translate-api/blob/master/languages.js',
      example: 'tr',
      required: true,
    })
    sourceLanguage: string,
    @param.query.string('targetLanguage', {
      description:
        'target language would generate https://github.com/vitalets/google-translate-api/blob/master/languages.js',
      example: 'en',
      required: true,
    })
    targetLanguage: string,
  ) {
    return this.modelGeneratorService.generateModel(
      modelName,
      sourceLanguage,
      targetLanguage,
    );
  }
}
