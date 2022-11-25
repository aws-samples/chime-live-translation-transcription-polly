/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
      speaker
      createdAt
      meetingId
      message
      user
      language
      direction
      updatedAt
    }
  }
`;
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
      speaker
      createdAt
      meetingId
      message
      user
      language
      direction
      updatedAt
    }
  }
`;
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
      speaker
      createdAt
      meetingId
      message
      user
      language
      direction
      updatedAt
    }
  }
`;
export const createSummary = /* GraphQL */ `
  mutation CreateSummary(
    $input: CreateSummaryInput!
    $condition: ModelSummaryConditionInput
  ) {
    createSummary(input: $input, condition: $condition) {
      language
      NumberofMessagesProcessed
      NumberofWordsProcssed
      createdAt
      updatedAt
    }
  }
`;
export const updateSummary = /* GraphQL */ `
  mutation UpdateSummary(
    $input: UpdateSummaryInput!
    $condition: ModelSummaryConditionInput
  ) {
    updateSummary(input: $input, condition: $condition) {
      language
      NumberofMessagesProcessed
      NumberofWordsProcssed
      createdAt
      updatedAt
    }
  }
`;
export const deleteSummary = /* GraphQL */ `
  mutation DeleteSummary(
    $input: DeleteSummaryInput!
    $condition: ModelSummaryConditionInput
  ) {
    deleteSummary(input: $input, condition: $condition) {
      language
      NumberofMessagesProcessed
      NumberofWordsProcssed
      createdAt
      updatedAt
    }
  }
`;
export const createWordcloud = /* GraphQL */ `
  mutation CreateWordcloud(
    $input: CreateWordcloudInput!
    $condition: ModelWordcloudConditionInput
  ) {
    createWordcloud(input: $input, condition: $condition) {
      timestamp
      words
      createdAt
      updatedAt
    }
  }
`;
export const updateWordcloud = /* GraphQL */ `
  mutation UpdateWordcloud(
    $input: UpdateWordcloudInput!
    $condition: ModelWordcloudConditionInput
  ) {
    updateWordcloud(input: $input, condition: $condition) {
      timestamp
      words
      createdAt
      updatedAt
    }
  }
`;
export const deleteWordcloud = /* GraphQL */ `
  mutation DeleteWordcloud(
    $input: DeleteWordcloudInput!
    $condition: ModelWordcloudConditionInput
  ) {
    deleteWordcloud(input: $input, condition: $condition) {
      timestamp
      words
      createdAt
      updatedAt
    }
  }
`;
