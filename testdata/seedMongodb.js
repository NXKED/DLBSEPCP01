const { MongoClient } = require('mongodb')
const fs = require('fs')

const params = JSON.parse(
  fs.readFileSync('./infrastructure/parameters.json', 'utf8')
)

// console.log(params)
const uri = params.parameters?.mongoUrl?.value
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
    console.log('Db wurde befüllt')
  } finally {
    await client.close()
  }
}

seed().catch(console.error)
