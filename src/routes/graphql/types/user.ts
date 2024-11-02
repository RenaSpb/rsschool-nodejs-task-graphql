// src/routes/graphql/types/user.ts
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLNonNull, GraphQLList } from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
        profile: {
            type: ProfileType,
            resolve: async (user, _, { prisma }) => {
                return prisma.profile.findUnique({
                    where: { userId: user.id }
                });
            }
        },
        posts: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
            resolve: async (user, _, { prisma }) => {
                return prisma.post.findMany({
                    where: { authorId: user.id }
                });
            }
        },
        userSubscribedTo: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
            resolve: async (user, _, { prisma }) => {
                return prisma.user.findMany({
                    where: {
                        subscribedByUsers: {
                            some: { id: user.id }
                        }
                    }
                });
            }
        },
        subscribedToUser: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
            resolve: async (user, _, { prisma }) => {
                return prisma.user.findMany({
                    where: {
                        subscribedToUsers: {
                            some: { id: user.id }
                        }
                    }
                });
            }
        }
    })
});
