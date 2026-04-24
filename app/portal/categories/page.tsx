import { getCategoryStats } from "@/lib/recipe-store"
import CategoriesClient from "@/components/portal/categories-client"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  const categoryStats = await getCategoryStats()
  return <CategoriesClient initialCategories={categoryStats} />
}
