export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  category: string
  cookTime: string
  servings: number
  difficulty: "Easy" | "Medium" | "Hard"
  rating: number
  reviews: number
  author: string
  authorAvatar: string
  bookmarked: boolean
  featured?: boolean
  ingredients: string[]
  steps: string[]
  createdAt: string
}

export const categories = [
  "All",
  "Pasta",
  "Bread",
  "Breakfast",
  "Seafood",
  "Pizza",
  "Dessert",
  "Salad",
  "Soup",
  "Vegan",
]

export const recipes: Recipe[] = [
  {
    id: "1",
    title: "Tuscan Herb Pasta",
    description:
      "A rich and creamy pasta dish with fresh basil, sun-dried tomatoes, and a hint of garlic. Perfect for a cozy dinner.",
    image: "/images/recipe-1.jpg",
    category: "Pasta",
    cookTime: "30 min",
    servings: 4,
    difficulty: "Easy",
    rating: 4.8,
    reviews: 124,
    author: "Chef Maria",
    authorAvatar: "",
    bookmarked: false,
    ingredients: [
      "400g penne pasta",
      "2 cups fresh basil leaves",
      "1/2 cup sun-dried tomatoes",
      "4 cloves garlic, minced",
      "1 cup heavy cream",
      "1/2 cup parmesan cheese",
      "2 tbsp olive oil",
      "Salt and pepper to taste",
    ],
    steps: [
      "Cook pasta according to package directions until al dente. Reserve 1 cup pasta water before draining.",
      "In a large skillet, heat olive oil over medium heat. Add minced garlic and cook until fragrant, about 1 minute.",
      "Add sun-dried tomatoes and cook for 2 minutes, stirring occasionally.",
      "Pour in the heavy cream and bring to a gentle simmer. Cook for 3-4 minutes until slightly thickened.",
      "Add the cooked pasta to the sauce, tossing to combine. Add pasta water as needed for consistency.",
      "Stir in fresh basil and parmesan cheese. Season with salt and pepper. Serve immediately.",
    ],
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    title: "Artisan Sourdough Bread",
    description:
      "A classic sourdough with a perfectly crispy crust and soft, tangy interior. Worth every moment of patience.",
    image: "/images/recipe-2.jpg",
    category: "Bread",
    cookTime: "4 hrs",
    servings: 8,
    difficulty: "Hard",
    rating: 4.9,
    reviews: 89,
    author: "Baker Tom",
    authorAvatar: "",
    bookmarked: true,
    ingredients: [
      "500g bread flour",
      "350ml warm water",
      "100g sourdough starter",
      "10g sea salt",
      "Rice flour for dusting",
    ],
    steps: [
      "Mix flour, water, and sourdough starter in a large bowl. Let rest for 30 minutes (autolyse).",
      "Add salt and mix thoroughly. Perform stretch and folds every 30 minutes for 2 hours.",
      "Shape the dough into a tight ball and place in a floured banneton basket.",
      "Refrigerate overnight for 8-12 hours for a slow, cold fermentation.",
      "Preheat oven with a Dutch oven inside to 500F. Score the dough and bake covered for 20 minutes.",
      "Remove lid and bake for another 20-25 minutes until deep golden brown. Cool completely before slicing.",
    ],
    createdAt: "2026-01-20",
  },
  {
    id: "3",
    title: "Berry Bliss Smoothie Bowl",
    description:
      "A vibrant and nutritious smoothie bowl packed with antioxidants, topped with fresh fruits and crunchy granola.",
    image: "/images/recipe-3.jpg",
    category: "Breakfast",
    cookTime: "10 min",
    servings: 1,
    difficulty: "Easy",
    rating: 4.7,
    reviews: 203,
    author: "Wellness Wren",
    authorAvatar: "",
    bookmarked: false,
    ingredients: [
      "1 cup frozen acai puree",
      "1 banana, frozen",
      "1/2 cup mixed berries",
      "1/4 cup almond milk",
      "Toppings: granola, coconut flakes, sliced banana, fresh berries",
    ],
    steps: [
      "Blend acai puree, frozen banana, mixed berries, and almond milk until thick and smooth.",
      "Pour into a bowl and arrange your toppings in rows across the top.",
      "Serve immediately and enjoy the vibrant flavors.",
    ],
    createdAt: "2026-02-01",
  },
  {
    id: "4",
    title: "Honey Glazed Salmon",
    description:
      "Perfectly seared salmon with a sweet honey glaze, served with roasted vegetables and a squeeze of fresh lemon.",
    image: "/images/recipe-4.jpg",
    category: "Seafood",
    cookTime: "25 min",
    servings: 2,
    difficulty: "Medium",
    rating: 4.9,
    reviews: 156,
    author: "Chef Maria",
    authorAvatar: "",
    bookmarked: true,
    ingredients: [
      "2 salmon fillets (6oz each)",
      "3 tbsp honey",
      "2 tbsp soy sauce",
      "1 tbsp Dijon mustard",
      "2 cloves garlic, minced",
      "1 lemon, juiced",
      "Fresh herbs for garnish",
    ],
    steps: [
      "Pat salmon fillets dry and season with salt and pepper.",
      "Mix honey, soy sauce, Dijon mustard, garlic, and lemon juice in a small bowl.",
      "Heat an oven-safe skillet over medium-high heat with olive oil. Sear salmon skin-side up for 3 minutes.",
      "Flip salmon and pour the honey glaze over the top.",
      "Transfer to a 400F oven and bake for 8-10 minutes until cooked through.",
      "Garnish with fresh herbs and lemon slices. Serve with roasted vegetables.",
    ],
    createdAt: "2026-02-05",
  },
  {
    id: "5",
    title: "Neapolitan Margherita Pizza",
    description:
      "An authentic wood-fired style pizza with San Marzano tomatoes, fresh mozzarella, and aromatic basil.",
    image: "/images/recipe-5.jpg",
    category: "Pizza",
    cookTime: "1 hr",
    servings: 4,
    difficulty: "Medium",
    rating: 4.8,
    reviews: 178,
    author: "Baker Tom",
    authorAvatar: "",
    bookmarked: false,
    ingredients: [
      "500g tipo 00 flour",
      "325ml warm water",
      "7g active dry yeast",
      "1 tsp sugar",
      "10g salt",
      "San Marzano tomatoes",
      "Fresh mozzarella",
      "Fresh basil leaves",
      "Extra virgin olive oil",
    ],
    steps: [
      "Dissolve yeast and sugar in warm water. Let sit for 5 minutes until foamy.",
      "Mix flour and salt, then add yeast mixture. Knead for 10 minutes until smooth and elastic.",
      "Let dough rise in a covered bowl for 1 hour until doubled in size.",
      "Divide into 4 balls. Stretch each into a thin round on a floured surface.",
      "Top with crushed San Marzano tomatoes, torn mozzarella, and a drizzle of olive oil.",
      "Bake at the highest oven temperature (500F+) for 8-10 minutes. Add fresh basil after baking.",
    ],
    createdAt: "2026-02-10",
  },
  {
    id: "6",
    title: "Molten Chocolate Lava Cake",
    description:
      "An indulgent chocolate dessert with a warm, gooey center that flows like lava. A true showstopper.",
    image: "/images/recipe-6.jpg",
    category: "Dessert",
    cookTime: "20 min",
    servings: 4,
    difficulty: "Medium",
    rating: 4.9,
    reviews: 312,
    author: "Pastry Chef Lina",
    authorAvatar: "",
    bookmarked: false,
    ingredients: [
      "200g dark chocolate (70%)",
      "150g unsalted butter",
      "3 large eggs",
      "3 egg yolks",
      "100g sugar",
      "50g all-purpose flour",
      "Cocoa powder for dusting",
      "Raspberry coulis for serving",
    ],
    steps: [
      "Preheat oven to 425F. Butter and dust 4 ramekins with cocoa powder.",
      "Melt chocolate and butter together in a double boiler, stirring until smooth.",
      "In a separate bowl, whisk eggs, egg yolks, and sugar until thick and pale.",
      "Fold the chocolate mixture into the egg mixture. Gently fold in the flour.",
      "Divide batter among the prepared ramekins. Bake for exactly 12-14 minutes.",
      "Let cool for 1 minute, then invert onto plates. Dust with powdered sugar and serve with raspberry coulis.",
    ],
    createdAt: "2026-02-15",
  },
]

