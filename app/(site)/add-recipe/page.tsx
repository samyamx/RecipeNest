"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Upload, Plus, X, ChefHat, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const steps = ["Details", "Ingredients", "Instructions", "Preview"]

export default function AddRecipePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [cookTime, setCookTime] = useState("")
  const [servings, setServings] = useState("")
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
    const sessionRes = await fetch("/api/auth/session")
    const sessionData = (await sessionRes.json().catch(() => null)) as { user?: { id: string } } | null

    if (!sessionData?.user) {
      toast.error("Please register to add recipes.")
      router.push("/login")
      return
    }

    const payload = {
      category,
      cookTime,
      description,
      difficulty: difficulty as "Easy" | "Medium" | "Hard",
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
      toast.error("Please complete every required field before publishing.")
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
        throw new Error(errorData?.error || "Failed to publish recipe.")
      }

      const data = (await response.json()) as { recipe: { id: string } }
      toast.success("Recipe submitted successfully!")
      router.push(`/recipe/${data.recipe.id}`)
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "Unable to publish recipe right now.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8 lg:py-12">
      <h1 className="font-serif text-3xl text-foreground">Add a recipe</h1>
      <p className="mt-1 text-muted-foreground">Share your culinary creation with the community</p>

      {/* Step Indicator */}
      <div className="mt-8 flex items-center gap-2">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep(i)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                i < currentStep
                  ? "bg-primary text-primary-foreground"
                  : i === currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
            </button>
            <span className={cn("hidden text-sm sm:block", i === currentStep ? "font-medium text-foreground" : "text-muted-foreground")}>
              {step}
            </span>
            {i < steps.length - 1 && <div className="h-px w-6 bg-border lg:w-12" />}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* Step 1: Details */}
        {currentStep === 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Recipe Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Tuscan Herb Pasta" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Briefly describe your recipe..." rows={3} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
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
                  <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cookTime">Cook Time</Label>
                <Input id="cookTime" value={cookTime} onChange={(e) => setCookTime(e.target.value)} placeholder="e.g., 30 min" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="servings">Servings</Label>
                <Input id="servings" type="number" value={servings} onChange={(e) => setServings(e.target.value)} placeholder="e.g., 4" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Recipe Image</Label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/30 p-8 transition-colors hover:border-primary/40 hover:bg-secondary/50">
                {imagePreview ? (
                  <div className="relative h-40 w-full">
                    <Image src={imagePreview} alt="Preview" fill className="rounded-lg object-cover" />
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Click to upload an image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Ingredients */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-lg text-foreground">Ingredients</h2>
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
        )}

        {/* Step 3: Instructions */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-lg text-foreground">Instructions</h2>
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
        )}

        {/* Step 4: Preview */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-lg text-foreground">Preview your recipe</h2>
            {imagePreview && (
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image src={imagePreview} alt="Recipe preview" fill className="object-cover" />
              </div>
            )}
            <div>
              <h3 className="font-serif text-2xl text-foreground">{title || "Untitled Recipe"}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{description || "No description provided"}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {category && <Badge variant="secondary">{category}</Badge>}
                {difficulty && <Badge variant="outline">{difficulty}</Badge>}
                {cookTime && <Badge variant="outline">{cookTime}</Badge>}
                {servings && <Badge variant="outline">{servings} servings</Badge>}
              </div>
            </div>
            {ingredients.filter(Boolean).length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-foreground">Ingredients</h4>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {ingredients.filter(Boolean).map((ing, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-card-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {instructions.filter(Boolean).length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-foreground">Instructions</h4>
                <ol className="mt-2 flex flex-col gap-2">
                  {instructions.filter(Boolean).map((inst, i) => (
                    <li key={i} className="flex gap-3 text-sm text-card-foreground">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">{i + 1}</span>
                      {inst}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={() => setCurrentStep(currentStep + 1)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <ChefHat className="h-4 w-4" />
              {isSubmitting ? "Publishing..." : "Publish Recipe"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
