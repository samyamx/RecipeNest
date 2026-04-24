import { getCategoryStats, getDashboardStats, getMonthlyRecipeStats } from "@/lib/recipe-store"
import { getMonthlyUserStats } from "@/lib/auth"
import AnalyticsClient from "@/components/portal/analytics-client"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const [categoryStats, monthlyUserData, monthlyRecipeData, recipeStats] = await Promise.all([
    getCategoryStats(),
    getMonthlyUserStats(),
    getMonthlyRecipeStats(),
    getDashboardStats(),
  ])

  const monthlyReviewData = monthlyRecipeData.map((m) => ({
    month: m.month,
    recipes: m.recipes,
    reviews: Math.floor(m.views / 30),
  }))

  return (
    <AnalyticsClient
      categoryStats={categoryStats}
      monthlyUserData={monthlyUserData}
      monthlyReviewData={monthlyReviewData}
      totalRecipes={recipeStats.totalRecipes}
      totalReviews={recipeStats.totalReviews}
    />
  )
}
