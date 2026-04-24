"use client"

import { UtensilsCrossed, Users, Star, TrendingUp, Eye, UserPlus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts"
import type { Recipe } from "@/lib/data"

interface MonthlyData {
  month: string
  recipes: number
  views: number
  users?: number
}

interface DashboardData {
  totalRecipes: number
  totalUsers: number
  totalReviews: number
  avgRating: number
  monthlyVisits: number
  newUsersThisMonth: number
}

interface DashboardClientProps {
  stats: DashboardData
  monthlyData: MonthlyData[]
  recentRecipes: Recipe[]
}

export default function DashboardClient({ stats, monthlyData, recentRecipes }: DashboardClientProps) {
  const statCards = [
    { label: "Total Recipes", value: stats.totalRecipes.toLocaleString(), icon: UtensilsCrossed, change: "+12%" },
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, change: "+8%" },
    { label: "Avg Rating", value: stats.avgRating.toString(), icon: Star, change: "+0.2" },
    { label: "Monthly Visits", value: (stats.monthlyVisits / 1000).toFixed(1) + "k", icon: Eye, change: "+15%" },
    { label: "Total Reviews", value: (stats.totalReviews / 1000).toFixed(1) + "k", icon: TrendingUp, change: "+22%" },
    { label: "New Users", value: stats.newUsersThisMonth.toString(), icon: UserPlus, change: "+5%" },
  ]

  return (
    <div>
      <div>
        <h1 className="font-serif text-2xl text-foreground lg:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back. Here is what is happening with Recipe Nest.</p>
      </div>

      {/* KPI Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">{stat.value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="mt-2 text-xs text-accent">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium text-foreground">New Recipes Per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs fill-muted-foreground" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Bar dataKey="recipes" fill="oklch(0.55 0.15 45)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium text-foreground">Monthly Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs fill-muted-foreground" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Line type="monotone" dataKey="views" stroke="oklch(0.70 0.14 55)" strokeWidth={2} dot={{ fill: 'oklch(0.70 0.14 55)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Recipes */}
      <Card className="mt-8 border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium text-foreground">Recent Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Title</th>
                  <th className="pb-3 font-medium text-muted-foreground">Category</th>
                  <th className="pb-3 font-medium text-muted-foreground">Author</th>
                  <th className="pb-3 font-medium text-muted-foreground">Rating</th>
                  <th className="pb-3 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRecipes.map((recipe) => (
                  <tr key={recipe.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium text-foreground">{recipe.title}</td>
                    <td className="py-3 text-muted-foreground">{recipe.category}</td>
                    <td className="py-3 text-muted-foreground">{recipe.author}</td>
                    <td className="py-3">
                      <span className="flex items-center gap-1 text-primary">
                        <Star className="h-3.5 w-3.5 fill-primary" />
                        {recipe.rating}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{recipe.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
