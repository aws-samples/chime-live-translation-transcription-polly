/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMessage = /* GraphQL */ `
  query GetMessage($speaker: String!, $createdAt: String!) {
    getMessage(speaker: $speaker, createdAt: $createdAt) {
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
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $speaker: String
    $createdAt: ModelStringKeyConditionInput
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listMessages(
      speaker: $speaker
      createdAt: $createdAt
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        speaker
        createdAt
        meetingId
        message
        user
        language
        direction
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSummary = /* GraphQL */ `
  query GetSummary($language: String!) {
    getSummary(language: $language) {
      language
      NumberofMessagesProcessed
      NumberofWordsProcssed
      createdAt
      updatedAt
    }
  }
`;
export const listSummaries = /* GraphQL */ `
  query ListSummaries(
    $language: String
    $filter: ModelSummaryFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listSummaries(
      language: $language
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        language
        NumberofMessagesProcessed
        NumberofWordsProcssed
      }
      nextToken
    }
  }
`;
export const getWordcloud = /* GraphQL */ `
  query GetWordcloud($timestamp: String!) {
    getWordcloud(timestamp: $timestamp) {
      timestamp
      words
      createdAt
      updatedAt
    }
  }
`;
export const listWordclouds = /* GraphQL */ `
  query ListWordclouds(
    $timestamp: String
    $filter: ModelWordcloudFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listWordclouds(
      timestamp: $timestamp
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        timestamp
        words
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const messagesByMeetingId = /* GraphQL */ `
  query MessagesByMeetingId(
    $meetingId: String!
    $speaker: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelmessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesByMeetingId(
      meetingId: $meetingId
      speaker: $speaker
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        speaker
        createdAt
        meetingId
        message
        user
        language
        direction
        updatedAt
      }
      nextToken
    }
  }
`;
