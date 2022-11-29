/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage($filter: ModelSubscriptionMessageFilterInput) {
    onCreateMessage(filter: $filter) {
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
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage($filter: ModelSubscriptionMessageFilterInput) {
    onUpdateMessage(filter: $filter) {
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
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage($filter: ModelSubscriptionMessageFilterInput) {
    onDeleteMessage(filter: $filter) {
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
export const onCreateSummary = /* GraphQL */ `
  subscription OnCreateSummary($filter: ModelSubscriptionSummaryFilterInput) {
    onCreateSummary(filter: $filter) {
      language
      NumberofMessagesProcessed
      NumberofWordsProcssed
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateSummary = /* GraphQL */ `
  subscription OnUpdateSummary($filter: ModelSubscriptionSummaryFilterInput) {
    onUpdateSummary(filter: $filter) {
      language
      NumberofMessagesProcessed
      NumberofWordsProcssed
    }
  }
`;
export const onDeleteSummary = /* GraphQL */ `
  subscription OnDeleteSummary($filter: ModelSubscriptionSummaryFilterInput) {
    onDeleteSummary(filter: $filter) {
      language
      NumberofMessagesProcessed
      NumberofWordsProcssed
      createdAt
      updatedAt
    }
  }
`;
export const onCreateWordcloud = /* GraphQL */ `
  subscription OnCreateWordcloud(
    $filter: ModelSubscriptionWordcloudFilterInput
  ) {
    onCreateWordcloud(filter: $filter) {
      timestamp
      words
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateWordcloud = /* GraphQL */ `
  subscription OnUpdateWordcloud(
    $filter: ModelSubscriptionWordcloudFilterInput
  ) {
    onUpdateWordcloud(filter: $filter) {
      timestamp
      words
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteWordcloud = /* GraphQL */ `
  subscription OnDeleteWordcloud(
    $filter: ModelSubscriptionWordcloudFilterInput
  ) {
    onDeleteWordcloud(filter: $filter) {
      timestamp
      words
      createdAt
      updatedAt
    }
  }
`;
