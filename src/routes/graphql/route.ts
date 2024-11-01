import { FastifyPluginAsync } from 'fastify';
import { graphql } from 'graphql';
import { schema } from './schema.js';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';

const route: FastifyPluginAsync = async (fastify) => {
    fastify.post('/', {
        schema: {
            body: createGqlResponseSchema.body,
            response: {
                200: gqlResponseSchema
            }
        }
    }, async (request) => {
        const { query, variables } = request.body;

        const result = await graphql({
            schema,
            source: query,
            contextValue: { prisma: fastify.prisma },
            variableValues: variables
        });

        return result;
    });
};

export default route;
