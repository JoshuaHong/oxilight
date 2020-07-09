'use strict';

const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});

    let responseBody = "";
    let statusCode = 0;

    const params = {
        TableName: "Organization"
    };

    try {
        const items = await documentClient.scan(params).promise();
        responseBody = JSON.stringify(items.Items);
        statusCode = 200;
    } catch (err) {
        responseBody = "ERROR: Unable to scan organization data: " + err;
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "scanOrganizationData",
            "Access-Control-Allow-Origin": "*"
        },
        body: responseBody
    };

    return response;
};
