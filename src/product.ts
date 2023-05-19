import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";

import gql from "graphql-tag";

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key"])

  type Product @key(fields: "id") {
    id: ID!
    name: String!
    price: Float!
  }

  extend type Query {
    product(id: ID!): Product
    products: [Product]
  }
`;

const products = [
  { id: "1", name: "Product 1", price: 10.99 },
  { id: "2", name: "Product 2", price: 19.99 },
  { id: "3", name: "Product 3", price: 5.99 },
];

const resolvers = {
  Query: {
    product: (parent, { id }) => products.find((product) => product.id === id),
    products: () => products,
  },
  Product: {
    __resolveReference: (product) => products.find((p) => p.id === product.id),
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
