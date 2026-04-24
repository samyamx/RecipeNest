import { NextResponse } from "next/server"
import { getRecipeById, deleteRecipe } from "@/lib/recipe-store"

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const recipe = await getRecipeById(id)

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found." }, { status: 404 })
  }

  return NextResponse.json({ recipe })
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const success = await deleteRecipe(id)

  if (!success) {
    return NextResponse.json({ error: "Recipe not found." }, { status: 404 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
