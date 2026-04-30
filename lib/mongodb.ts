import "server-only"

import { MongoClient, type MongoClientOptions } from "mongodb"

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined
}

let client: MongoClient | undefined
let clientPromise: Promise<MongoClient> | undefined
let unavailableUntil = 0

const retryAfterFailureMs = 30_000

function resetClientState() {
  clientPromise = undefined
  global.__mongoClientPromise__ = undefined
  client = undefined
}

function shouldUseTls(uri: string) {
  return uri.startsWith("mongodb+srv://") || /[?&](ssl|tls)=true(?:&|$)/i.test(uri)
}

function getConnectionOptions(uri: string): MongoClientOptions {
  const options: MongoClientOptions = {
    connectTimeoutMS: 2500,
    serverSelectionTimeoutMS: 2500,
    socketTimeoutMS: 5000,
  }

  if (shouldUseTls(uri)) {
    options.tls = true

    if (process.env.NODE_ENV === "development" && process.env.MONGODB_TLS_ALLOW_INVALID_CERTS === "true") {
      options.tlsAllowInvalidCertificates = true
      options.tlsAllowInvalidHostnames = true
    }
  }

  return options
}

function describeConnectionError(error: unknown) {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`
  }

  return "Unknown MongoDB connection error"
}

function createClientPromise(uri: string) {
  const nextClient = new MongoClient(uri, getConnectionOptions(uri))

  client = nextClient

  return nextClient.connect().catch(async (error) => {
    resetClientState()

    try {
      await nextClient.close()
    } catch {
      // Ignore close errors after failed connect attempts.
    }

    throw error
  })
}

function getClientPromise() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error("Missing MONGODB_URI. Add it to your environment variables.")
  }

  if (!clientPromise) {
    if (process.env.NODE_ENV === "development") {
      if (!global.__mongoClientPromise__) {
        global.__mongoClientPromise__ = createClientPromise(uri)
      }

      clientPromise = global.__mongoClientPromise__
    } else {
      clientPromise = createClientPromise(uri)
    }
  }

  return clientPromise
}

export async function getDatabase() {
  try {
    const connectedClient = await getClientPromise()
    unavailableUntil = 0
    return connectedClient.db(process.env.MONGODB_DB || "recipe-nest")
  } catch (error) {
    resetClientState()
    throw error
  }
}

export async function getDatabaseSafely() {
  if (Date.now() < unavailableUntil) {
    return null
  }

  try {
    return await getDatabase()
  } catch (error) {
    unavailableUntil = Date.now() + retryAfterFailureMs
    console.warn(
      `MongoDB connection failed. Falling back to local seed data for ${retryAfterFailureMs / 1000}s. ${describeConnectionError(
        error
      )}`
    )
    return null
  }
}
