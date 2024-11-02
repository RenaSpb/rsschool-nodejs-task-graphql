import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypeType } from './memberType.js';
import { PrismaClient } from '@prisma/client';

export const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        memberType: {
            type: MemberTypeType,
            resolve: async (profile: { memberTypeId: string }, _: any, { prisma }: { prisma: PrismaClient }) => {
                return prisma.memberType.findUnique({
                    where: { id: profile.memberTypeId }
                });
            }
        }
    })
});
