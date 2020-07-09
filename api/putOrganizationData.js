'use strict';

const AWS = require("aws-sdk");

AWS.config.update({region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});
    
    let responseBody = "";
    let statusCode = 0;
    
    const {organizationid, organizationname, datetimesigned, adminemail} = JSON.parse(event.body);
    
    const params = {
        TableName: "Organization",
        Item: {
            organizationid: organizationid,
            organizationname: organizationname,
            datetimesigned: datetimesigned,
            adminemail: adminemail
        }
    };
    
    try {
        await documentClient.put(params).promise();
        responseBody = "Successfully added organization " + organizationid;
        statusCode = 201;
    } catch (err) {
        responseBody = "ERROR: Unable to put user data: " + err;
        statusCode = 403;
    }
    
    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "putOrganizationData"
        },
        body: responseBody
    };
    
    return response;
};
