'use strict';

const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});

    let responseBody = "";
    let statusCode = 0;

    const {sensorid} = event.pathParameters;

    const params = {
        TableName: "Sensor",
        Key: {
            sensorid: sensorid
        }
    };

    try {
        const data = await documentClient.get(params).promise();
        responseBody = JSON.stringify(data.Item);
        statusCode = 200;
    } catch (err) {
        responseBody = "ERROR: Unable to get sensor data: " + err;
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "getSensorData",
            "Access-Control-Allow-Origin": "*"
        },
        body: responseBody
    };

    return response;
};
