'use strict';

const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});

    let responseBody = "";
    let statusCode = 0;

    const {sensorid} = event.pathParameters;

    const params = {
        TableName: "Rule",
        KeyConditionExpression: 'sensorid = :sensorid',
        ExpressionAttributeValues: { ':sensorid': sensorid}
    };

    try {
        const data = await documentClient.query(params).promise();
        responseBody = JSON.stringify(data.Items);
        statusCode = 200;
    } catch (err) {
        responseBody = "ERROR: Unable to query rule data by sensor id: " + err;
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "queryRuleDataBySensorId",
            "Access-Control-Allow-Origin": "*"
        },
        body: responseBody
    };

    return response;
};
