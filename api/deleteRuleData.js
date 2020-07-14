'use strict';

const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});

    let responseBody = "";
    let statusCode = 0;

    const {sensorid, ruleid} = event.pathParameters;

    const params = {
        TableName: "Rule",
        Key: {
            sensorid: sensorid,
            ruleid: ruleid
        }
    };

    try {
        await documentClient.delete(params).promise();
        responseBody = "Successfully deleted ruleid " + sensorid + ":" + ruleid;
        statusCode = 200;
    } catch (err) {
        responseBody = "ERROR: Unable to delete ruleid data: " + err;
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "deleteMeasurementData",
            "Access-Control-Allow-Origin": "*"
        },
        body: responseBody
    };

    return response;
};
