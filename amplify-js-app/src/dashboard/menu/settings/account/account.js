import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

verifySignIn();

window.onload = function() {
    initMenu();
    initTabs();
    initOverview();
    initEmail();
    initPassword();

    updateOverview();
    updateEmail();
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

function initOverview() {
    const overviewSaveButton = document.getElementById("overviewSave");
    overviewSaveButton.addEventListener("click", overviewSave);
}

function initEmail() {
    const emailSaveButton = document.getElementById("emailSave");
    const emailConfirmButton = document.getElementById("emailConfirm");
    emailSaveButton.addEventListener("click", emailSave);
    emailConfirmButton.addEventListener("click", emailConfirm);
}

async function updateEmail() {
    const user = await Auth.currentAuthenticatedUser();
    const currentEmail = document.getElementById("currentEmail");
    currentEmail.innerHTML = user.attributes.email;
}

async function emailSave() {
    const newEmailSave = document.getElementById("newEmailSave");
    try {
        const user = await Auth.currentAuthenticatedUser();
        const result = await Auth.updateUserAttributes(user, {
            "email": newEmailSave.value
        });
        emailMessage.innerHTML = "Saved successfully: please check your email and enter the verification code"
    } catch (error) {
        emailMessage.innerHTML = error.message;
    }
}

async function emailConfirm() {
    const newEmailSave = document.getElementById("newEmailSave");
    const emailCode = document.getElementById("emailCode");
    try {
        await Auth.verifyCurrentUserAttributeSubmit("email", emailCode.value);
        emailMessage.innerHTML = "Email confirmed successfully";
        updateEmail();
        newEmailSave.value = "";
        emailCode.value = "";
    } catch (error) {
        emailMessage.innerHTML = error.message;
    }
}

function initPassword() {
    const passwordSaveButton = document.getElementById("passwordSave");
    passwordSaveButton.addEventListener("click", passwordSave);
}

async function passwordSave() {
    const currentPassword = document.getElementById("currentPassword");
    const newPassword = document.getElementById("newPassword");
    const passwordMessage = document.getElementById("passwordMessage");
    Auth.currentAuthenticatedUser()
        .then(user => {
            return Auth.changePassword(user, currentPassword.value, newPassword.value);
        })
        .then(data => {
            passwordMessage.innerHTML = "Password updated successfully";
            currentPassword.value = "";
            newPassword.value = "";
        })
        .catch(error => {
            passwordMessage.innerHTML = error.message;
            currentPassword.value = "";
            newPassword.value = "";
        });
}

async function updateOverview() {
    const name = document.getElementById("name");
    const address = document.getElementById("address");
    const birthdate = document.getElementById("birthdate");
    const phoneNumber = document.getElementById("phoneNumber");
    const user = await Auth.currentAuthenticatedUser();
    const username = document.getElementById("username");
    const email = document.getElementById("overviewEmail");
    username.innerHTML = user.username;
    email.innerHTML = user.attributes.email;

    if (user.attributes.name) {
        name.value = user.attributes.name;
    }
    if (user.attributes.address) {
        address.value = user.attributes.address;
    }
    if (user.attributes.birthdate) {
        birthdate.value = user.attributes.birthdate;
    }
    if (user.attributes.phone_number) {
        phoneNumber.value = user.attributes.phone_number.replace("+", "");
    }
}

async function overviewSave() {
    const name = document.getElementById("name");
    const address = document.getElementById("address");
    const birthdate = document.getElementById("birthdate");
    const phoneNumber = document.getElementById("phoneNumber");
    const overviewMessage = document.getElementById("overviewMessage");
    try {
        const user = await Auth.currentAuthenticatedUser();
        const result = await Auth.updateUserAttributes(user, {
            "name": name.value,
            "address": address.value,
            "birthdate": birthdate.value,
            "phone_number": "+" + phoneNumber.value
        });
        overviewMessage.innerHTML = "Saved successfully"
    } catch (error) {
        overviewMessage.innerHTML = error.message;
    }
}
