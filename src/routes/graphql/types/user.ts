import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLNonNull } from 'graphql';
import { UUIDType } from './uuid.js';

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) }
    })
});
