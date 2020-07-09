'use strict';

const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});

    let responseBody = "";
    let statusCode = 0;

    const {sensorid, datetime} = event.pathParameters;

    const measurementParams = {
        TableName: "Measurement",
        Key: {
            sensorid: sensorid,
            datetime: datetime
        }
    };
    
    const geoParams = {
        TableName: "Geo",
        Key: {
            point: sensorid + datetime
        }
    };

    try {
        await documentClient.delete(measurementParams).promise();
        await documentClient.delete(geoParams).promise();
        responseBody = "Successfully deleted measurement " + sensorid + ":" + datetime;
        statusCode = 200;
    } catch (err) {
        responseBody = "ERROR: Unable to delete measurement data: " + err;
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "deleteMeasurementData"
        },
        body: responseBody
    };

    return response;
};
