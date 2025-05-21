import { getPayload, type Where } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'
import type { Media, Type } from '@/payload-types'
import FilterButton from '@/components/filter-button'
import Image from 'next/image'
import LoadMoreButton from '@/components/load-more-button'

function displayType(type: number | Type | undefined | null) {
  if (!type || typeof type === 'number') {
    return null
  }
  return <span>{type.title}</span>
}

function ImageComponent({ image }: { image: number | Media }) {
  if (typeof image === 'number') {
    return null
  }

  if (!image.url) {
    return null
  }

  return (
    <Image
      style={{ width: '100%' }}
      src={image.url}
      alt={image.alt}
      width={image.width || 800}
      height={image.height || 600}
    />
  )
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
  const page = Number.parseInt((await searchParams).page as string) || 1

  const articlesQuery = await payload.find({
    collection: 'articles',
    limit: 12 * page,
    depth: 2,
    where: await createArticleWhereQuery(filters),
  })

  console.log(articlesQuery)

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
        {articles.map((article, index) => (
          <article key={article.id}>
            <p>Order: {index}</p>
            <ImageComponent image={article.image} />
            <h4>{article.title}</h4>
            <p>Tags: {displayType(article.types)}</p>
          </article>
        ))}
      </div>
      <LoadMoreButton />
    </div>
  )
}
