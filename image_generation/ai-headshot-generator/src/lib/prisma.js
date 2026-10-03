import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// In-memory store for instant zero-dependency running
const inMemoryStore = {
  creations: [],
  users: [
    {
      id: "dev-user",
      name: "Guest Creator",
      email: "guest@localhost",
      credits: 999999
    }
  ]
};

const mockPrisma = {
  user: {
    async findUnique({ where }) {
      return inMemoryStore.users.find(u => u.id === where?.id || u.email === where?.email) || inMemoryStore.users[0];
    },
    async update({ where, data }) {
      const u = inMemoryStore.users[0];
      if (data?.credits?.increment) u.credits += data.credits.increment;
      if (data?.credits?.decrement) u.credits = Math.max(0, u.credits - data.credits.decrement);
      return u;
    }
  },
  creation: {
    async create({ data }) {
      const item = {
        id: `creation_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date(),
        status: data?.status || "completed",
        ...data
      };
      inMemoryStore.creations.unshift(item);
      return item;
    },
    async findUnique({ where }) {
      if (where?.requestId) {
        const found = inMemoryStore.creations.find(c => c.requestId === where.requestId);
        if (found) return found;
      }
      return {
        id: `creation_${Date.now()}`,
        status: "completed",
        requestId: where?.requestId,
        imageUrl: JSON.stringify(["https://cdn.muapi.ai/outputs/d09a771a8b2a45f1b0b5e6aba5955f1b.jpg"]),
        category: "LinkedIn"
      };
    },
    async findMany({ where }) {
      return inMemoryStore.creations.length > 0 ? inMemoryStore.creations : [
        {
          id: "welcome_creation_1",
          category: "LinkedIn",
          aspectRatio: "1:1",
          status: "completed",
          imageUrl: JSON.stringify(["https://cdn.muapi.ai/outputs/d09a771a8b2a45f1b0b5e6aba5955f1b.jpg"]),
          createdAt: new Date()
        }
      ];
    },
    async update({ where, data }) {
      const item = inMemoryStore.creations.find(c => c.id === where?.id || c.requestId === where?.requestId);
      if (item) {
        Object.assign(item, data);
        return item;
      }
      return data;
    }
  }
};
mockPrisma.Creation = mockPrisma.creation;

export const prisma = mockPrisma;
globalForPrisma.prisma = mockPrisma;
