import { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { UserType } from './types/user.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { MemberTypeType } from './types/memberType.js';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client';

interface Context {
    prisma: PrismaClient;
}

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        memberTypes: {
            type: new GraphQLList(new GraphQLNonNull(MemberTypeType)),
            resolve: async (_: unknown, __: unknown, { prisma }: Context) => {
                return prisma.memberType.findMany();
            }
        },
        posts: {
            type: new GraphQLList(new GraphQLNonNull(PostType)),
            resolve: async (_: unknown, __: unknown, { prisma }: Context) => {
                return prisma.post.findMany();
            }
        },
        users: {
            type: new GraphQLList(new GraphQLNonNull(UserType)),
            resolve: async (_: unknown, __: unknown, { prisma }: Context) => {
                return prisma.user.findMany();
            }
        },
        profiles: {
            type: new GraphQLList(new GraphQLNonNull(ProfileType)),
            resolve: async (_: unknown, __: unknown, { prisma }: Context) => {
                return prisma.profile.findMany();
            }
        },

        memberType: {
            type: MemberTypeType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
                return prisma.memberType.findUnique({
                    where: { id }
                });
            }
        },
        post: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
                return prisma.post.findUnique({
                    where: { id }
                });
            }
        },
        user: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
                return prisma.user.findUnique({
                    where: { id }
                });
            }
        },
        profile: {
            type: ProfileType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
                return prisma.profile.findUnique({
                    where: { id }
                });
            }
        }
    }
});

export const schema = new GraphQLSchema({
    query: RootQuery
});
