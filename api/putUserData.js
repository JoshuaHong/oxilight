'use strict';

const AWS = require("aws-sdk");

AWS.config.update({region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});
    
    let responseBody = "";
    let statusCode = 0;
    
    const {userid, unitid, name, datetimesigned, subscriptionlevel} = JSON.parse(event.body);
    
    const params = {
        TableName: "User",
        Item: {
            userid: userid,
            unitid: unitid,
            name: name,
            datetimesigned: datetimesigned,
            subscriptionlevel: subscriptionlevel
        }
    };
    
    try {
        await documentClient.put(params).promise();
        responseBody = "Successfully added user " + userid;
        statusCode = 201;
    } catch (err) {
        responseBody = "ERROR: Unable to put user data: " + err;
        statusCode = 403;
    }
    
    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "putUserData"
        },
        body: responseBody
    };
    
    return response;
};
