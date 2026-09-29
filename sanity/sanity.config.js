import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import {
  internationalizedArray,
} from 'sanity-plugin-internationalized-array';

export default defineConfig({
  name: 'default',
  title: 'DHE Studio',

  projectId: 'wzitgkes',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), internationalizedArray({
    languages: [
      {
        id: 'en',
        title: 'English',
      },
      {
        id: 'sq',
        title: 'Shqip',
      },
      {
        id: 'tr',
        title: 'Türkçe',
      },
    ],

    defaultLanguages: ['en', 'sq', 'tr'],

    fieldTypes: ['string', 'text'],

    buttonAddAll: true,
  }),],

  schema: {
    types: schemaTypes,
  },
})
