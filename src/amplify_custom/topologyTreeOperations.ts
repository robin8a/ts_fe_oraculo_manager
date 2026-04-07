/**
 * TopologyTree GraphQL operations (custom; not overwritten by amplify codegen).
 *
 * Note: `TopologyTree` is defined in the backend schema, but current frontend codegen
 * does not include it. We keep these operations local and use `API.graphql` directly.
 */
 
export const listTopologyTrees = /* GraphQL */ `
  query ListTopologyTrees(
    $filter: ModelTopologyTreeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTopologyTrees(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        topology {
          id
          name
          projectTopologiesId
        }
        tree {
          id
          name
          projectTreesId
        }
        topologyTopologyTreesId
        treeTopologyTreesId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
 
export const createTopologyTree = /* GraphQL */ `
  mutation CreateTopologyTree(
    $input: CreateTopologyTreeInput!
    $condition: ModelTopologyTreeConditionInput
  ) {
    createTopologyTree(input: $input, condition: $condition) {
      id
      topologyTopologyTreesId
      treeTopologyTreesId
      createdAt
      updatedAt
    }
  }
`;
 
export const deleteTopologyTree = /* GraphQL */ `
  mutation DeleteTopologyTree(
    $input: DeleteTopologyTreeInput!
    $condition: ModelTopologyTreeConditionInput
  ) {
    deleteTopologyTree(input: $input, condition: $condition) {
      id
    }
  }
`;

