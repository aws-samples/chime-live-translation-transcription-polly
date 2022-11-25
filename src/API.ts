/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateMessageInput = {
  speaker: string,
  createdAt?: string | null,
  meetingId: string,
  message?: string | null,
  user?: string | null,
  language?: string | null,
  direction?: string | null,
};

export type ModelMessageConditionInput = {
  speaker?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  meetingId?: ModelStringInput | null,
  message?: ModelStringInput | null,
  user?: ModelStringInput | null,
  language?: ModelStringInput | null,
  direction?: ModelStringInput | null,
  and?: Array< ModelMessageConditionInput | null > | null,
  or?: Array< ModelMessageConditionInput | null > | null,
  not?: ModelMessageConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type message = {
  __typename: "message",
  speaker: string,
  createdAt: string,
  meetingId: string,
  message?: string | null,
  user?: string | null,
  language?: string | null,
  direction?: string | null,
  updatedAt: string,
};

export type UpdateMessageInput = {
  speaker: string,
  createdAt: string,
  meetingId?: string | null,
  message?: string | null,
  user?: string | null,
  language?: string | null,
  direction?: string | null,
};

export type DeleteMessageInput = {
  speaker: string,
  createdAt: string,
};

export type CreateSummaryInput = {
  language: string,
  NumberofMessagesProcessed?: number | null,
  NumberofWordsProcssed?: number | null,
};

export type ModelSummaryConditionInput = {
  language?: ModelStringInput | null,
  NumberofMessagesProcessed?: ModelIntInput | null,
  NumberofWordsProcssed?: ModelIntInput | null,
  and?: Array< ModelSummaryConditionInput | null > | null,
  or?: Array< ModelSummaryConditionInput | null > | null,
  not?: ModelSummaryConditionInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type summary = {
  __typename: "summary",
  language: string,
  NumberofMessagesProcessed?: number | null,
  NumberofWordsProcssed?: number | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateSummaryInput = {
  language: string,
  NumberofMessagesProcessed?: number | null,
  NumberofWordsProcssed?: number | null,
};

export type DeleteSummaryInput = {
  language: string,
};

export type CreateWordcloudInput = {
  timestamp: string,
  words?: string | null,
};

export type ModelWordcloudConditionInput = {
  timestamp?: ModelStringInput | null,
  words?: ModelStringInput | null,
  and?: Array< ModelWordcloudConditionInput | null > | null,
  or?: Array< ModelWordcloudConditionInput | null > | null,
  not?: ModelWordcloudConditionInput | null,
};

export type wordcloud = {
  __typename: "wordcloud",
  timestamp: string,
  words?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateWordcloudInput = {
  timestamp: string,
  words?: string | null,
};

export type DeleteWordcloudInput = {
  timestamp: string,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelMessageFilterInput = {
  speaker?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  meetingId?: ModelStringInput | null,
  message?: ModelStringInput | null,
  user?: ModelStringInput | null,
  language?: ModelStringInput | null,
  direction?: ModelStringInput | null,
  and?: Array< ModelMessageFilterInput | null > | null,
  or?: Array< ModelMessageFilterInput | null > | null,
  not?: ModelMessageFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelMessageConnection = {
  __typename: "ModelMessageConnection",
  items:  Array<message | null >,
  nextToken?: string | null,
};

export type ModelSummaryFilterInput = {
  language?: ModelStringInput | null,
  NumberofMessagesProcessed?: ModelIntInput | null,
  NumberofWordsProcssed?: ModelIntInput | null,
  and?: Array< ModelSummaryFilterInput | null > | null,
  or?: Array< ModelSummaryFilterInput | null > | null,
  not?: ModelSummaryFilterInput | null,
};

export type ModelSummaryConnection = {
  __typename: "ModelSummaryConnection",
  items:  Array<summary | null >,
  nextToken?: string | null,
};

export type ModelWordcloudFilterInput = {
  timestamp?: ModelStringInput | null,
  words?: ModelStringInput | null,
  and?: Array< ModelWordcloudFilterInput | null > | null,
  or?: Array< ModelWordcloudFilterInput | null > | null,
  not?: ModelWordcloudFilterInput | null,
};

export type ModelWordcloudConnection = {
  __typename: "ModelWordcloudConnection",
  items:  Array<wordcloud | null >,
  nextToken?: string | null,
};

export type ModelmessageFilterInput = {
  speaker?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  meetingId?: ModelStringInput | null,
  message?: ModelStringInput | null,
  user?: ModelStringInput | null,
  language?: ModelStringInput | null,
  direction?: ModelStringInput | null,
  and?: Array< ModelmessageFilterInput | null > | null,
  or?: Array< ModelmessageFilterInput | null > | null,
  not?: ModelmessageFilterInput | null,
};

export type ModelmessageConnection = {
  __typename: "ModelmessageConnection",
  items:  Array<message | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionMessageFilterInput = {
  speaker?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  meetingId?: ModelSubscriptionStringInput | null,
  message?: ModelSubscriptionStringInput | null,
  user?: ModelSubscriptionStringInput | null,
  language?: ModelSubscriptionStringInput | null,
  direction?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMessageFilterInput | null > | null,
  or?: Array< ModelSubscriptionMessageFilterInput | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionSummaryFilterInput = {
  language?: ModelSubscriptionStringInput | null,
  NumberofMessagesProcessed?: ModelSubscriptionIntInput | null,
  NumberofWordsProcssed?: ModelSubscriptionIntInput | null,
  and?: Array< ModelSubscriptionSummaryFilterInput | null > | null,
  or?: Array< ModelSubscriptionSummaryFilterInput | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionWordcloudFilterInput = {
  timestamp?: ModelSubscriptionStringInput | null,
  words?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionWordcloudFilterInput | null > | null,
  or?: Array< ModelSubscriptionWordcloudFilterInput | null > | null,
};

export type CreateMessageMutationVariables = {
  input: CreateMessageInput,
  condition?: ModelMessageConditionInput | null,
};

export type CreateMessageMutation = {
  createMessage?:  {
    __typename: "message",
    speaker: string,
    createdAt: string,
    meetingId: string,
    message?: string | null,
    user?: string | null,
    language?: string | null,
    direction?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateMessageMutationVariables = {
  input: UpdateMessageInput,
  condition?: ModelMessageConditionInput | null,
};

export type UpdateMessageMutation = {
  updateMessage?:  {
    __typename: "message",
    speaker: string,
    createdAt: string,
    meetingId: string,
    message?: string | null,
    user?: string | null,
    language?: string | null,
    direction?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteMessageMutationVariables = {
  input: DeleteMessageInput,
  condition?: ModelMessageConditionInput | null,
};

export type DeleteMessageMutation = {
  deleteMessage?:  {
    __typename: "message",
    speaker: string,
    createdAt: string,
    meetingId: string,
    message?: string | null,
    user?: string | null,
    language?: string | null,
    direction?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateSummaryMutationVariables = {
  input: CreateSummaryInput,
  condition?: ModelSummaryConditionInput | null,
};

export type CreateSummaryMutation = {
  createSummary?:  {
    __typename: "summary",
    language: string,
    NumberofMessagesProcessed?: number | null,
    NumberofWordsProcssed?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateSummaryMutationVariables = {
  input: UpdateSummaryInput,
  condition?: ModelSummaryConditionInput | null,
};

export type UpdateSummaryMutation = {
  updateSummary?:  {
    __typename: "summary",
    language: string,
    NumberofMessagesProcessed?: number | null,
    NumberofWordsProcssed?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteSummaryMutationVariables = {
  input: DeleteSummaryInput,
  condition?: ModelSummaryConditionInput | null,
};

export type DeleteSummaryMutation = {
  deleteSummary?:  {
    __typename: "summary",
    language: string,
    NumberofMessagesProcessed?: number | null,
    NumberofWordsProcssed?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateWordcloudMutationVariables = {
  input: CreateWordcloudInput,
  condition?: ModelWordcloudConditionInput | null,
};

export type CreateWordcloudMutation = {
  createWordcloud?:  {
    __typename: "wordcloud",
    timestamp: string,
    words?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateWordcloudMutationVariables = {
  input: UpdateWordcloudInput,
  condition?: ModelWordcloudConditionInput | null,
};

export type UpdateWordcloudMutation = {
  updateWordcloud?:  {
    __typename: "wordcloud",
    timestamp: string,
    words?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteWordcloudMutationVariables = {
  input: DeleteWordcloudInput,
  condition?: ModelWordcloudConditionInput | null,
};

export type DeleteWordcloudMutation = {
  deleteWordcloud?:  {
    __typename: "wordcloud",
    timestamp: string,
    words?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetMessageQueryVariables = {
  speaker: string,
  createdAt: string,
};

export type GetMessageQuery = {
  getMessage?:  {
    __typename: "message",
    speaker: string,
    createdAt: string,
    meetingId: string,
    message?: string | null,
    user?: string | null,
    language?: string | null,
    direction?: string | null,
    updatedAt: string,
  } | null,
};

export type ListMessagesQueryVariables = {
  speaker?: string | null,
  createdAt?: ModelStringKeyConditionInput | null,
  filter?: ModelMessageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListMessagesQuery = {
  listMessages?:  {
    __typename: "ModelMessageConnection",
    items:  Array< {
      __typename: "message",
      speaker: string,
      createdAt: string,
      meetingId: string,
      message?: string | null,
      user?: string | null,
      language?: string | null,
      direction?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetSummaryQueryVariables = {
  language: string,
};

export type GetSummaryQuery = {
  getSummary?:  {
    __typename: "summary",
    language: string,
    NumberofMessagesProcessed?: number | null,
    NumberofWordsProcssed?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListSummariesQueryVariables = {
  language?: string | null,
  filter?: ModelSummaryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListSummariesQuery = {
  listSummaries?:  {
    __typename: "ModelSummaryConnection",
    items:  Array< {
      __typename: "summary",
      language: string,
      NumberofMessagesProcessed?: number | null,
      NumberofWordsProcssed?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetWordcloudQueryVariables = {
  timestamp: string,
};

export type GetWordcloudQuery = {
  getWordcloud?:  {
    __typename: "wordcloud",
    timestamp: string,
    words?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListWordcloudsQueryVariables = {
  timestamp?: string | null,
  filter?: ModelWordcloudFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListWordcloudsQuery = {
  listWordclouds?:  {
    __typename: "ModelWordcloudConnection",
    items:  Array< {
      __typename: "wordcloud",
      timestamp: string,
      words?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MessagesByMeetingIdQueryVariables = {
  meetingId: string,
  speaker?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelmessageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MessagesByMeetingIdQuery = {
  messagesByMeetingId?:  {
    __typename: "ModelmessageConnection",
    items:  Array< {
      __typename: "message",
      speaker: string,
      createdAt: string,
      meetingId: string,
      message?: string | null,
      user?: string | null,
      language?: string | null,
      direction?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null,
};

export type OnCreateMessageSubscription = {
  onCreateMessage?:  {
    __typename: "message",
    speaker: string,
    createdAt: string,
    meetingId: string,
    message?: string | null,
    user?: string | null,
    language?: string | null,
    direction?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null,
};

export type OnUpdateMessageSubscription = {
  onUpdateMessage?:  {
    __typename: "message",
    speaker: string,
    createdAt: string,
    meetingId: string,
    message?: string | null,
    user?: string | null,
    language?: string | null,
    direction?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null,
};

export type OnDeleteMessageSubscription = {
  onDeleteMessage?:  {
    __typename: "message",
    speaker: string,
    createdAt: string,
    meetingId: string,
    message?: string | null,
    user?: string | null,
    language?: string | null,
    direction?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateSummarySubscriptionVariables = {
  filter?: ModelSubscriptionSummaryFilterInput | null,
};

export type OnCreateSummarySubscription = {
  onCreateSummary?:  {
    __typename: "summary",
    language: string,
    NumberofMessagesProcessed?: number | null,
    NumberofWordsProcssed?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateSummarySubscriptionVariables = {
  filter?: ModelSubscriptionSummaryFilterInput | null,
};

export type OnUpdateSummarySubscription = {
  onUpdateSummary?:  {
    __typename: "summary",
    language: string,
    NumberofMessagesProcessed?: number | null,
    NumberofWordsProcssed?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteSummarySubscriptionVariables = {
  filter?: ModelSubscriptionSummaryFilterInput | null,
};

export type OnDeleteSummarySubscription = {
  onDeleteSummary?:  {
    __typename: "summary",
    language: string,
    NumberofMessagesProcessed?: number | null,
    NumberofWordsProcssed?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateWordcloudSubscriptionVariables = {
  filter?: ModelSubscriptionWordcloudFilterInput | null,
};

export type OnCreateWordcloudSubscription = {
  onCreateWordcloud?:  {
    __typename: "wordcloud",
    timestamp: string,
    words?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateWordcloudSubscriptionVariables = {
  filter?: ModelSubscriptionWordcloudFilterInput | null,
};

export type OnUpdateWordcloudSubscription = {
  onUpdateWordcloud?:  {
    __typename: "wordcloud",
    timestamp: string,
    words?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteWordcloudSubscriptionVariables = {
  filter?: ModelSubscriptionWordcloudFilterInput | null,
};

export type OnDeleteWordcloudSubscription = {
  onDeleteWordcloud?:  {
    __typename: "wordcloud",
    timestamp: string,
    words?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
