import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { uploadRecipeImage } from "@/lib/cloudinary"
import { createRecipe, listRecipes } from "@/lib/recipe-store"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const recipes = await listRecipes({
    author: searchParams.get("author") ?? undefined,
    bookmarked: searchParams.has("bookmarked")
      ? searchParams.get("bookmarked") === "true"
      : undefined,
    category: searchParams.get("category") ?? undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    search: searchParams.get("search") ?? undefined,
  })

  return NextResponse.json({ recipes })
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "You must be signed in to add a recipe." }, { status: 401 })
    }

    const body = (await request.json()) as {
      author?: string
      category?: string
      cookTime?: string
      description?: string
      difficulty?: "Easy" | "Medium" | "Hard"
      featured?: boolean
      image?: string
      ingredients?: string[]
      servings?: number
      steps?: string[]
      title?: string
    }

    if (
      !body.title?.trim() ||
      !body.description?.trim() ||
      !body.category?.trim() ||
      !body.difficulty ||
      !body.cookTime?.trim() ||
      !body.servings ||
      !body.ingredients?.filter(Boolean).length ||
      !body.steps?.filter(Boolean).length
    ) {
      return NextResponse.json({ error: "Missing required recipe fields." }, { status: 400 })
    }

    const uploadedImage = body.image ? await uploadRecipeImage(body.image) : undefined

    const recipe = await createRecipe({
      author: currentUser?.name || body.author,
      category: body.category,
      cookTime: body.cookTime,
      description: body.description,
      difficulty: body.difficulty,
      featured: body.featured,
      image: uploadedImage,
      ingredients: body.ingredients,
      servings: Number(body.servings),
      steps: body.steps,
      title: body.title,
    })

    revalidatePath("/")
    revalidatePath("/explore")
    revalidatePath("/profile")
    revalidatePath("/portal")

    return NextResponse.json({ recipe }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Unable to publish recipe right now." }, { status: 500 })
  }
}
