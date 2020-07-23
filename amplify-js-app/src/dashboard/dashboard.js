import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

verifySignIn();

window.onload = function() {
    initMenu();
    initHeatmap();
}

async function verifySignIn() {
    try {
        await Auth.currentAuthenticatedUser();
    } catch (error) {
        window.open("index.html", "_self", false);
    }
}

function initMenu() {
    const logoButton = document.getElementById("logo");
    const dashboardButton = document.getElementById("dashboard");
    const helpButton = document.getElementById("help");
    const settingsButton = document.getElementById("settings");
    const generalSettingsButton = document.getElementById("generalSettings");
    const accountSettingsButton = document.getElementById("accountSettings");
    const signOutButton = document.getElementById("signout");

    logoButton.addEventListener("click", toDashboardPage);
    dashboardButton.addEventListener("click", toDashboardPage);
    helpButton.addEventListener("click", help);
    settingsButton.addEventListener("mouseover", showSettings);
    settingsButton.addEventListener("mouseout", hideSettings);
    generalSettingsButton.addEventListener("click", toGeneralSettingsPage);
    accountSettingsButton.addEventListener("click", toAccountSettingsPage);
    signOutButton.addEventListener("click", signOut);

}

function showSettings() {
    const settingsDropdownList = document.getElementById("settingsDropdown");
    settingsDropdownList.style.display = "block";
}

function hideSettings() {
    const settingsDropdownList = document.getElementById("settingsDropdown");
    settingsDropdownList.style.display = "none";
}

function toAuthPage() {
    window.open("index.html", "_self", false);
}

function toDashboardPage() {
    window.open("dashboard.html", "_self", false);
}

function help() {
    console.log("Credits: Joshua Hong");
}

function toAccountSettingsPage() {
    window.open("account.html", "_self", false);
}

function toGeneralSettingsPage() {
    window.open("general.html", "_self", false);
}

