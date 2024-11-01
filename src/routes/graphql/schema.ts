// src/routes/graphql/schema.ts
import { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLFieldResolver } from 'graphql';
import { UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client';

interface Context {
    prisma: PrismaClient;
}

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users: {
            type: new GraphQLList(new GraphQLNonNull(UserType)),
            resolve: (async (
                _parent: unknown,
                _args: unknown,
                context: Context
            ) => {
                return context.prisma.user.findMany();
            }) as GraphQLFieldResolver<unknown, Context>
        },
        user: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: (async (
                _parent: unknown,
                args: { id: string },
                context: Context
            ) => {
                return context.prisma.user.findUnique({
                    where: { id: args.id }
                });
            }) as GraphQLFieldResolver<unknown, Context, { id: string }>
        }
    }
});

export const schema = new GraphQLSchema({
    query: RootQuery
});
