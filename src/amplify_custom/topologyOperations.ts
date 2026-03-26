/**
 * Topology GraphQL operations (custom; not overwritten by amplify codegen).
 */

export const getTopology = /* GraphQL */ `
  query GetTopology($id: ID!) {
    getTopology(id: $id) {
      id
      name
      string_code
      number_code
      status
      polygon
      topologyParent {
        id
        name
        polygon
      }
      topologies {
        items {
          id
          name
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const listTopologies = /* GraphQL */ `
  query ListTopologies(
    $filter: ModelTopologyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTopologies(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        string_code
        number_code
        status
        polygon
        topologyParent {
          id
          name
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const createTopology = /* GraphQL */ `
  mutation CreateTopology(
    $input: CreateTopologyInput!
    $condition: ModelTopologyConditionInput
  ) {
    createTopology(input: $input, condition: $condition) {
      id
      name
      string_code
      number_code
      status
      polygon
      topologyParent {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateTopology = /* GraphQL */ `
  mutation UpdateTopology(
    $input: UpdateTopologyInput!
    $condition: ModelTopologyConditionInput
  ) {
    updateTopology(input: $input, condition: $condition) {
      id
      name
      string_code
      number_code
      status
      polygon
      topologyParent {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const deleteTopology = /* GraphQL */ `
  mutation DeleteTopology(
    $input: DeleteTopologyInput!
    $condition: ModelTopologyConditionInput
  ) {
    deleteTopology(input: $input, condition: $condition) {
      id
    }
  }
`;
