import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

verifySignIn();

window.onload = function() {
    initMenu();
    initTabs();

    initOptions();
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

function toGeneralSettingsPage() {
    window.open("general.html", "_self", false);
}

function toAccountSettingsPage() {
    window.open("account.html", "_self", false);
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

function initTabs() {
    const tabContent = document.getElementsByClassName("tabContent");
    const tabButtonsDiv = document.getElementById("tabButtons");
    const tabButtons = tabButtonsDiv.querySelectorAll("button");
    tabContent[0].style.display = "block";
    tabButtons[0].classList.add("active");
    for (let i = 0; i < tabButtons.length; ++i) {
        tabButtons[i].addEventListener("click", function() {
            for (let i = 0; i < tabButtons.length; ++i) {
                tabButtons[i].classList.remove("active");
                document.getElementById(tabButtons[i].id.replace("Button", "")).style.display = "none";
            }
            event.currentTarget.classList.add("active");
            document.getElementById(event.currentTarget.id.replace("Button", "")).style.display = "block";
        });
    }
}

function initOptions() {
    const celcius = document.getElementById("celcius");
    const farenheight = document.getElementById("farenheight");

    celcius.addEventListener("click", function() {
        localStorage.setItem("temperature", "celcius");
    });

    farenheight.addEventListener("click", function() {
        localStorage.setItem("temperature", "farenheight");
    });

    if (localStorage.getItem("temperature") == "farenheight") {
        farenheight.checked = true;
    } else {
        celcius.checked = true;
    }
}