async function signOut() {
    const confirmation = confirm("Are you sure you want to sign out?");
    if (confirmation) {
        try {
            await Auth.signOut();
            toAuthPage();
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }
}

async function initHeatmap() {
    const summaryError = document.getElementById("summaryError");
    const user = await Auth.currentAuthenticatedUser();
    const url = "https://px6psk37hg.execute-api.us-east-2.amazonaws.com/prod/";
    const userResponse = await fetch(url + "user/userid/" + user.username);
    let userJSON;

    try {
        userJSON = await userResponse.json();
    } catch (error) {
        const errorMessage = "User " + user.username + " does not exist in the database";
        console.warn(errorMessage);
        summaryError.innerHTML = errorMessage;
        return;
    }

    // Fetch sensors
    const unitId = userJSON.unitid;
    const sensorResponse = await fetch(url + "sensor/unitid/" + unitId);
    const sensorJSON = await sensorResponse.json();
    if (!sensorJSON.length) {
        summaryError.innerHTML = "No sensors associated to user " + user.username;
    }

    const heatmap = document.getElementById("heatmap");
    for (let i = 0; i < sensorJSON.length; ++i) {
        const cell = document.createElement("div");
        const text = document.createTextNode(sensorJSON[i].sensorid);
        cell.id = sensorJSON[i].sensorid;
        cell.addEventListener("click", function() {
            for (let i = 0; i < heatmap.children.length; ++i) {
                heatmap.children[i].classList.remove("active");
            }
            cell.classList.add("active");
            cellClicked(sensorJSON[i]);
        });
        cell.appendChild(text);
        cell.classList.add("cell");
        heatmap.appendChild(cell);
        if (sensorJSON[i].isactive) {
            cell.style.backgroundColor = "green";
        }
        applyRules(cell, sensorJSON[i]);
    }
}

async function applyRules(cell, sensor) {
    // Fetch measurements and rules
    const url = "https://px6psk37hg.execute-api.us-east-2.amazonaws.com/prod/";
    const measurementResponse = await fetch(url + "measurement/sensorid/" + sensor.sensorid);
    const measurementJSON = await measurementResponse.json();
    const ruleResponse = await fetch(url + "rule/sensorid/" + sensor.sensorid);
    const ruleJSON = await ruleResponse.json();

    for (let i = 0; i < ruleJSON.length; ++i) {
        const code = ruleJSON[i].code;
        const condition = ruleJSON[i].condition.split(",");
        const measurement = condition[0];
        const equality = condition[1];
        const value = condition[2];
        for (let j = 0; j < measurementJSON.length; ++j) {
            switch (measurement) {
                case "HR":
                    switch (equality) {
                        case "<":
                            if (!(measurementJSON[j].hr < value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "≤":
                            if (!(measurementJSON[j].hr <= value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case ">":
                            if (!(measurementJSON[j].hr > value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "≥":
                            if (!(measurementJSON[j].hr <= value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "=":
                            if (!( measurementJSON[j].hr == value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                    }
                    break;
                case "RR":
                    switch (equality) {
                        case "<":
                            if (!(measurementJSON[j].rr < value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "≤":
                            if (!(measurementJSON[j].rr <= value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case ">":
                            if (!(measurementJSON[j].rr > value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "≥":
                            if (!(measurementJSON[j].rr <= value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "=":
                            if (!(measurementJSON[j].rr == value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                    }
                    break;
                case "Temp":
                    switch (equality) {
                        case "<":
                            if (!(measurementJSON[j].temp < value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "≤":
                            if (!(measurementJSON[j].temp <= value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case ">":
                            if (!(measurementJSON[j].temp > value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "≥":
                            if (!(measurementJSON[j].temp <= value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "=":
                            if (!(measurementJSON[j].temp == value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                    }
                    break;
                case "SO2":
                    switch (equality) {
                        case "<":
                            if (!(measurementJSON[j].so2 < value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "≤":
                            if (!(measurementJSON[j].so2 <= value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case ">":
                            if (!(measurementJSON[j].so2 > value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "≥":
                            if (!(measurementJSON[j].so2 <= value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "=":
                            if (!(measurementJSON[j].so2 == value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                    }
                    break;
                case "BPS":
                    switch (equality) {
                        case "<":
                            if (!(measurementJSON[j].bps < value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "≤":
                            if (!(measurementJSON[j].bps <= value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case ">":
                            if (!(measurementJSON[j].bps > value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "≥":
                            if (!(measurementJSON[j].bps <= value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "=":
                            if (!(measurementJSON[j].bps == value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                    }
                    break;
                case "BPD":
                    switch (equality) {
                        case "<":
                            if (!(measurementJSON[j].bpd < value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "≤":
                            if (!(measurementJSON[j].bpd <= value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case ">":
                            if (!(measurementJSON[j].bpd > value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "≥":
                            if (!(measurementJSON[j].bpd <= value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "=":
                            if (!(measurementJSON[j].bpd == value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                    }
                    break;
                case "Motion Type":
                    switch (equality) {
                        case "<":
                            if (!(measurementJSON[j].motiontype < value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "≤":
                            if (!(measurementJSON[j].motiontype <= value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case ">":
                            if (!(measurementJSON[j].motiontype > value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "≥":
                            if (!(measurementJSON[j].motiontype <= value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                        case "=":
                            if (!(measurementJSON[j].motiontype == value)) {
                                switch (code) {
                                    case "0":
                                        if (cell.style.backgroundColor != "red") {
                                            cell.style.backgroundColor = "yellow"
                                        }
                                        break;
                                    case "1":
                                        cell.style.backgroundColor = "red"
                                        break;
                                }
                            }
                            break;
                    }
                    break;
            }
        }
    }
}

async function cellClicked(sensor) {
    // Generate sensor summary
    const sensorData = document.getElementById("sensorData");
    const summaryError = document.getElementById("summaryError");
    const charts = document.getElementById("charts");
    const sensorid = document.getElementById("sensorid");
    const unitid = document.getElementById("unitid");
    const isactive = document.getElementById("isactive");
    const datetimeregistered = document.getElementById("datetimeregistered");
    const datetimeactivated = document.getElementById("datetimeactivated");
    const datetimedisabled = document.getElementById("datetimedisabled");
    const ruleData = document.getElementById("ruleData");
    const ruleError = document.getElementById("ruleError");

    sensorData.style.display = "block";
    summaryError.style.display = "none";
    charts.style.display = "block";
    ruleData.style.display = "block";
    ruleError.style.display = "none";
    sensorid.innerHTML = sensor.sensorid;
    unitid.innerHTML = sensor.unitid;
    isactive.innerHTML = sensor.isactive;
    datetimeregistered.innerHTML = sensor.datetimeregistered;
    datetimeactivated.innerHTML = sensor.datetimeactivated;
    datetimedisabled.innerHTML = sensor.datetimedisabled;

    // Fetch measurement data
    const url = "https://px6psk37hg.execute-api.us-east-2.amazonaws.com/prod/";
    const measurementResponse = await fetch(url + "measurement/sensorid/" + sensor.sensorid);
    const measurementJSON = await measurementResponse.json();
    if (!measurementJSON.length) {
        summaryError.style.display = "block";
        charts.style.display = "none";
        summaryError.innerHTML = "No measurements associated to sensor " + sensor.sensorid;
        return;
    }

    let datetime = [];
    let hr = [];
    let rr = [];
    let temp = [];
    let so2 = [];
    let bps = [];
    let bpd = [];
    let motiontype = [];

    for (let i = 0; i < measurementJSON.length; ++i) {
        datetime.push(measurementJSON[i].datetime);
        hr.push(measurementJSON[i].hr);
        rr.push(measurementJSON[i].rr);
        temp.push(measurementJSON[i].temp);
        so2.push(measurementJSON[i].so2);
        bps.push(measurementJSON[i].bps);
        bpd.push(measurementJSON[i].bpd);
        motiontype.push(measurementJSON[i].motiontype);
    }

    // Generate measurement graphs
    const hrCanvas = document.getElementById("hr").getContext("2d");
    const hrChart = new Chart(hrCanvas, {
        type: "line",
        data: {
            labels: datetime,
            datasets: [{
                label: "HR",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: hr
            }]
        },
        options: {}
    });
    const rrCanvas = document.getElementById("rr").getContext("2d");
    const rrChart = new Chart(rrCanvas, {
        type: "line",
        data: {
            labels: datetime,
            datasets: [{
                label: "RR",
                backgroundColor: "#ffa000",
                borderColor: "#ffa000",
                data: rr
            }]
        },
        options: {}
    });
    const tempCanvas = document.getElementById("temp").getContext("2d");
    const tempChart = new Chart(tempCanvas, {
        type: "line",
        data: {
            labels: datetime,
            datasets: [{
                label: "Temp",
                backgroundColor: "#fdd835",
                borderColor: "#fdd835",
                data: temp
            }]
        },
        options: {}
    });
    const so2Canvas = document.getElementById("so2").getContext("2d");
    const so2Chart = new Chart(so2Canvas, {
        type: "line",
        data: {
            labels: datetime,
            datasets: [{
                label: "SO2",
                backgroundColor: "#8bc34a",
                borderColor: "#8bc34a",
                data: so2
            }]
        },
        options: {}
    });
    const bpsCanvas = document.getElementById("bps").getContext("2d");
    const bpsChart = new Chart(bpsCanvas, {
        type: "line",
        data: {
            labels: datetime,
            datasets: [{
                label: "BPS",
                backgroundColor: "#2196f3",
                borderColor: "#2196f3",
                data: bps
            }]
        },
        options: {}
    });
    const bpdCanvas = document.getElementById("bpd").getContext("2d");
    const bpdChart = new Chart(bpdCanvas, {
        type: "line",
        data: {
            labels: datetime,
            datasets: [{
                label: "BPD",
                backgroundColor: "#9c27b0",
                borderColor: "#9c27b0",
                data: bpd
            }]
        },
        options: {}
    });
    const motionTypeCanvas = document.getElementById("motiontype").getContext("2d");
    const motionTypeChart = new Chart(motionTypeCanvas, {
        type: "line",
        data: {
            labels: datetime,
            datasets: [{
                label: "Motion Type",
                backgroundColor: "#795548",
                borderColor: "#795548",
                data: motiontype
            }]
        },
        options: {}
    });

    // Fetch rule data
    const table = document.getElementById("ruleTable");
    const title = document.getElementById("title");
    const code = document.getElementById("code");
    const notifee = document.getElementById("notifee");
    const measurement = document.getElementById("measurement");
    const equality = document.getElementById("equality");
    const value = document.getElementById("value");
    const addButton = document.getElementById("add");
    const ruleResponse = await fetch(url + "rule/sensorid/" + sensor.sensorid);
    const ruleJSON = await ruleResponse.json();

    // Clear table on reload
    const tableLength = table.rows.length - 1;
    for (let i = 1; i < tableLength; ++i) {
        table.deleteRow(1);
    }

    // Add rule
    addButton.addEventListener("click", function() {
        const tableLength = table.rows.length - 1;
        const title = document.getElementById("title");
        const code = document.getElementById("code");
        const notifee = document.getElementById("notifee");
        const measurement = document.getElementById("measurement");
        const equality = document.getElementById("equality");
        const value = document.getElementById("value");

        const newTitle = title.value;
        const newCode = code.value;
        const newNotifee = notifee.value;
        const newMeasurement = measurement.options[document.getElementById("measurement").selectedIndex].text;
        const newEquality = equality.options[document.getElementById("equality").selectedIndex].text;
        const newValue = value.value;

        // Check valid input
        if (newTitle === "") { 
            ruleError.style.display = "block";
            ruleError.innerHTML = "Title cannot be empty";
            return;
        }
        if (newCode === "") { 
            ruleError.style.display = "block";
            ruleError.innerHTML = "Code cannot be empty";
            return;
        }
        if (newNotifee === "") { 
            ruleError.style.display = "block";
            ruleError.innerHTML = "Notifee cannot be empty";
            return;
        }
        if (newValue.replaceAll(" ", "") === "" || isNaN(newValue) || newValue === "Infinity" || newValue === "-Infinity") {
            ruleError.style.display = "block";
            ruleError.innerHTML = "Value must be a valid number";
            return;
        }

        ruleError.style.display = "none";
        loadRules(sensor, tableLength, newTitle, newCode, newNotifee, newMeasurement, newEquality, newValue);

        // Clear input fields
        title.value = "";
        code.value = "";
        notifee.value = "";
        measurement.selectedIndex = 0;
        equality.selectedIndex = 0;
        value.value = "";
    });

    // Load database
    for (let i = 0; i < ruleJSON.length; ++i) {
        const tableLength = table.rows.length - 1;
        const newTitle = ruleJSON[i].title;
        const newCode = ruleJSON[i].code;
        const newNotifee = ruleJSON[i].notifee;
        const condition = ruleJSON[i].condition.split(",");
        const newMeasurement = condition[0];
        const newEquality = condition[1];
        const newValue = condition[2];
       
        loadRules(sensor, tableLength, newTitle, newCode, newNotifee, newMeasurement, newEquality, newValue);
    }
}

function loadRules(sensor, tableLength, newTitle, newCode, newNotifee, newMeasurement, newEquality, newValue) {
    // Insert row
    const table = document.getElementById("ruleTable");
    const newRow = table.insertRow(tableLength);
    newRow.id = "row" + tableLength;
    const newTitleCell = newRow.insertCell(0);
    newTitleCell.id = "titleRow" + tableLength;
    newTitleCell.innerHTML = newTitle;
    const newCodeCell = newRow.insertCell(1);
    newCodeCell.id = "codeRow" + tableLength;
    newCodeCell.innerHTML = newCode;
    const newNotifeeCell = newRow.insertCell(2);
    newNotifeeCell.id = "notifeeRow" + tableLength;
    newNotifeeCell.innerHTML = newNotifee;
    const newMeasurementCell = newRow.insertCell(3);
    newMeasurementCell.id = "measurementRow" + tableLength;
    newMeasurementCell.innerHTML = newMeasurement;
    const newEqualityCell = newRow.insertCell(4);
    newEqualityCell.id = "equalityRow" + tableLength;
    newEqualityCell.innerHTML = newEquality;
    const newValueCell = newRow.insertCell(5);
    newValueCell.id = "valueRow" + tableLength;
    newValueCell.innerHTML = newValue;
    const newButtons = newRow.insertCell(6);

    // Edit button
    const editButton = document.createElement("button");
    editButton.innerHTML = "Edit"
    editButton.type = "submit"
    editButton.id = "editButton" + tableLength;
    editButton.classList.add("button");
    editButton.addEventListener("click", function() {
        ruleError.style.display = "none";
        const row = this.id.replace("editButton", "");
        document.getElementById("saveButton" + row).style.display = "block";
        this.style.display = "none";
        const title = document.getElementById("titleRow" + row);
        const code = document.getElementById("codeRow" + row);
        const notifee = document.getElementById("notifeeRow" + row);
        const measurement = document.getElementById("measurementRow" + row);
        const equality = document.getElementById("equalityRow" + row);
        const value = document.getElementById("valueRow" + row);
        const titleVal = title.innerHTML;
        const codeVal = code.innerHTML;
        const notifeeVal = notifee.innerHTML;
        const measurementVal = measurement.innerHTML;
        const equalityVal = equality.innerHTML;
        const valueVal = value.innerHTML;

        // Create input fields
        title.innerHTML = "";
        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.id = "titleRowInput" + row;
        titleInput.value = titleVal;
        title.appendChild(titleInput);
        code.innerHTML = "";
        const codeInput = document.createElement("input");
        codeInput.type = "text";
        codeInput.id = "codeRowInput" + row;
        codeInput.value = codeVal;
        code.appendChild(codeInput);
        notifee.innerHTML = "";
        const notifeeInput = document.createElement("input");
        notifeeInput.type = "text";
        notifeeInput.id = "notifeeRowInput" + row;
        notifeeInput.value = notifeeVal;
        notifee.appendChild(notifeeInput);
        measurement.innerHTML = "";
        const measurementInput = document.createElement("select");
        measurementInput.id = "measurementRowInput" + row;
        const hrOption = document.createElement("option");
        const hrText = document.createTextNode("HR");
        hrOption.appendChild(hrText);
        measurementInput.appendChild(hrOption);
        const rrOption = document.createElement("option");
        const rrText = document.createTextNode("RR");
        rrOption.appendChild(rrText);
        measurementInput.appendChild(rrOption);
        const tempOption = document.createElement("option");
        const tempText = document.createTextNode("Temp");
        tempOption.appendChild(tempText);
        measurementInput.appendChild(tempOption);
        const so2Option = document.createElement("option");
        const so2Text = document.createTextNode("SO2");
        so2Option.appendChild(so2Text);
        measurementInput.appendChild(so2Option);
        const bpsOption = document.createElement("option");
        const bpsText = document.createTextNode("BPS");
        bpsOption.appendChild(bpsText);
        measurementInput.appendChild(bpsOption);
        const bpdOption = document.createElement("option");
        const bpdText = document.createTextNode("BPD");
        bpdOption.appendChild(bpdText);
        measurementInput.appendChild(bpdOption);
        const motionTypeOption = document.createElement("option");
        const motionTypeText = document.createTextNode("Motion Type");
        motionTypeOption.appendChild(motionTypeText);
        measurementInput.appendChild(motionTypeOption);
        measurement.appendChild(measurementInput);
        equality.innerHTML = "";
        const equalityInput = document.createElement("select");
        equalityInput.id = "equalityRowInput" + row;
        const ltOption = document.createElement("option");
        const ltText = document.createTextNode("<");
        ltOption.appendChild(ltText);
        equalityInput.appendChild(ltOption);
        const leOption = document.createElement("option");
        const leText = document.createTextNode("≤");
        leOption.appendChild(leText);
        equalityInput.appendChild(leOption);
        const gtOption = document.createElement("option");
        const gtText = document.createTextNode(">");
        gtOption.appendChild(gtText);
        equalityInput.appendChild(gtOption);
        const geOption = document.createElement("option");
        const geText = document.createTextNode("≥");
        geOption.appendChild(geText);
        equalityInput.appendChild(geOption);
        const eqOption = document.createElement("option");
        const eqText = document.createTextNode("=");
        eqOption.appendChild(eqText);
        equalityInput.appendChild(eqOption);
        equality.appendChild(equalityInput);
        value.innerHTML = "";
        const valueInput = document.createElement("input");
        valueInput.type = "text";
        valueInput.id = "valueRowInput" + row;
        valueInput.value = valueVal;
        value.appendChild(valueInput);

        // Set previous input as selected option
        switch(measurementVal) {
            case "HR":
                hrOption.selected = "selected";
                break;
            case "RR":
                rrOption.selected = "selected";
                break;
            case "Temp":
                tempOption.selected = "selected";
                break;
            case "SO2":
                so2Option.selected = "selected";
                break;
            case "BPS":
                bpsOption.selected = "selected";
                break;
            case "BPD":
                bpdOption.selected = "selected";
                break;
            case "Motion Type":
                motionTypeOption.selected = "selected";
                break;
        }

        switch(equalityVal) {
            case "<":
                ltOption.selected = "selected";
                break;
            case "≤":
                leOption.selected = "selected";
                break;
            case ">":
                gtOption.selected = "selected";
                break;
            case "≥":
                geOption.selected = "selected";
                break;
            case "=":
                eqOption.selected = "selected";
                break;
        }
    });
    newButtons.appendChild(editButton);

    // Save button
    const saveButton = document.createElement("button");
    saveButton.innerHTML = "Save"
    saveButton.type = "submit"
    saveButton.id = "saveButton" + tableLength;
    saveButton.classList.add("button");
    saveButton.addEventListener("click", async function() {
        const row = this.id.replace("saveButton", "");
        const titleVal = document.getElementById("titleRowInput" + row).value;
        const codeVal = document.getElementById("codeRowInput" + row).value;
        const notifeeVal = document.getElementById("notifeeRowInput" + row).value;
        const measurementVal = document.getElementById("measurementRowInput" + row).options[document.getElementById("measurementRowInput" + row).selectedIndex].text;
        const equalityVal = document.getElementById("equalityRowInput" + row).options[document.getElementById("equalityRowInput" + row).selectedIndex].text;
        const valueVal = document.getElementById("valueRowInput" + row).value;

        // Check valid input
        if (titleVal === "") { 
            ruleError.style.display = "block";
            ruleError.innerHTML = "Title cannot be empty";
            return;
        }
        if (codeVal === "") { 
            ruleError.style.display = "block";
            ruleError.innerHTML = "Code cannot be empty";
            return;
        }
        if (notifeeVal === "") { 
            ruleError.style.display = "block";
            ruleError.innerHTML = "Notifee cannot be empty";
            return;
        }
        if (valueVal.replaceAll(" ", "") === "" || isNaN(valueVal) || valueVal === "Infinity" || valueVal === "-Infinity") {
            ruleError.style.display = "block";
            ruleError.innerHTML = "Value must be a valid number";
            return;
        }

        ruleError.style.display = "none";
        document.getElementById("editButton" + row).style.display = "block";
        this.style.display = "none";

        // Set input as text
        document.getElementById("titleRow" + row).innerHTML = titleVal;
        document.getElementById("codeRow" + row).innerHTML = codeVal;
        document.getElementById("notifeeRow" + row).innerHTML = notifeeVal;
        document.getElementById("measurementRow" + row).innerHTML = measurementVal;
        document.getElementById("equalityRow" + row).innerHTML = equalityVal;
        document.getElementById("valueRow" + row).innerHTML = valueVal;

        // Save to database
        const url = "https://px6psk37hg.execute-api.us-east-2.amazonaws.com/prod/";
        const dateTime = Date.now();
        const unitId = sensor.unitid;
        const sensorId = sensor.sensorid;
        const ruleId = "0";

        /* TODO: Save to database
        try {
            const ruleResponse = await fetch(url + "rule", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "sensorid": sensorId,
                    "ruleid": ruleId,
                    "unitid": unitId,
                    "datetimecreated": dateTime,
                    "title": titleVal,
                    "code": codeVal,
                    "notifee": notifeeVal,
                    "condition": measurementVal + "," + equalityVal + "," + valueVal
                })
            });
        } catch (error) {
            ruleError.style.display = "block";
            ruleError.innerHTML = "Error saving rule to the database: " + error;
            return;
        }
        */
        ruleError.style.display = "none";
       
        const heatmap = document.getElementById("heatmap").getElementsByTagName("div");
        for (let i = 0; i < heatmap.length; ++i) {
            if (sensorId == heatmap[i].id) {
                applyRules(heatmap[i], sensor);
            }
        }
    });
    saveButton.style.display = "none";
    newButtons.appendChild(saveButton);
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete"
    deleteButton.type = "submit"
    deleteButton.id = "deleteButton" + tableLength;
    deleteButton.classList.add("button");
    deleteButton.addEventListener("click", function() {
        ruleError.style.display = "none";
        const row = this.id.replace("deleteButton", "");
        table.deleteRow(row);
    });
    newButtons.appendChild(deleteButton);
}
