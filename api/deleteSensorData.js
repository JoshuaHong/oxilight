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
        await documentClient.delete(params).promise();
        responseBody = "Successfully deleted sensor " + sensorid;
        statusCode = 200;
    } catch (err) {
        responseBody = "ERROR: Unable to delete sensor data: " + err;
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "deleteSensorData"
        },
        body: responseBody
    };

    return response;
};
