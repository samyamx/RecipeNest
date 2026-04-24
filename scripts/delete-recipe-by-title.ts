import { getDatabase } from "../lib/mongodb"

async function deleteRecipeByTitle(title: string) {
  const db = await getDatabase()
  const collection = db.collection("recipes")

  const recipe = await collection.findOne({ title })

  if (!recipe) {
    console.log(`No recipe found with title "${title}"`)
    return
  }

  await collection.deleteOne({ _id: recipe._id })
  console.log(`Deleted recipe: ${recipe.title} (id: ${recipe.id})`)
}

const title = process.argv[2]
if (!title) {
  console.log("Usage: npx tsx scripts/delete-recipe-by-title.ts <recipe-title>")
  process.exit(1)
}

deleteRecipeByTitle(title).catch(console.error)

