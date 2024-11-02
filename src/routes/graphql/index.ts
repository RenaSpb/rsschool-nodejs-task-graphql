// src/routes/graphql/index.ts
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { schema } from './schema.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  console.log('=== GraphQL Plugin Initializing ===');
  const { prisma } = fastify;

  // Проверяем подключение к базе данных
  try {
    const userCount = await prisma.user.count();
    console.log('Connected to database. User count:', userCount);
  } catch (error) {
    console.error('Database connection error:', error);
  }

  fastify.get('/test', async () => {
    const userCount = await prisma.user.count();
    return {
      message: 'GraphQL endpoint test',
      userCount,
      timestamp: new Date().toISOString()
    };
  });
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
      console.log('=== Handling GraphQL Request ===');
      try {
        const { query, variables } = request.body as {
          query: string;
          variables?: Record<string, unknown>
        };

        const userCount = await prisma.user.count();
        console.log('Current user count:', userCount);

        const result = await graphql({
          schema,
          source: query,
          contextValue: { prisma },
          variableValues: variables
        });

        console.log('GraphQL Result:', result);

        void reply.type('application/json');
        return result;
      } catch (error) {
        console.error('Error processing request:', error);
        return reply.status(500).send({
          errors: [{ message: error instanceof Error ? error.message : 'Internal server error' }]
        });
      }
    },
  });

  console.log('=== GraphQL Plugin Initialized ===');
};

export default plugin;
