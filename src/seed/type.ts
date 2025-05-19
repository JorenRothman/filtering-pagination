import { getPayload } from 'payload'
import config from '@payload-config'

const types = ['Development', 'Design', 'News', 'About']

async function run() {
  try {
    const payload = await getPayload({ config })

    for (const type of types) {
      await payload.create({
        collection: 'types',
        data: {
          title: type,
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
