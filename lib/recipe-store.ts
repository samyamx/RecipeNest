import "server-only"

import { categories as seedCategories, recipes as seedRecipes, type Recipe } from "@/lib/data"
import { getDatabaseSafely } from "@/lib/mongodb"

const recipesCollectionName = "recipes"
let fallbackRecipes = seedRecipes.map((recipe) => normalizeRecipe(recipe))

type RecipeFilters = {
  author?: string
  bookmarked?: boolean
  category?: string
  limit?: number
  search?: string
}

type CreateRecipeInput = {
  author?: string
  category: string
  cookTime: string
  description: string
  difficulty: Recipe["difficulty"]
  featured?: boolean
  image?: string
  ingredients: string[]
  servings: number
  steps: string[]
  title: string
}

type RecipeDocument = Recipe & {
  _id?: string
}

function getLocalRecipeImage(id: string) {
  if (/^\d+$/.test(id)) {
    return `/images/recipes/${id}.jpg`
  }

  return null
}

function getFallbackImage(id: string) {
  return getLocalRecipeImage(id) ?? `/api/assets/recipe/${id}`
}

function normalizeRecipe(recipe: Recipe): Recipe {
  const image = recipe.image?.trim()
  const localImage = getLocalRecipeImage(recipe.id)

  if (localImage && (!image || image === `/api/assets/recipe/${recipe.id}`)) {
    return {
      ...recipe,
      image: localImage,
      rating: Number(recipe.rating.toFixed(1)),
    }
  }

  return {
    ...recipe,
    image:
      image && (image.startsWith("data:") || image.startsWith("/api/") || image.startsWith("http"))
        ? image
        : getFallbackImage(recipe.id),
    rating: Number(recipe.rating.toFixed(1)),
  }
}

async function getRecipesCollection() {
  const db = await getDatabaseSafely()
  return db?.collection<RecipeDocument>(recipesCollectionName) ?? null
}

async function ensureSeedData() {
  const collection = await getRecipesCollection()

  if (!collection) {
    return null
  }

  const existingCount = await collection.estimatedDocumentCount()

  if (existingCount > 0) {
    return collection
  }

  await collection.insertMany(seedRecipes.map(normalizeRecipe))
  return collection
}

function sortRecipes(recipes: Recipe[]) {
  return recipes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

async function readRecipes() {
  const collection = await ensureSeedData()

  if (!collection) {
    return sortRecipes([...fallbackRecipes])
  }

  const recipes = await collection.find({}, { projection: { _id: 0 } }).toArray()
  return sortRecipes(recipes.map((recipe) => normalizeRecipe(recipe as Recipe)))
}

export async function listRecipes(filters: RecipeFilters = {}) {
  const recipes = await readRecipes()
  const query = filters.search?.trim().toLowerCase()

  let filtered = recipes.filter((recipe) => {
    const matchesCategory =
      !filters.category || filters.category === "All" || recipe.category === filters.category
    const matchesSearch =
      !query ||
      recipe.title.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query) ||
      recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query))
    const matchesBookmarked = filters.bookmarked === undefined || recipe.bookmarked === filters.bookmarked
    const matchesAuthor = !filters.author || recipe.author === filters.author

    return matchesCategory && matchesSearch && matchesBookmarked && matchesAuthor
  })

  filtered = sortRecipes(filtered)

  if (filters.limit) {
    filtered = filtered.slice(0, filters.limit)
  }

  return filtered
}

export async function getRecipeById(id: string) {
  const recipes = await readRecipes()
  return recipes.find((recipe) => recipe.id === id) ?? null
}

export async function createRecipe(input: CreateRecipeInput) {
  const collection = await ensureSeedData()

  const nextRecipe: Recipe = normalizeRecipe({
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description.trim(),
    image: input.image?.trim() || "",
    category: input.category,
    cookTime: input.cookTime.trim(),
    servings: input.servings,
    difficulty: input.difficulty,
    rating: 0,
    reviews: 0,
    author: input.author?.trim() || "Community Chef",
    authorAvatar: "",
    bookmarked: false,
    featured: input.featured,
    ingredients: input.ingredients.map((item) => item.trim()).filter(Boolean),
    steps: input.steps.map((item) => item.trim()).filter(Boolean),
    createdAt: new Date().toISOString().slice(0, 10),
  })

  if (!collection) {
    fallbackRecipes = sortRecipes([nextRecipe, ...fallbackRecipes])
    return nextRecipe
  }

  await collection.insertOne(nextRecipe)
  return nextRecipe
}

