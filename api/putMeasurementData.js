'use strict';

const AWS = require("aws-sdk");

AWS.config.update({region: "us-east-2"});

exports.handler = async (event, context) => {
    const ddb = new AWS.DynamoDB({region: "us-east-2"});
    const ddbGeo = require('dynamodb-geo');
    const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'Geo');
    config.hashKeyLength = 6;
    const myGeoTableManager = new ddbGeo.GeoDataManager(config);
    
    let responseBody = "";
    let statusCode = 0;
    
    let {sensorid, datetime, unitid, hr, rr, temp, so2, bps, bpd, motiontype, long, lat} = JSON.parse(event.body);
    if (hr == null) {
        hr = "";
    }
    if (rr == null) {
        rr = "";
    }
    if (temp == null) {
        temp = "";
    }
    if (so2 == null) {
        so2 = "";
    }
    if (bps == null) {
        bps = "";
    }
    if (bpd == null) {
        bpd = "";
    }
    if (motiontype == null) {
        motiontype = "";
    }
    if (long == null) {
        long = "0";
    }
    if (lat == null) {
        lat = "0";
    }

   const measurementParams = {
        TableName: "Measurement",
        Item: {
            sensorid: {S: sensorid},
            datetime: {S: datetime},
            unitid: {S: unitid},
            hr: {S: hr},
            rr: {S: rr},
            temp: {S: temp},
            so2: {S: so2},
            bps: {S: bps},
            bpd: {S: bpd},
            motiontype: {S: motiontype},
            long: {S: long},
            lat: {S: lat}
        }
    };


    const geoParams = {
        RangeKeyValue: { S: datetime },
        GeoPoint: {
            latitude: lat,
            longitude: long
        },
        PutItemInput: {
            Item: {
                point: { S: sensorid + datetime },
                hr: { S: hr },
                rr: { S: rr },
                temp: { S: temp },
                so2: { S: so2 },
                bps: { S: bps },
                bpd: { S: bpd },
                motiontype: { S: motiontype }
            }
        }
    };

    
    try {
        await ddb.putItem(measurementParams).promise();
        await myGeoTableManager.putPoint(geoParams).promise();
        responseBody = "Successfully added measurement " + sensorid + ":" + datetime;
        statusCode = 201;
    } catch (err) {
        responseBody = "ERROR: Unable to put measurement data: " + err;
        statusCode = 403;
    }
    
    const response = {
        statusCode: statusCode,
        headers: {
            "myHeader": "putMeasurementData"
        },
        body: responseBody
    };
    
    return response;
}; 