export const dashboardStats = {
  totalRecipes: 1247,
  totalUsers: 8432,
  totalReviews: 15689,
  avgRating: 4.7,
  monthlyVisits: 45200,
  newUsersThisMonth: 342,
}

export const monthlyData = [
  { month: "Sep", recipes: 85, users: 320, views: 12400 },
  { month: "Oct", recipes: 102, users: 380, views: 15600 },
  { month: "Nov", recipes: 95, users: 410, views: 14200 },
  { month: "Dec", recipes: 130, users: 520, views: 21000 },
  { month: "Jan", recipes: 118, users: 480, views: 19800 },
  { month: "Feb", recipes: 145, users: 550, views: 24500 },
]

export const categoryStats = [
  { name: "Pasta", count: 234 },
  { name: "Dessert", count: 198 },
  { name: "Seafood", count: 156 },
  { name: "Bread", count: 142 },
  { name: "Breakfast", count: 189 },
  { name: "Pizza", count: 128 },
  { name: "Salad", count: 98 },
  { name: "Soup", count: 76 },
]

export const recentUsers = [
  { id: "1", name: "Sarah Chen", email: "sarah@example.com", role: "User", recipes: 12, joined: "2026-02-15", status: "Active" },
  { id: "2", name: "Marcus Rodriguez", email: "marcus@example.com", role: "Chef", recipes: 45, joined: "2026-01-20", status: "Active" },
  { id: "3", name: "Emily Watson", email: "emily@example.com", role: "User", recipes: 3, joined: "2026-02-10", status: "Active" },
  { id: "4", name: "James Lee", email: "james@example.com", role: "Admin", recipes: 28, joined: "2025-11-05", status: "Active" },
  { id: "5", name: "Aria Patel", email: "aria@example.com", role: "Chef", recipes: 67, joined: "2025-09-12", status: "Inactive" },
  { id: "6", name: "Lucas Brown", email: "lucas@example.com", role: "User", recipes: 8, joined: "2026-02-18", status: "Active" },
]
