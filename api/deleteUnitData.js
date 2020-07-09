'use strict';

const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});

    let responseBody = "";
    let statusCode = 0;

    const {unitid} = event.pathParameters;

    const params = {
        TableName: "Unit",
        Key: {
            unitid: unitid
        }
    };

    try {
        await documentClient.delete(params).promise();
        responseBody = "Successfully deleted unit " + unitid;
        statusCode = 200;
    } catch (err) {
        responseBody = "ERROR: Unable to delete unit data: " + err;
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headrs: {
            "myHeader": "deleteUnitData"
        },
        body: responseBody
    };

    return response;
};
