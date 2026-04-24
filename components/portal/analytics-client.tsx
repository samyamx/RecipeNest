"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

const PIE_COLORS = [
  "oklch(0.55 0.15 45)",
  "oklch(0.70 0.14 55)",
  "oklch(0.60 0.10 80)",
  "oklch(0.75 0.12 65)",
  "oklch(0.45 0.08 40)",
  "oklch(0.65 0.10 50)",
  "oklch(0.80 0.08 70)",
  "oklch(0.50 0.12 60)",
]

interface CategoryStat {
  name: string
  count: number
}

interface MonthlyUserData {
  month: string
  users: number
}

interface MonthlyReviewData {
  month: string
  reviews: number
  recipes: number
}

interface AnalyticsClientProps {
  categoryStats: CategoryStat[]
  monthlyUserData: MonthlyUserData[]
  monthlyReviewData: MonthlyReviewData[]
  totalRecipes: number
  totalReviews: number
}

export default function AnalyticsClient({
  categoryStats,
  monthlyUserData,
  monthlyReviewData,
  totalRecipes,
  totalReviews,
}: AnalyticsClientProps) {
  const topCategories = categoryStats.slice(0, 6)

  const pageViews = totalReviews * 3 + totalRecipes * 15

  const summaryStats = [
    { label: "Page Views", value: pageViews >= 1000 ? (pageViews / 1000).toFixed(1) + "k" : pageViews.toString(), change: "+15%" },
    { label: "Unique Visitors", value: Math.floor(pageViews * 0.28).toLocaleString(), change: "+10%" },
    { label: "Avg Session", value: "4m 32s", change: "+8%" },
    { label: "Bounce Rate", value: "24%", change: "-3%" },
  ]

  return (
    <div>
      <div>
        <h1 className="font-serif text-2xl text-foreground lg:text-3xl">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Insights into platform performance and user engagement</p>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-accent">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Growth */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyUserData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Area type="monotone" dataKey="users" stroke="oklch(0.55 0.15 45)" fill="oklch(0.55 0.15 45 / 0.15)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium">Recipe Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={topCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="count" nameKey="name">
                    {topCategories.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Legend
                    formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: 12 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Engagement */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-medium">Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyReviewData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Legend formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: 12 }}>{value}</span>} />
                  <Bar dataKey="recipes" fill="oklch(0.55 0.15 45)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reviews" fill="oklch(0.70 0.14 55)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
