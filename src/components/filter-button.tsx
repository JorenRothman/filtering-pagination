'use client'

import type { Type } from '@/payload-types'
import { usePathname, useRouter } from 'next/navigation'

interface Props {
  type: Type
}

export default function FilterButton({ type }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  function onClick() {
    const searchParams = new URLSearchParams(window.location.search)

    const currentFilters = searchParams.getAll('type')

    const operation = currentFilters.includes(type.title) ? 'delete' : 'append'
    searchParams[operation]('type', type.title)

    // Delete page param if filters change
    if (searchParams.get('page')) {
      searchParams.delete('page')
    }

    router.push(pathname + '?' + searchParams.toString())
  }

  return <button onClick={onClick}>{type.title}</button>
}
