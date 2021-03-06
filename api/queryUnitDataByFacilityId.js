'use strict';

const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});

    let responseBody = "";
    let statusCode = 0;

    const {facilityid} = event.pathParameters;

    const params = {
        TableName: "Unit",
        IndexName: "facilityid-unit",
        KeyConditionExpression: 'facilityid = :facilityid',
        ExpressionAttributeValues: { ':facilityid': facilityid}
    };

    try {
        const data = await documentClient.query(params).promise();
        responseBody = JSON.stringify(data.Items);
        statusCode = 200;
    } catch (err) {
        responseBody = "ERROR: Unable to query unit data by facility id: " + err;
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "queryUnitDataByFacilityId",
            "Access-Control-Allow-Origin": "*"
        },
        body: responseBody
    };

    return response;
};
