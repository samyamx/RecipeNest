"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ChefHat, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isRegister, setIsRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError("")
    const newErrors: Record<string, string> = {}
    if (isRegister && !name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email address"
    if (!password.trim()) newErrors.password = "Password is required"
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters"
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(isRegister ? "/api/auth/signup" : "/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        if (response.status === 401) {
          setErrors({
            email: " ",
            password: "Invalid email or password",
          })
        } else if (response.status === 409) {
          setErrors({
            email: "An account with this email already exists",
          })
        } else if (response.status === 503) {
          setFormError("We can't reach the database right now. Please try again in a moment.")
        }

        throw new Error(data.error || "Authentication failed.")
      }

      toast.success(isRegister ? "Account created successfully!" : "Signed in successfully!")
      router.push(searchParams.get("next") || "/portal")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <ChefHat className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="mt-12 font-serif text-2xl text-foreground">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isRegister
              ? "Join the Recipe Nest community"
              : "Sign in to your Recipe Nest account"}
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="w-full gap-2h-11">
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full gap-2 h-11">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
              Continue with GitHub
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {formError && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {formError}
              </div>
            )}
            {isRegister && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Julia Child"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={errors.password ? "border-destructive pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
            <Button type="submit" className="mt-2 h-11 bg-primary text-primary-foreground hover:bg-primary/90">
              {isSubmitting ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isRegister ? "Already have an account?" : "New to Recipe Nest?"}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister)
              setErrors({})
              setFormError("")
            }}
            className="font-medium text-primary hover:underline"
          >
            {isRegister ? "Sign in" : "Create an account"}
          </button>
        </p>
      </div>
    </div>
  )
}
