'use strict';

const AWS = require("aws-sdk");

AWS.config.update({region: "us-east-2"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-2"});
    
    let responseBody = "";
    let statusCode = 0;
    
    const {facilityid, organizationid, facilityname, datetimesigned, address} = JSON.parse(event.body);
    
    const params = {
        TableName: "Facility",
        Item: {
            facilityid: facilityid,
            organizationid: organizationid,
            facilityname: facilityname,
            datetimesigned: datetimesigned,
            address: address
        }
    };
    
    try {
        await documentClient.put(params).promise();
        responseBody = "Successfully added facility " + facilityid;
        statusCode = 201;
    } catch (err) {
        responseBody = "ERROR: Unable to put facility data: " + err;
        statusCode = 403;
    }
    
    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "putFacilityData"
        },
        body: responseBody
    };
    
    return response;
};
