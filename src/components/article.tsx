'use client'

import type { Article, Media, Type } from '@/payload-types'
import Image from 'next/image'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

interface Props {
  article: Article
}

export default function Article({ article }: Props) {
  const html = convertLexicalToHTML({ data: article.text as SerializedEditorState })

  return (
    <article key={article.id}>
      <ImageComponent image={article.image} />
      <h4>{article.title}</h4>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
      <p>Tags: {displayType(article.types)}</p>
    </article>
  )
}

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
