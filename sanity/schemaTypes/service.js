import { defineField, defineType } from 'sanity';

export const serviceType = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Service title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description:
        'Short text used on the homepage service card.',
      validation: (Rule) =>
        Rule.max(250).warning(
          'Try to keep this under 250 characters.',
        ),
    }),

    defineField({
      name: 'fullDescription',
      title: 'Full description',
      type: 'text',
      rows: 8,
      description:
        'The complete service description used on the Services page.',
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
          type: 'string',
          description:
            'Describe the image for accessibility.',
        }),
      ],
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
  },
});