export async function updateRecipeBookmark(id: string, bookmarked?: boolean) {
  const collection = await ensureSeedData()

  if (!collection) {
    const current = fallbackRecipes.find((recipe) => recipe.id === id)

    if (!current) {
      return null
    }

    const nextBookmarked = bookmarked ?? !current.bookmarked
    const updated = normalizeRecipe({ ...current, bookmarked: nextBookmarked })
    fallbackRecipes = fallbackRecipes.map((recipe) => (recipe.id === id ? updated : recipe))
    return updated
  }

  const current = await collection.findOne({ id }, { projection: { _id: 0 } })

  if (!current) {
    return null
  }

  const nextBookmarked = bookmarked ?? !current.bookmarked
  await collection.updateOne({ id }, { $set: { bookmarked: nextBookmarked } })

  return normalizeRecipe({ ...(current as Recipe), bookmarked: nextBookmarked })
}

export async function addRecipeRating(id: string, userRating: number) {
  const collection = await ensureSeedData()

  if (!collection) {
    const current = fallbackRecipes.find((recipe) => recipe.id === id)

    if (!current) {
      return null
    }

    const nextReviews = current.reviews + 1
    const nextRating = (current.rating * current.reviews + userRating) / nextReviews
    const updated = normalizeRecipe({
      ...current,
      rating: nextRating,
      reviews: nextReviews,
    })

    fallbackRecipes = fallbackRecipes.map((recipe) => (recipe.id === id ? updated : recipe))
    return updated
  }

  const current = await collection.findOne({ id }, { projection: { _id: 0 } })

  if (!current) {
    return null
  }

  const nextReviews = current.reviews + 1
  const nextRating = (current.rating * current.reviews + userRating) / nextReviews
  const updated = normalizeRecipe({
    ...(current as Recipe),
    rating: nextRating,
    reviews: nextReviews,
  })

  await collection.updateOne(
    { id },
    {
      $set: {
        rating: updated.rating,
        reviews: updated.reviews,
      },
    }
  )

  return updated
}

export async function getCategoryStats() {
  const recipes = await readRecipes()
  const counts = recipes.reduce<Record<string, number>>((acc, recipe) => {
    acc[recipe.category] = (acc[recipe.category] ?? 0) + 1
    return acc
  }, {})

  return seedCategories
    .filter((category) => category !== "All")
    .map((category) => ({
      name: category,
      count: counts[category] ?? 0,
    }))
}

export async function getHomeStats() {
  const recipes = await readRecipes()
  const totalRecipes = recipes.length
  const totalReviews = recipes.reduce((sum, recipe) => sum + recipe.reviews, 0)
  const avgRating =
    totalRecipes > 0
      ? Number((recipes.reduce((sum, recipe) => sum + recipe.rating, 0) / totalRecipes).toFixed(1))
      : 0

  return {
    avgRating,
    totalMembers: 8400 + totalRecipes,
    totalRecipes,
  }
}

export async function getSiteCategories() {
  const stats = await getCategoryStats()
  return ["All", ...stats.map((category) => category.name)]
}

export async function getDashboardStats() {
  const recipes = await readRecipes()
  const totalRecipes = recipes.length
  const totalReviews = recipes.reduce((sum, recipe) => sum + recipe.reviews, 0)
  const avgRating =
    totalRecipes > 0
      ? Number((recipes.reduce((sum, recipe) => sum + recipe.rating, 0) / totalRecipes).toFixed(1))
      : 0

  return { totalRecipes, totalReviews, avgRating }
}

export async function getMonthlyRecipeStats() {
  const recipes = await readRecipes()

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const now = new Date()
  const months: { month: string; recipes: number; views: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      month: monthNames[d.getMonth()],
      recipes: 0,
      views: 0,
    })
  }

  recipes.forEach((recipe) => {
    const created = new Date(recipe.createdAt)
    const label = monthNames[created.getMonth()]
    const entry = months.find((m) => m.month === label)
    if (entry) {
      entry.recipes += 1
      entry.views += recipe.reviews * 30 + Math.floor(recipe.rating * 50)
    }
  })

  return months
}

export async function deleteRecipe(id: string) {
  const collection = await ensureSeedData()

  if (!collection) {
    const existing = fallbackRecipes.find((recipe) => recipe.id === id)
    if (!existing) {
      return false
    }
    fallbackRecipes = fallbackRecipes.filter((recipe) => recipe.id !== id)
    return true
  }

  const result = await collection.deleteOne({ id })
  return result.deletedCount > 0
}
