// src/lib/prisma.ts or similar
import { PrismaClient } from '../generated/prisma' // adjust path if needed

export const $db = new PrismaClient()
