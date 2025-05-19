import { getPayload } from 'payload'
import config from '@payload-config'
import { faker } from '@faker-js/faker'

const AMOUNT = 100

async function run() {
  try {
    const payload = await getPayload({ config })

    const typesDocs = await payload.find({
      collection: 'types',
    })

    const types = typesDocs.docs
    const amount = typesDocs.totalDocs

    await payload.delete({
      collection: 'articles',
      where: {
        id: {
          exists: true,
        },
      },
    })

    for (let i = 0; i < AMOUNT; i++) {
      const title = faker.book.title()
      const type = Math.floor(Math.random() * amount)

      await payload.create({
        collection: 'articles',
        data: {
          title: title,
          types: types[type],
        },
      })
    }
  } catch (error) {
    console.error(JSON.stringify(error))
    process.exit(1)
  }

  process.exit(0)
}

await run()
