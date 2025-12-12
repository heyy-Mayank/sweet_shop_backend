// src/prisma.ts
import 'dotenv/config'; // ensure .env is loaded early
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
