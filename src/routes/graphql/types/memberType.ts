// src/routes/graphql/types/memberType.ts
import { GraphQLEnumType, GraphQLObjectType, GraphQLNonNull, GraphQLFloat, GraphQLInt } from 'graphql';

export const MemberTypeIdEnum = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
        BASIC: { value: 'BASIC' },
        BUSINESS: { value: 'BUSINESS' }
    }
});

export const MemberTypeType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
        discount: { type: new GraphQLNonNull(GraphQLFloat) },
        postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) }
    })
});
