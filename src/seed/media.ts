import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory

const file1 = path.resolve(__dirname, 'images/180-400x200.jpg')
const file2 = path.resolve(__dirname, 'images/186-800x300.jpg')
const file3 = path.resolve(__dirname, 'images/324-600x800.jpg')
const file4 = path.resolve(__dirname, 'images/370-200x800.jpg')
const file5 = path.resolve(__dirname, 'images/574-200x300.jpg')
const file6 = path.resolve(__dirname, 'images/1020-400x400.jpg')

async function run() {
  try {
    const payload = await getPayload({ config })

    await payload.create({
      collection: 'media',
      data: {
        alt: 'some text',
      },
      filePath: file1,
    })
    await payload.create({
      collection: 'media',
      data: {
        alt: 'some text',
      },
      filePath: file2,
    })
    await payload.create({
      collection: 'media',
      data: {
        alt: 'some text',
      },
      filePath: file3,
    })
    await payload.create({
      collection: 'media',
      data: {
        alt: 'some text',
      },
      filePath: file4,
    })
    await payload.create({
      collection: 'media',
      data: {
        alt: 'some text',
      },
      filePath: file5,
    })
    await payload.create({
      collection: 'media',
      data: {
        alt: 'some text',
      },
      filePath: file6,
    })
  } catch (error) {
    console.error(JSON.stringify(error))
    process.exit(1)
  }

  process.exit(0)
}

await run()
