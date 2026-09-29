import { defineField, defineType } from 'sanity';

const getEnglishValue = (translations) => {
  return (
    translations?.find(
      (translation) => translation.language === 'en'
    )?.value || ''
  );
};

export const serviceType = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Service title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',

      description:
        'The URL is generated from the English service title.',

      options: {
        source: (document) =>
          getEnglishValue(document.title),
        maxLength: 96,
      },

      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'internationalizedArrayText',

      description:
        'Short text used on the homepage service card.',

      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'fullDescription',
      title: 'Full description',
      type: 'internationalizedArrayText',

      description:
        'The complete service description used on the Services page.',

      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'image',
      title: 'Service image',
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
      name: 'order',
      title: 'Display order',
      type: 'number',

      description:
        'Use 1, 2, 3 or 4 to control the service order.',

      validation: (Rule) =>
        Rule.required().integer().min(1),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'shortDescription',
      media: 'image',
    },

    prepare({ title, subtitle, media }) {
      return {
        title:
          getEnglishValue(title) || 'Untitled service',
        subtitle: getEnglishValue(subtitle),
        media,
      };
    },
  },
});