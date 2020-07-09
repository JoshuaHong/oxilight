'use strict';

const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});

    let responseBody = "";
    let statusCode = 0;

    const {organizationid} = event.pathParameters;

    const params = {
        TableName: "Organization",
        Key: {
            organizationid: organizationid
        }
    };

    try {
        await documentClient.delete(params).promise();
        responseBody = "Successfully deleted organization " + organizationid;
        statusCode = 200;
    } catch (err) {
        responseBody = "ERROR: Unable to delete organization data: " + err;
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "deleteOrganizationData"
        },
        body: responseBody
    };

    return response;
};
