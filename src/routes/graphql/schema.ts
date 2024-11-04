import { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { UserType } from './types/user.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { MemberTypeType, MemberTypeIdEnum } from './types/memberType.js';
import { UUIDType } from './types/uuid.js';
import type { PrismaClient } from '@prisma/client';
import {
    CreateUserInput, ChangeUserInput,
    CreatePostInput, ChangePostInput,
    CreateProfileInput, ChangeProfileInput
} from './types/inputs.js';

interface Context {
    prisma: PrismaClient;
}

interface CreateUserInput {
    name: string;
    balance: number;
}

interface CreatePostInput {
    title: string;
    content: string;
    authorId: string;
}

interface CreateProfileInput {
    isMale: boolean;
    yearOfBirth: number;
    userId: string;
    memberTypeId: string;
}

interface ChangeUserInput {
    name?: string;
    balance?: number;
}

interface ChangePostInput {
    title?: string;
    content?: string;
}

interface ChangeProfileInput {
    isMale?: boolean;
    yearOfBirth?: number;
    memberTypeId?: string;
}


const RootQuery = new GraphQLObjectType<unknown, Context>({
    name: 'RootQueryType',
    fields: {
        profiles: {
            type: new GraphQLList(new GraphQLNonNull(ProfileType)),
            resolve: async (_, __, { prisma }) => {
                return prisma.profile.findMany();
            }
        },
        users: {
            type: new GraphQLList(new GraphQLNonNull(UserType)),
            resolve: async (_, __, { prisma }) => {
                return prisma.user.findMany();
            }
        },
        posts: {
            type: new GraphQLList(new GraphQLNonNull(PostType)),
            resolve: async (_, __, { prisma }) => {
                return prisma.post.findMany();
            }
        },
        memberTypes: {
            type: new GraphQLList(new GraphQLNonNull(MemberTypeType)),
            resolve: async (_, __, { prisma }) => {
                return prisma.memberType.findMany();
            }
        },
        profile: {
            type: ProfileType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_, args: { id: string }, { prisma }) => {
                return prisma.profile.findUnique({
                    where: { id: args.id }
                });
            }
        },
        user: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_, args: { id: string }, { prisma }) => {
                return prisma.user.findUnique({
                    where: { id: args.id }
                });
            }
        },
        post: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_, args: { id: string }, { prisma }) => {
                return prisma.post.findUnique({
                    where: { id: args.id }
                });
            }
        },
        memberType: {
            type: MemberTypeType,
            args: {
                id: { type: new GraphQLNonNull(MemberTypeIdEnum) }
            },
            resolve: async (_, args: { id: string }, { prisma }) => {
                const result = await prisma.memberType.findUnique({
                    where: { id: args.id }
                });
                if (!result) {
                    throw new Error(`MemberType with ID ${args.id} not found`);
                }
                return result;
            }
        }
    }
});

const Mutations = new GraphQLObjectType<unknown, Context>({
    name: 'Mutations',
    fields: {
        createUser: {
            type: new GraphQLNonNull(UserType),
            args: {
                dto: { type: new GraphQLNonNull(CreateUserInput) }
            },
            resolve: async (_, { dto }: { dto: CreateUserInput }, { prisma }) => {
                return prisma.user.create({ data: dto });
            }
        },
        createPost: {
            type: new GraphQLNonNull(PostType),
            args: {
                dto: { type: new GraphQLNonNull(CreatePostInput) }
            },
            resolve: async (_, { dto }: { dto: CreatePostInput }, { prisma }) => {
                return prisma.post.create({ data: dto });
            }
        },
        createProfile: {
            type: new GraphQLNonNull(ProfileType),
            args: {
                dto: { type: new GraphQLNonNull(CreateProfileInput) }
            },
            resolve: async (_, { dto }: { dto: CreateProfileInput }, { prisma }) => {
                return prisma.profile.create({ data: dto });
            }
        },
        changeUser: {
            type: new GraphQLNonNull(UserType),
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangeUserInput) }
            },
            resolve: async (_, { id, dto }: { id: string; dto: ChangeUserInput }, { prisma }) => {
                return prisma.user.update({
                    where: { id },
                    data: dto
                });
            }
        },
        changePost: {
            type: new GraphQLNonNull(PostType),
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangePostInput) }
            },
            resolve: async (_, { id, dto }: { id: string; dto: ChangePostInput }, { prisma }) => {
                return prisma.post.update({
                    where: { id },
                    data: dto
                });
            }
        },
        changeProfile: {
            type: new GraphQLNonNull(ProfileType),
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangeProfileInput) }
            },
            resolve: async (_, { id, dto }: { id: string; dto: ChangeProfileInput }, { prisma }) => {
                return prisma.profile.update({
                    where: { id },
                    data: dto
                });
            }
        },
        deleteUser: {
            type: new GraphQLNonNull(GraphQLString),
            args: {
                id: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_, { id }: { id: string }, { prisma }) => {
                await prisma.user.delete({ where: { id } });
                return "User deleted successfully";
            }
        },
        deletePost: {
            type: new GraphQLNonNull(GraphQLString),
            args: {
                id: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_, { id }: { id: string }, { prisma }) => {
                await prisma.post.delete({ where: { id } });
                return "Post deleted successfully";
            }
        },
        deleteProfile: {
            type: new GraphQLNonNull(GraphQLString),
            args: {
                id: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_, { id }: { id: string }, { prisma }) => {
                await prisma.profile.delete({ where: { id } });
                return "Profile deleted successfully";
            }
        },
        subscribeTo: {
            type: new GraphQLNonNull(GraphQLString),
            args: {
                userId: { type: new GraphQLNonNull(UUIDType) },
                authorId: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_, { userId, authorId }: { userId: string; authorId: string }, { prisma }) => {
                await prisma.subscribersOnAuthors.create({
                    data: {
                        subscriberId: userId,
                        authorId: authorId
                    }
                });
                return "Subscribed successfully";
            }
        },
        unsubscribeFrom: {
            type: new GraphQLNonNull(GraphQLString),
            args: {
                userId: { type: new GraphQLNonNull(UUIDType) },
                authorId: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_, { userId, authorId }: { userId: string; authorId: string }, { prisma }) => {
                await prisma.subscribersOnAuthors.delete({
                    where: {
                        subscriberId_authorId: {
                            subscriberId: userId,
                            authorId: authorId
                        }
                    }
                });
                return "Unsubscribed successfully";
            }
        }
    }
});

export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations
});
