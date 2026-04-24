"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Save, Eye, Plus, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function PortalAddRecipePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [cookTime, setCookTime] = useState("")
  const [servings, setServings] = useState("")
  const [featured, setFeatured] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [ingredients, setIngredients] = useState<string[]>([""])
  const [instructions, setInstructions] = useState<string[]>([""])
  const [isSubmitting, setIsSubmitting] = useState(false)

  function addIngredient() {
    setIngredients([...ingredients, ""])
  }

  function removeIngredient(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  function updateIngredient(index: number, value: string) {
    const updated = [...ingredients]
    updated[index] = value
    setIngredients(updated)
  }

  function addInstruction() {
    setInstructions([...instructions, ""])
  }

  function removeInstruction(index: number) {
    setInstructions(instructions.filter((_, i) => i !== index))
  }

  function updateInstruction(index: number, value: string) {
    const updated = [...instructions]
    updated[index] = value
    setInstructions(updated)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Please choose an image under 5MB.")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit() {
    const payload = {
      category,
      cookTime,
      description,
      difficulty: difficulty as "Easy" | "Medium" | "Hard",
      featured,
      image: imagePreview ?? undefined,
      ingredients: ingredients.filter(Boolean),
      servings: Number(servings),
      steps: instructions.filter(Boolean),
      title,
    }

    if (
      !payload.title.trim() ||
      !payload.description.trim() ||
      !payload.category ||
      !payload.difficulty ||
      !payload.cookTime.trim() ||
      !payload.servings ||
      payload.ingredients.length === 0 ||
      payload.steps.length === 0
    ) {
      toast.error("Please complete every required field before saving.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(errorData?.error || "Failed to save recipe.")
      }

      const data = (await response.json()) as { recipe: { id: string } }
      toast.success("Recipe saved successfully!")
      router.push(`/recipe/${data.recipe.id}`)
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "Unable to save recipe right now.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground lg:text-3xl">Add / Edit Recipe</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create or modify a recipe in the system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" disabled={isSubmitting}>
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Recipe"}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="title">Recipe Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter recipe title" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the recipe" rows={4} />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Ingredients</Label>
                {ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {i + 1}
                    </span>
                    <Input value={ing} onChange={(e) => updateIngredient(i, e.target.value)} placeholder="e.g., 2 cups flour" />
                    {ingredients.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeIngredient(i)} className="shrink-0" aria-label="Remove ingredient">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addIngredient} className="gap-2 self-start">
                  <Plus className="h-4 w-4" />
                  Add Ingredient
                </Button>
              </div>
              <div className="flex flex-col gap-3">
                <Label>Instructions</Label>
                {instructions.map((inst, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-2.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {i + 1}
                    </span>
                    <Textarea value={inst} onChange={(e) => updateInstruction(i, e.target.value)} placeholder={`Step ${i + 1}...`} rows={2} />
                    {instructions.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeInstruction(i)} className="shrink-0 mt-1.5" aria-label="Remove instruction">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addInstruction} className="gap-2 self-start">
                  <Plus className="h-4 w-4" />
                  Add Step
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["Pasta", "Bread", "Breakfast", "Seafood", "Pizza", "Dessert", "Salad", "Soup", "Vegan"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cookTimePortal">Cook Time</Label>
                <Input id="cookTimePortal" value={cookTime} onChange={(e) => setCookTime(e.target.value)} placeholder="e.g., 30 min" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="servingsPortal">Servings</Label>
                <Input id="servingsPortal" type="number" value={servings} onChange={(e) => setServings(e.target.value)} placeholder="e.g., 4" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured Recipe</Label>
                <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">Image</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/40">
                {imagePreview ? (
                  <div className="relative h-40 w-full">
                    <Image src={imagePreview} alt="Preview" fill className="rounded-lg object-cover" />
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Click to upload</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

