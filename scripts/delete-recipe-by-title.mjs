import { MongoClient } from "mongodb"
import { config } from "dotenv"
import { readFileSync } from "fs"
import { resolve } from "path"

const envPath = resolve(process.cwd(), ".env.local")
try {
  readFileSync(envPath)
  config({ path: envPath })
} catch {
  config()
}

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || "recipe-nest"

if (!uri) {
  console.error("Missing MONGODB_URI environment variable")
  process.exit(1)
}

const title = process.argv[2]
if (!title) {
  console.log("Usage: node scripts/delete-recipe-by-title.mjs <recipe-title>")
  process.exit(1)
}

const client = new MongoClient(uri)

try {
  await client.connect()
  const db = client.db(dbName)
  const collection = db.collection("recipes")

  const recipe = await collection.findOne({ title })

  if (!recipe) {
    console.log(`No recipe found with title "${title}"`)
    process.exit(0)
  }

  await collection.deleteOne({ _id: recipe._id })
  console.log(`Deleted recipe: ${recipe.title} (id: ${recipe.id})`)
} catch (error) {
  console.error(error)
  process.exit(1)
} finally {
  await client.close()
}

