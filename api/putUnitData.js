'use strict';

const AWS = require("aws-sdk");

AWS.config.update({region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});
    
    let responseBody = "";
    let statusCode = 0;
    
    const {unitid, facilityid, unitname, datetimesigned} = JSON.parse(event.body);
    
    const params = {
        TableName: "Unit",
        Item: {
            unitid: unitid,
            facilityid: facilityid,
            unitname: unitname,
            datetimesigned: datetimesigned
        }
    };
    
    try {
        await documentClient.put(params).promise();
        responseBody = "Successfully added unit " + unitid;
        statusCode = 201;
    } catch (err) {
        responseBody = "ERROR: Unable to put unit data: " + err;
        statusCode = 403;
    }
    
    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "putUnitData"
        },
        body: responseBody
    };
   
    return response;
}; 
