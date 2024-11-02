// src/routes/graphql/types/profile.ts
import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypeType } from './memberType.js';

export const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        memberType: {
            type: MemberTypeType,
            resolve: async (profile, _, { prisma }) => {
                return prisma.memberType.findUnique({
                    where: { id: profile.memberTypeId }
                });
            }
        }
    })
});
