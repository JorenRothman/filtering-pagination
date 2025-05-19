import type { CollectionConfig } from 'payload'

export const Types: CollectionConfig = {
  slug: 'types',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'text',
      name: 'title',
      required: true,
    },
  ],
}
