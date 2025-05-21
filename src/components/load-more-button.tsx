'use client'

import { usePathname, useRouter } from 'next/navigation'

export default function LoadMoreButton() {
  const router = useRouter()
  const pathname = usePathname()

  function onClick() {
    const searchParams = new URLSearchParams(window.location.search)

    const page = searchParams.get('page')

    if (page) {
      const next = Number.parseInt(page) + 1
      searchParams.set('page', next.toString())
    } else {
      searchParams.set('page', '2')
    }

    router.push(pathname + '?' + searchParams.toString(), {
      scroll: false,
    })
  }

  return <button onClick={onClick}>Load more</button>
}
