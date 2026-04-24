import { getDashboardStats, getMonthlyRecipeStats, listRecipes } from "@/lib/recipe-store"
import { getUserStats } from "@/lib/auth"
import DashboardClient from "@/components/portal/dashboard-client"

export const dynamic = "force-dynamic"

export default async function PortalDashboardPage() {
  const [recipeStats, monthlyData, recentRecipes, userStats] = await Promise.all([
    getDashboardStats(),
    getMonthlyRecipeStats(),
    listRecipes({ limit: 5 }),
    getUserStats(),
  ])

  const stats = {
    totalRecipes: recipeStats.totalRecipes,
    totalUsers: userStats.totalUsers,
    totalReviews: recipeStats.totalReviews,
    avgRating: recipeStats.avgRating,
    monthlyVisits: monthlyData.reduce((sum, m) => sum + m.views, 0),
    newUsersThisMonth: userStats.newUsersThisMonth,
  }

  return <DashboardClient stats={stats} monthlyData={monthlyData} recentRecipes={recentRecipes} />
}
