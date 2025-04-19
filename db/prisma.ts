import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../lib/generated/prisma';
import ws from 'ws';

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
// const connectionString = process.env.DATABASE_URL;

// Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const connectionString = `${process.env.DATABASE_URL}`;

// Init prisma client
const adapter = new PrismaNeon({ connectionString });
export const prisma = new PrismaClient({ adapter });

// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
// const adapter = new PrismaNeon(pool);
