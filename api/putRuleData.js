'use strict';

const AWS = require("aws-sdk");

AWS.config.update({region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});
    
    let responseBody = "";
    let statusCode = 0;
    
    const {sensorid, ruleid, unitid, title, condition, code, notifee, datetimecreated} = JSON.parse(event.body);
    
    const params = {
        TableName: "Rule",
        Item: {
            sensorid: sensorid,
            ruleid: ruleid,
            unitid: unitid,
            title: title,
            condition: condition,
            code: code,
            notifee: notifee,
            datetimecreated: datetimecreated
        }
    };
    
    try {
        await documentClint.put(params).promise();
        responseBody = "Successfully added rule " + sensorid;
        statusCode = 201;
    } catch (err) {
        responseBody = "ERROR: Unable to put rule data: " + err;
        statusCode = 403;
    }
    
    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "putRuleData",
            "Access-Control-Allow-Origin": "*"
        },
        body: responseBody
    };
    
    return response;
};
