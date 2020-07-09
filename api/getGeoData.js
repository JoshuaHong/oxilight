'use strict';

const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});

    let responseBody = "";
    let statusCode = 0;

    const {point} = event.pathParameters;

    const params = {
        TableName: "Geo",
        Key: {
            point: point
        }
    };

    try {
        const items = await documentClient.get(params).promise();
        responseBody = JSON.stringify(items.Item, (key, value) =>
            typeof value == 'bigint' ? value.toString() : value
        );
        statusCode = 200;
    } catch (err) {
        responseBody = "ERROR: Unable to get geo data: " + err;
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "getGeoData",
            "Access-Control-Allow-Origin": "*"
        },
        body: responseBody
    };

    return response;
};
