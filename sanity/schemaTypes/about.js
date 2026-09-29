import { defineField, defineType } from 'sanity';

export const about = defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',

  fields: [
    /* Hero section */

    defineField({
      name: 'heroLabel',
      title: 'Hero label',
      type: 'internationalizedArrayString',
      description:
        'The small label displayed above the main title.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'heroTitleFirstLine',
      title: 'Hero title — first line',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'heroTitleSecondLine',
      title: 'Hero title — second line',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'heroIntroduction',
      title: 'Hero introduction',
      type: 'internationalizedArrayText',
      validation: (Rule) => Rule.required(),
    }),

    /* Studio story */

    defineField({
      name: 'storyImage',
      title: 'Studio image',
      type: 'image',

      options: {
        hotspot: true,
      },

      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'internationalizedArrayString',
          description:
            'Describe the image in each language for accessibility.',
          validation: (Rule) => Rule.required(),
        }),
      ],

      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'storyParagraphs',
      title: 'Studio story paragraphs',
      type: 'array',
      description:
        'Add the paragraphs in the order they should appear.',

      of: [
        {
          name: 'storyParagraph',
          title: 'Paragraph',
          type: 'object',

          fields: [
            defineField({
              name: 'text',
              title: 'Paragraph text',
              type: 'internationalizedArrayText',
              validation: (Rule) => Rule.required(),
            }),
          ],

          preview: {
            select: {
              englishText: 'text.0.value',
            },

            prepare({ englishText }) {
              return {
                title:
                  englishText || 'Studio story paragraph',
              };
            },
          },
        },
      ],

      validation: (Rule) => Rule.min(1).required(),
    }),

    defineField({
      name: 'projectsLinkLabel',
      title: 'Projects link text',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),

    /* Approach section */

    defineField({
      name: 'approachLabel',
      title: 'Approach section label',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'principles',
      title: 'Design principles',
      type: 'array',
      description:
        'Add the three principles in the order they should appear.',

      of: [
        {
          name: 'principle',
          title: 'Principle',
          type: 'object',

          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'description',
              title: 'Description',
              type: 'internationalizedArrayText',
              validation: (Rule) => Rule.required(),
            }),
          ],

          preview: {
            select: {
              englishTitle: 'title.0.value',
              englishDescription:
                'description.0.value',
            },

            prepare({
              englishTitle,
              englishDescription,
            }) {
              return {
                title:
                  englishTitle || 'Design principle',
                subtitle: englishDescription,
              };
            },
          },
        },
      ],

      validation: (Rule) =>
        Rule.length(3).error(
          'Please add exactly three design principles.'
        ),
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'About Page',
        subtitle: 'English · Shqip · Türkçe',
      };
    },
  },
});