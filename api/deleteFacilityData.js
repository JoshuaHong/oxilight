'use strict';

const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});

    let responseBody = "";
    let statusCode = 0;

    const {facilityid} = event.pathParameters;

    const params = {
        TableName: "Facility",
        Key: {
            facilityid: facilityid
        }
    };

    try {
        await documentClient.delete(params).promise();
        responseBody = "Successfully deleted facility " + facilityid;
        statusCode = 200;
    } catch (err) {
        responseBody = "ERROR: Unable to delete facility data: " + err;
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "deleteFacilityData"
        },
        body: responseBody
    };

    return response;
};
