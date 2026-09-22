import {
  defineArrayMember,
  defineField,
  defineType,
} from 'sanity';

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Project title',
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
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {
            title: 'Architectural Design',
            value: 'Architectural Design',
          },
          {
            title: 'Interior Design',
            value: 'Interior Design',
          },
          {
            title: 'Restoration',
            value: 'Restoration',
          },
          {
            title: 'Consulting',
            value: 'Consulting',
          },
        ],
        layout: 'dropdown',
      },
    }),

    defineField({
      name: 'projectType',
      title: 'Project type',
      type: 'string',
      description:
        'For example: Residential, Commercial or Hospitality.',
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),

    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) =>
        Rule.integer().min(1900).max(2100),
    }),

    defineField({
      name: 'status',
      title: 'Project status',
      type: 'string',
      options: {
        list: [
          {
            title: 'Concept',
            value: 'Concept',
          },
          {
            title: 'In progress',
            value: 'In progress',
          },
          {
            title: 'Completed',
            value: 'Completed',
          },
        ],
        layout: 'dropdown',
      },
    }),

    defineField({
      name: 'area',
      title: 'Project area',
      type: 'string',
      description: 'For example: 240 m²',
    }),

    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description:
        'A short introduction for project cards and previews.',
      validation: (Rule) =>
        Rule.max(300).warning(
          'Try to keep the introduction under 300 characters.',
        ),
    }),

    defineField({
      name: 'fullDescription',
      title: 'Full description',
      type: 'text',
      rows: 8,
      description:
        'The main description shown on the project details page.',
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover image',
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
      name: 'gallery',
      title: 'Project gallery',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'galleryImage',
          title: 'Gallery image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
            }),

            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean',
      description:
        'Enable this to show the project in the homepage project section.',
      initialValue: false,
    }),

    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description:
        'Lower numbers appear first. For example: 1, 2, 3.',
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
});