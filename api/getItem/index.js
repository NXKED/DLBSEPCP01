const { MongoClient } = require('mongodb')

let cachedClient = null
let cachedDb = null

module.exports = async function (context, req) {
  try {
    context.log('Starting function...')

    const mongoUrl = process.env.MONGO_URL
    if (!mongoUrl) throw new Error('MongoDB env variable not set')

    if (!cachedClient || !cachedDb) {
      context.log('Kein cached client - Verbinden zur MongoDB...')
      cachedClient = new MongoClient(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })

      await cachedClient.connect()
      cachedDb = cachedClient.db('webappdb')
      context.log('Verbunden zur cached DB')
    } else {
      context.log('Verwende Cached MongoDB')
    }

    // Suche nach titel in DB
    const title = req.query.title
    const query = title ? { title: { $regex: title, $options: 'i' } } : {}

    let items = await cachedDb.collection('items').find(query).toArray()

    // Wenn DB noch nicht mit Daten befuellt
    if (items.length === 0) {
      context.log('Keine Eintraege in der DB gefunden')
      context.res = {
        status: 200,
        body: [],
      }
      return
    }

    context.log(`Fetched ${items.length} items`)

    context.res = {
      status: 200,
      body: items,
    }
  } catch (err) {
    context.log.error('Error caught', err)
    context.res = {
      status: 500,
      body: {
        message: 'Function error',
        error: err.message,
        stack: err.stack,
      },
      headers: { 'Content-Type': 'application/json' },
    }
  }
}
