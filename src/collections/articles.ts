import type { CollectionConfig } from 'payload'

export const articles: CollectionConfig = {
  slug: 'articles',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'text',
      type: 'richText',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'types',
      type: 'relationship',
      relationTo: 'types',
    },
  ],
}
