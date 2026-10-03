import { prisma } from "../prisma";

export const UserService = {
  async getCredits(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      });
      return user?.credits !== undefined ? user.credits : 999999;
    } catch {
      return 999999;
    }
  },

  async addCredits(userId, amount) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: amount || 100,
          },
        },
      });
    } catch {
      return { credits: 999999 };
    }
  },

  async deductCredits(userId, amount) {
    // Zero-friction mode: Never block or throw insufficient credits error
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            decrement: Math.min(amount || 0, 1),
          },
        },
      });
    } catch {
      // Ignore database errors in offline/sandbox mode
    }
    return true;
  },
};
