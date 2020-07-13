# Oxilight Inc. API
![](https://d1p9wirkq0k00v.cloudfront.net/wp-content/uploads/2017/11/28074553/oxilight.png)

The API designed for sending and retrieving Oxilight data.

### Introduction
This API uses Amazon Web Services for data storage. Data is managed using the Dynamo database, logic is created using Lambda functions, and data manipulation is performed using API Gateway. This guide showcases how to interact with the API in order to access the serverless data.

### Overview
The data is designed as follows:
1. organization: This table contains information about the organization:
    * organizationid [primary key] (string): The organization's unique identification
    * organizationname (string): The organization's name
    * datetimesigned (string): The date and time the organization signed
    * adminemail (string): The email address of the administrator
<br />

2. facility: This table contains information about the facility:
    * facilityid [primary key] (string): The facility's unique identification
    * organizationid [secondary key] (string): The organization associated to the facility
    * facilityname (string): The name of the facility
    * datetimesigned (string): The date and time the facility signed
    * addresss (string): The address of the facility
<br />

3. unit: This table contains information about the unit:
    * unitid [primary key] (string): The unit's unique identification
    * facilityid [secondary key] (string): The facility associated to the unit
    * datetimesigned (string): The date and time the unit signed
<br />

4. user: This table contains information about the end user:
    * userid [primary key] (string): The user's unique identification
    * unitid [secondary key] (string): The unit associated to the user
    * name (string): The name of the user
    * datetimesigned (string): The date and time the user signed
    * subscriptionlevel (string): The user's subscription level
    * email (string): The email address of the user
<br />

5. sensor: This table contains information about the sensor:
    * sensorid [primary key] (string): The sensor's unique identification
    * unitid [secondary key] (string): The unit associated to the sensor
    * isactive (string): The sensor's current activity status
    * datetimeregistered (string): The date and time the sensor registered
    * datetimeactivated (string): The date and time the sensor activated
    * datetimedisabled (string): The date and time the sensor disabled
<br />

6. measurement: This table contains information about the measurements:
    * sensorid [primary key] (string): The sensor associated to the measurement
    * datetime [sort key] (string): The date and time of the measurement
    * unitid [secondary key] (string): The unit associated to the measurement
    * hr (string): The heart rate
    * rr (string): The resting rate
    * temp (string): The temperature
    * so2 (string): The so2
    * bps (string): The systolic blood pressure
    * bpd (string): The diastolic blood pressure
    * motion type (string): The motion type
    * long (string): The longitude
    * lat (string): The latitude
<br />

7. geo: This table contains information about the measurement's geology:
    * point [primary key] (string): The sensorid + datetime of the measurement
    * hashkey (string): The hashkey of the point
    * rangekey (string): The range key of the point
    * geohash (string): The geohash of the point
    * geojson (string): The geojson of the point
    * hr (string): The heart rate
    * rr (string): The resting rate
    * temp (string): The temperature
    * so2 (string): The so2
    * bps (string): The systolic blood pressure
    * bpd (string): The diastolic blood pressure
    * motiontype (string): The motion type

### Usage
Webpage: https://dev.d25spmiy8cngtd.amplifyapp.com
Invoke URL:  https://px6psk37hg.execute-api.us-east-2.amazonaws.com/prod
##### GET
Retrieves data associated to a given table, primary or secondary key and id, and/or sort key and id (if applicable):
```
curl -X GET {invokeURL}/{table}/{key}/{keyid}/{sortkey}/{sortkeyid}
```
##### SCAN
Retrieves all data associated to a given table:
```
curl -X GET {invokeURL}/{table}
```
##### DELETE
Deletes data associated to a given table, primary or secondary key and id, and sort key and id (if applicable):
```
curl -X DELETE {invokeURL}/{table}/{key}/{keyid}/{sortkey}/{sortkeyid}
```
##### POST
Adds data to a given table:
```
curl --header "Content-Type: application/json" \
     --request POST \
     --data '{"key": "value"}' \
     {invokeURL}/{table}
```

##### Examples
1. Create a new user in the table "user" with userid "1", unitid "1", name "test", datetimesigned "null", subscriptionlevel "null", email "null":
    ```
    curl --header "Content-Type: application/json" \
         --request POST \
         --data '{"userid": "1", "unitid": "1", "name": "test", "datetimesigned": "null", "subscriptionlevel": "null", "email": "null"}' \
         https://px6psk37hg.execute-api.us-east-2.amazonaws.com/prod/user
    ```
2. Get information of a user in the table "user" with userid "1":
    ```
    curl -X GET https://px6psk37hg.execute-api.us-east-2.amazonaws.com/prod/user/userid/1
    ```
3. Get information of a measurement in the table "measurement" with sensorid "1", datetime "Now":
    ```
    curl -X GET https://px6psk37hg.execute-api.us-east-2.amazonaws.com/prod/measurement/sensorid/1/datetime/Now
    ```
4. Query all measurements in the table "measurement" with userid "1":
    ```
    curl -X GET https://px6psk37hg.execute-api.us-east-2.amazonaws.com/prod/measurement/userid/1
    ```

### Notes
* Creating a POST request using an already created unique identification key will override the previous data for that key
* Primary key and sort key (if applicable) is required when posting data. The rest are optional entries
* A geo point is automatically created or deleted upon measurement insertion or deletion respectively
* The overview data formats and descriptions are not final and are subject to change

### Credits
For more information please contact Joshua Hong.
