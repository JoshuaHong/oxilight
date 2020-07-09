'use strict';

const AWS = require("aws-sdk");

AWS.config.update({region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});
    
    let responseBody = "";
    let statusCode = 0;
    
    const {sensorid, unitid, isactive, datetimeregistered, datetimeactivated, datetimedisabled} = JSON.parse(event.body);
    
    const params = {
        TableName: "Sensor",
        Item: {
            sensorid: sensorid,
            unitid: unitid,
            isactive: isactive,
            datetimeregistered: datetimeregistered,
            datetimeactivated: datetimeactivated,
            datetimedisabled: datetimedisabled
        }
    };
    
    try {
        await documentClient.put(params).promise();
        responseBody = "Successfully added sensor " + sensorid;
        statusCode = 201;
    } catch (err) {
        responseBody = "ERROR: Unable to put sensor data: " + err;
        statusCode = 403;
    }
    
    const esponse = {
        statusCode: statusCode,
        headers: {
            "myHeader": "putSensorData"
        },
        body: responseBody
    };
    
    return response;
};
