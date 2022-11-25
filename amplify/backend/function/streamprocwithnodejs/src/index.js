/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

'use strict';
const AWS = require('aws-sdk');
const dynamodbClient = new AWS.DynamoDB.DocumentClient();

const promises = []

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
 exports.handler = event => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  event.Records.forEach( record => {

    var message = record.dynamodb.NewImage.message.S;
    var language = record.dynamodb.NewImage.language.S;
    var updatedAt = new Date(Date.parse(record.dynamodb.NewImage.updatedAt.S));
    var timeStamp = updatedAt.getTime();

    var words = message.split(' ');
    let numberOfWords = words.length;
    
    var params = {
      TableName: 'MessagesProcessedSummary',
      Key: {
        language : language
      },
      UpdateExpression: 'Add NumberofMessagesProcessed :x,  NumberofWordsProcssed  :s  ',
      ExpressionAttributeValues: {
        ':x' : 1,
        ':s' : numberOfWords
      }
    };
    
    let promise = dynamodbClient.update(params).promise();
     //TODO : appsync none resolver mutation call to notify the dashboard 
    promises.push(promise);
    
    var wordCloudWords = words.filter((n) => n.length >= 5)
    if (wordCloudWords.length>1) {
      var wordCloudParams = {
      TableName: 'WordCloud',
      Item: {
                 timestamp : timeStamp,
                 words : wordCloudWords.toString()
            }
    };
    
    let promise1 = dynamodbClient.put(wordCloudParams).promise();
    //TODO : appsync none resolver mutation call to notify the dashboard 
    promises.push(promise1);
    }
    
    
    
  });

  return Promise.all([...promises])
  .then(Promise.resolve('Successfully processed DynamoDB record'));

};

