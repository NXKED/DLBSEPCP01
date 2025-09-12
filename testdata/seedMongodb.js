const { MongoClient } = require('mongodb')

const uri = process.env.MONGO_URL
const client = new MongoClient(uri)

async function seed() {
  try {
    await client.connect()
    const db = client.db('webappdb')
    const collection = db.collection('items')
    await collection.insertMany([
      { title: 'Apfel-Test', description: 'Das ist ein Test-Apfel' },
      { title: 'Banane-Test', description: 'Das ist eine Test-Banane' },
    ])
    console.log('Db befuellt')
  } finally {
    await client.close()
  }
}

seed().catch(console.error)
