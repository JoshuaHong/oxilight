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
    const summary = document.getElementById("error");
    const user = await Auth.currentAuthenticatedUser();
    const url = "https://px6psk37hg.execute-api.us-east-2.amazonaws.com/prod/";
    const userResponse = await fetch(url + "user/userid/" + user.username);
    let userJSON;

    try {
        userJSON = await userResponse.json();
    } catch (error) {
        const errorMessage = "User " + user.username + " does not exist in the database";
        console.warn(errorMessage);
        summary.innerHTML = errorMessage;
        return;
    }

    const unitId = userJSON.unitid;
    const sensorResponse = await fetch(url + "sensor/unitid/" + unitId);
    const sensorJSON = await sensorResponse.json();
    if (!sensorJSON.length) {
        summary.innerHTML = "No sensors associated to user " + user.username;
    }

    const heatmap = document.getElementById("heatmap");
    for (let i = 0; i < sensorJSON.length; ++i) {
        const cell = document.createElement("div");
        const text = document.createTextNode(sensorJSON[i].sensorid);
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
    }
}

async function cellClicked(sensor) {
    // Generate sensor summary
    const sensorData = document.getElementById("sensorData");
    const error = document.getElementById("error");
    const charts = document.getElementById("charts");
    const sensorid = document.getElementById("sensorid");
    const unitid = document.getElementById("unitid");
    const isactive = document.getElementById("isactive");
    const datetimeregistered = document.getElementById("datetimeregistered");
    const datetimeactivated = document.getElementById("datetimeactivated");
    const datetimedisabled = document.getElementById("datetimedisabled");

    sensorData.style.display = "block";
    error.style.display = "none";
    charts.style.display = "block";
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
        error.style.display = "block";
        charts.style.display = "none";
        error.innerHTML = "No measurements associated to sensor " + sensor.sensorid;
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
}
