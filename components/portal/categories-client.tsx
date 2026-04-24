"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface Category {
  name: string
  count: number
}

interface CategoriesClientProps {
  initialCategories: Category[]
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [editDialog, setEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [editName, setEditName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  function handleEdit(cat: Category) {
    setCurrentCategory(cat)
    setEditName(cat.name)
    setIsCreating(false)
    setEditDialog(true)
  }

  function handleCreate() {
    setCurrentCategory(null)
    setEditName("")
    setIsCreating(true)
    setEditDialog(true)
  }

  function handleSave() {
    if (isCreating) {
      setCategories([...categories, { name: editName, count: 0 }])
      toast.success("Category created!")
    } else if (currentCategory) {
      setCategories(categories.map((c) => (c.name === currentCategory.name ? { ...c, name: editName } : c)))
      toast.success("Category updated!")
    }
    setEditDialog(false)
  }

  function handleDelete() {
    if (currentCategory) {
      setCategories(categories.filter((c) => c.name !== currentCategory.name))
      toast.success("Category deleted!")
    }
    setDeleteDialog(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground lg:text-3xl">Category Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Organize recipes into categories</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card className="mt-6 border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium">All Categories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Name</th>
                  <th className="pb-3 font-medium text-muted-foreground">Recipes</th>
                  <th className="pb-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.name} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium text-foreground">{cat.name}</td>
                    <td className="py-3 text-muted-foreground">{cat.count}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(cat)} aria-label={`Edit ${cat.name}`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => {
                            setCurrentCategory(cat)
                            setDeleteDialog(true)
                          }}
                          aria-label={`Delete ${cat.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit / Create Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isCreating ? "Create Category" : "Edit Category"}</DialogTitle>
            <DialogDescription>
              {isCreating ? "Add a new recipe category" : "Update the category name"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1.5 py-2">
            <Label htmlFor="catName">Category Name</Label>
            <Input id="catName" value={editName} onChange={(e) => setEditName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSave}>
              {isCreating ? "Create" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{currentCategory?.name}&rdquo;? This will affect {currentCategory?.count} recipes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
