import "server-only"

import crypto from "crypto"
import { cookies } from "next/headers"
import { getDatabase } from "@/lib/mongodb"

const usersCollectionName = "users"
const sessionsCollectionName = "sessions"
const sessionCookieName = "recipe_nest_session"

export type AppUser = {
  bio?: string
  createdAt: string
  email: string
  id: string
  location?: string
  name: string
  role: "Admin" | "Chef" | "User"
  status: "Active" | "Inactive"
}

type UserDocument = AppUser & {
  passwordHash: string
}

type SessionDocument = {
  createdAt: string
  expiresAt: string
  token: string
  userId: string
}

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex")
  const derived = crypto.scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${derived}`
}

function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedHash] = passwordHash.split(":")

  if (!salt || !storedHash) {
    return false
  }

  const incomingHash = crypto.scryptSync(password, salt, 64)
  const storedBuffer = Buffer.from(storedHash, "hex")

  if (incomingHash.length !== storedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(incomingHash, storedBuffer)
}

function sanitizeUser(user: UserDocument): AppUser {
  return {
    bio: user.bio ?? "",
    createdAt: user.createdAt,
    email: user.email,
    id: user.id,
    location: user.location ?? "",
    name: user.name,
    role: user.role,
    status: user.status,
  }
}

async function getUsersCollection() {
  const db = await getDatabase()
  return db.collection<UserDocument>(usersCollectionName)
}

async function getSessionsCollection() {
  const db = await getDatabase()
  return db.collection<SessionDocument>(sessionsCollectionName)
}

async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies()
  cookieStore.set(sessionCookieName, token, {
    expires: expiresAt,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(sessionCookieName)
}

export async function signUpUser(input: { email: string; name: string; password: string }) {
  const usersCollection = await getUsersCollection()

  const normalizedEmail = input.email.trim().toLowerCase()
  const existingUser = await usersCollection.findOne({ email: normalizedEmail })

  if (existingUser) {
    throw new Error("An account with this email already exists.")
  }

  const user: UserDocument = {
    bio: "",
    createdAt: new Date().toISOString(),
    email: normalizedEmail,
    id: crypto.randomUUID(),
    location: "",
    name: input.name.trim(),
    passwordHash: hashPassword(input.password),
    role: "Chef",
    status: "Active",
  }

  await usersCollection.insertOne(user)
  return sanitizeUser(user)
}

export async function updateCurrentUserProfile(input: { bio: string; location: string; name: string; userId: string }) {
  const usersCollection = await getUsersCollection()

  const nextName = input.name.trim()
  const nextBio = input.bio.trim()
  const nextLocation = input.location.trim()

  if (!nextName) {
    throw new Error("Name is required.")
  }

  await usersCollection.updateOne(
    { id: input.userId },
    {
      $set: {
        bio: nextBio,
        location: nextLocation,
        name: nextName,
      },
    }
  )

  const updatedUser = await usersCollection.findOne({ id: input.userId })

  if (!updatedUser) {
    throw new Error("User not found.")
  }

  return sanitizeUser(updatedUser)
}

export async function signInUser(input: { email: string; password: string }) {
  const usersCollection = await getUsersCollection()

  const normalizedEmail = input.email.trim().toLowerCase()
  const user = await usersCollection.findOne({ email: normalizedEmail })

  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    throw new Error("Invalid email or password.")
  }

  return sanitizeUser(user)
}

export async function createSession(userId: string) {
  const sessionsCollection = await getSessionsCollection()

  const token = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

  await sessionsCollection.insertOne({
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    token,
    userId,
  })

  await setSessionCookie(token, expiresAt)
}

export async function deleteSession() {
  const sessionsCollection = await getSessionsCollection()
  const cookieStore = await cookies()
  const token = cookieStore.get(sessionCookieName)?.value

  if (token && sessionsCollection) {
    await sessionsCollection.deleteOne({ token })
  }

  await clearSessionCookie()
}

export async function getCurrentUser() {
  const usersCollection = await getUsersCollection()
  const sessionsCollection = await getSessionsCollection()
  const cookieStore = await cookies()
  const token = cookieStore.get(sessionCookieName)?.value

  if (!token || !usersCollection || !sessionsCollection) {
    return null
  }

  const session = await sessionsCollection.findOne({ token })

  if (!session) {
    return null
  }

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    await sessionsCollection.deleteOne({ token })
    await clearSessionCookie()
    return null
  }

  const user = await usersCollection.findOne({ id: session.userId })

  if (!user) {
    return null
  }

  return sanitizeUser(user)
}

export async function listUsersWithRecipeCounts() {
  const usersCollection = await getUsersCollection()
  const db = await getDatabase()

  const recipes = db.collection<{ author: string }>("recipes")
  const users = await usersCollection.find({}, { projection: { passwordHash: 0, _id: 0 } }).toArray()

  const enriched = await Promise.all(
    users.map(async (user) => {
      const recipesCount = await recipes.countDocuments({ author: user.name })
      return {
        ...sanitizeUser(user as UserDocument),
        joined: user.createdAt.slice(0, 10),
        recipes: recipesCount,
      }
    })
  )

  return enriched.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getUserStats() {
  const usersCollection = await getUsersCollection()
  const users = await usersCollection.find({}, { projection: { createdAt: 1 } }).toArray()
  const totalUsers = users.length

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const newUsersThisMonth = users.filter((u) => new Date(u.createdAt) >= startOfMonth).length

  return { totalUsers, newUsersThisMonth }
}

export async function getMonthlyUserStats() {
  const usersCollection = await getUsersCollection()
  const users = await usersCollection.find({}, { projection: { createdAt: 1 } }).toArray()

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const now = new Date()
  const months: { month: string; users: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      month: monthNames[d.getMonth()],
      users: 0,
    })
  }

  users.forEach((user) => {
    const created = new Date(user.createdAt)
    const label = monthNames[created.getMonth()]
    const entry = months.find((m) => m.month === label)
    if (entry) {
      entry.users += 1
    }
  })

  return months
}
