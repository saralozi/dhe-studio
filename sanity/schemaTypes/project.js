import {
  defineArrayMember,
  defineField,
  defineType,
} from 'sanity';

const getEnglishValue = (translations) => {
  return (
    translations?.find(
      (translation) => translation.language === 'en'
    )?.value || ''
  );
};

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Project title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',

      description:
        'The URL is generated from the English project title.',

      options: {
        source: (document) =>
          getEnglishValue(document.title),
        maxLength: 96,
      },

      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',

      description:
        'The website will translate the category automatically.',

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

      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'projectType',
      title: 'Project type',
      type: 'internationalizedArrayString',

      description:
        'For example: Residential, Commercial or Hospitality.',

      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'internationalizedArrayString',

      description:
        'Enter the location in English, Albanian and Turkish.',

      validation: (Rule) => Rule.required(),
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

      description:
        'The website will translate the status automatically.',

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

      description:
        'For example: 240 m². This value is shared by all languages.',
    }),

    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'internationalizedArrayText',

      description:
        'A short introduction for project cards and previews.',

      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'fullDescription',
      title: 'Full description',
      type: 'internationalizedArrayText',

      description:
        'The main description shown on the project details page.',

      validation: (Rule) => Rule.required(),
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
          type: 'internationalizedArrayString',

          description:
            'Describe the image in each language for accessibility.',

          validation: (Rule) => Rule.required(),
        }),
      ],

      validation: (Rule) => Rule.required(),
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
              type: 'internationalizedArrayString',

              description:
                'Describe the image in each language for accessibility.',

              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'internationalizedArrayString',

              description:
                'Optional caption displayed with the image.',
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
      category: 'category',
      media: 'coverImage',
    },

    prepare({ title, category, media }) {
      return {
        title:
          getEnglishValue(title) || 'Untitled project',
        subtitle: category,
        media,
      };
    },
  },
});