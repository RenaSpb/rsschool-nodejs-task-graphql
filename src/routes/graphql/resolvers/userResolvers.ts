export const userResolvers = {
    Query: {
        users: async (_, __, { prisma }) => {
            return prisma.user.findMany();
        },
        user: async (_, { id }, { prisma }) => {
            return prisma.user.findUnique({
                where: { id }
            });
        }
    }
};
