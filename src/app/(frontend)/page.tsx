import { getPayload, type Where } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'
import type { Type } from '@/payload-types'
import FilterButton from '@/components/filter-button'

function displayType(type: number | Type | undefined | null) {
  if (!type || typeof type === 'number') {
    return null
  }
  return <span>{type.title}</span>
}
interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function createArticleWhereQuery(filters: string | string[]): Promise<Where> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

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
}

export default async function HomePage({ searchParams }: Props) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const filters = (await searchParams).type || ''

  const articlesQuery = await payload.find({
    collection: 'articles',
    limit: 12,
    depth: 2,
    where: await createArticleWhereQuery(filters),
  })

  const typesQuery = await payload.find({
    collection: 'types',
  })

  const articles = articlesQuery.docs

  const types = typesQuery.docs

  return (
    <div className="home">
      <nav>
        {types.map((type) => (
          <FilterButton key={type.id} type={type} />
        ))}
      </nav>
      <div>
        {articles.map((article) => (
          <article key={article.id}>
            <h1>{article.title}</h1>
            <p>Tags: {displayType(article.types)}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
