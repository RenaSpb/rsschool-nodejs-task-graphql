// src/routes/graphql/index.ts
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql'; // добавляем parse и validate
import { schema } from './schema.js';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  console.log('=== GraphQL Plugin Initializing ===');

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(request, reply) {
      try {
        const { query, variables } = request.body as {
          query: string;
          variables?: Record<string, unknown>
        };

        const documentAST = parse(query);
        const validationErrors = validate(schema, documentAST, [depthLimit(5)]);

        if (validationErrors.length > 0) {
          return reply.status(400).send({
            errors: validationErrors
          });
        }

        const result = await graphql({
          schema,
          source: query,
          contextValue: { prisma: fastify.prisma },
          variableValues: variables
        });

        return result;
      } catch (error) {
        console.error('Error:', error);
        return reply.status(500).send({
          errors: [{ message: error instanceof Error ? error.message : 'Internal server error' }]
        });
      }
    },
  });
};

export default plugin;
