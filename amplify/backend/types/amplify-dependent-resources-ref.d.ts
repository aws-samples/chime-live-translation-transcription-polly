export type AmplifyDependentResourcesAttributes = {
    "function": {
        "createMeeting": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "endMeeting": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "transcribeMeeting": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "biz307amplify91213d97": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "api": {
        "meetingApi": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        },
        "biz307amplify": {
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "auth": {
        "biz307amplify5b0bba085b0bba08": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "predictions": {
        "translateText112eae37": {
            "region": "string",
            "sourceLang": "string",
            "targetLang": "string"
        },
        "transcriptionebce4954": {
            "region": "string",
            "language": "string"
        },
        "speechGenerator66b08538": {
            "region": "string",
            "language": "string",
            "voice": "string"
        }
    }
}