'use strict';

const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});

    let responseBody = "";
    let statusCode = 0;

    const {userid} = event.pathParameters;

    const params = {
        TableName: "User",
        Key: {
            userid: userid
        }
    };

    try {
        await documentClient.delete(params).promise();
        responseBody= "Successfully deleted user " + userid;
        statusCode = 200;
    } catch (err) {
        responseBody = "ERROR: Unable to delete user data: " + err;
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "deleteUserDat"
        },
        body: responseBody
    };

    return response;
}; 
