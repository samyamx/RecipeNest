import { ExplorePageClient } from "@/components/explore/explore-page-client"
import { getSiteCategories, listRecipes } from "@/lib/recipe-store"

export const dynamic = "force-dynamic"

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const activeCategory = params.category || "All"
  const search = params.search || ""

  const [categories, recipes] = await Promise.all([
    getSiteCategories(),
    listRecipes({ category: activeCategory, search }),
  ])

  return (
    <ExplorePageClient
      categories={categories}
      initialCategory={activeCategory}
      initialRecipes={recipes}
      initialSearch={search}
    />
  )
}
    