/**
 * Custom ModelAI queries (with parent/children). Not overwritten by amplify codegen.
 * Used by useModelAI hook for get and list.
 */

export const getModelAI = `query GetModelAI($id: ID!) {
  getModelAI(id: $id) {
    id
    name
    description
    document_link
    api_link
    version
    is_approved
    tokens_cost
    cost_tokens
    modelAIParent { id name }
    modelAIs { items { id name } }
    createdAt
    updatedAt
  }
}
`;

export const listModelAIS = `query ListModelAIS(
  $filter: ModelModelAIFilterInput
  $limit: Int
  $nextToken: String
) {
  listModelAIS(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      document_link
      api_link
      version
      is_approved
      tokens_cost
      cost_tokens
      modelAIParent { id name }
      modelAIs { items { id name } }
      createdAt
      updatedAt
    }
    nextToken
  }
}
`;
