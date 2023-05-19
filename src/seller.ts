import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";

import gql from "graphql-tag";

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key"])

  type Seller @key(fields: "id") {
    id: ID!
    productIds: [ID!]!
    products: [Product!]!
  }

  type Product @key(fields: "id") {
    id: ID!
  }

  type Query {
    seller(id: ID!): Seller
  }
`;

const sellers = [
  { id: "1", productIds: ["1", "2"] },
  { id: "2", productIds: ["3"] },
];

const resolvers = {
  Query: {
    seller: (parent, { id }) => sellers.find((seller) => seller.id === id),
  },
  Seller: {
    products: (seller) =>
      seller.productIds.map((id) => ({ __typename: "Product", id })),
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4002 },
});

console.log(`🚀  Server ready at: ${url}`);
