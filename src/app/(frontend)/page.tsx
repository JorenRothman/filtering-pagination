import { getPayload, type Where } from 'payload'
import React, { cache } from 'react'

import config from '@/payload.config'
import './styles.css'
import FilterButton from '@/components/filter-button'
import LoadMoreButton from '@/components/load-more-button'
import Article from '@/components/article'
interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HomePage({ searchParams }: Props) {
  const filters = (await searchParams).type || ''
  const page = Number.parseInt((await searchParams).page as string) || 1

  const { types } = await getTypes()
  const { articles, hasNextPage } = await getArticles({
    where: await createArticleWhereQuery(filters),
    page,
  })

  return (
    <div className="home">
      <nav>
        {types.map((type) => (
          <FilterButton key={type.id} type={type} />
        ))}
      </nav>
      <div>
        {articles.map((article) => (
          <Article key={article.id} article={article} />
        ))}
      </div>
      {hasNextPage && <LoadMoreButton />}
    </div>
  )
}

const getArticles = cache(async ({ where, page }: { where: Where; page: number }) => {
  const payload = await getPayload({ config: await config })

  const articles = await payload.find({
    collection: 'articles',
    limit: 12 * page,
    depth: 2,
    where,
  })

  return { articles: articles.docs || null, hasNextPage: articles.hasNextPage }
})

const createArticleWhereQuery = cache(async (filters: string | string[]): Promise<Where> => {
  const payload = await getPayload({ config: await config })

  // If there are no filters return empty object
  if (!filters) {
    return {}
  }

  // Transform filters (type.title) into type objects
  const filteredType = await payload.find({
    collection: 'types',
    where: {
      title: {
        in: filters,
      },
    },
  })

  // If no types are found than the filter must be wrong return empty object
  if (filteredType.totalDocs < 1) {
    return {}
  }

  // Get types from query and create an array with only the type IDs
  const queriedItems = filteredType.docs
  const queriedItemsID = queriedItems.map((item) => item.id)

  return {
    types: {
      in: queriedItemsID,
    },
  }
})

const getTypes = cache(async () => {
  const payload = await getPayload({ config: await config })

  const types = await payload.find({
    collection: 'types',
  })

  return { types: types.docs }
})
