import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

window.onload = function() {
    const showSignInButton = document.getElementById("showSignInButton");
    const signInModal = document.getElementById("signInModal");
    const closeSignInButton = document.getElementById("closeSignInButton");
    const signInUsername = document.getElementById("signInUsername");
    const signInPassword = document.getElementById("signInPassword");
    const signInButton = document.getElementById("signInButton");
    const signInError = document.getElementById("signInError");

    const showSignUpButton = document.getElementById("showSignUpButton");
    const signUpModal = document.getElementById("signUpModal");
    const closeSignUpButton = document.getElementById("closeSignUpButton");
    const signUpUsername = document.getElementById("signUpUsername");
    const signUpPassword = document.getElementById("signUpPassword");
    const signUpEmail = document.getElementById("signUpEmail");
    const signUpButton = document.getElementById("signUpButton");
    const signUpError = document.getElementById("signUpError");
    
    const confirmationLink = document.getElementById("confirmationLink");
    const confirmationModal = document.getElementById("confirmationModal");
    const resetPasswordModal = document.getElementById("resetPasswordModal");
    const closeConfirmationButton = document.getElementById("closeConfirmationButton");
    const confirmationBackButton = document.getElementById("confirmationBackButton");
    const confirmationUsername = document.getElementById("confirmationUsername");
    const confirmationCode = document.getElementById("confirmationCode");
    const confirmationButton = document.getElementById("confirmationButton");
    const reSendConfirmationButton = document.getElementById("reSendConfirmationButton");
    const confirmationError = document.getElementById("confirmationError");    

    const resetPasswordLink = document.getElementById("resetPasswordLink");
    const closeResetPasswordButton = document.getElementById("closeResetPasswordButton");
    const resetPasswordBackButton = document.getElementById("resetPasswordBackButton");
    const resetPasswordUsername = document.getElementById("resetPasswordUsername");
    const resetPasswordCode = document.getElementById("resetPasswordCode");
    const newPassword = document.getElementById("newPassword");
    const resetPasswordButton = document.getElementById("resetPasswordButton");
    const sendResetCodeButton = document.getElementById("sendResetCodeButton");
    const resetPasswordError = document.getElementById("resetPasswordError");

    showSignInButton.addEventListener("click", showSignIn);
    closeSignInButton.addEventListener("click", hideSignIn);
    signInButton.addEventListener("click", signIn);

    showSignUpButton.addEventListener("click", showSignUp);
    closeSignUpButton.addEventListener("click", hideSignUp);
    signUpButton.addEventListener("click", signUp);

    confirmationLink.addEventListener("click", toConfirmation);
    confirmationBackButton.addEventListener("click", fromConfirmation);
    closeConfirmationButton.addEventListener("click", hideConfirmation);
    confirmationButton.addEventListener("click", confirmSignUp);
    reSendConfirmationButton.addEventListener("click", reSendConfirmationCode);

    resetPasswordLink.addEventListener("click", toReset);
    resetPasswordBackButton.addEventListener("click", fromReset);
    closeResetPasswordButton.addEventListener("click", hideResetPassword);
    sendResetCodeButton.addEventListener("click", sendResetCode);
    resetPasswordButton.addEventListener("click", resetPassword);

    signInModal.addEventListener("keyup", signInEnter);
    resetPasswordModal.addEventListener("keyup", resetPasswordEnter);
    signUpModal.addEventListener("keyup", signUpEnter);
    confirmationModal.addEventListener("keyup", confirmSignUpEnter);
}

window.onclick = function(event) {
    if (event.target == signInModal) {
        hideSignIn();
    } else if (event.target == signUpModal) {
        hideSignUp();
    } else if (event.target == confirmationModal) {
        hideConfirmation();
    } else if (event.target == resetPasswordModal) {
        hideResetPassword();
    }
}

function signInEnter(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        signIn();
    }
}

function resetPasswordEnter(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        resetPassword();
    }
}

function signUpEnter(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        signUp();
    }
}

function confirmSignUpEnter(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        confirmSignUp();
    }
}

function showSignIn() {
    signInModal.style.display = "block";
}

function showSignUp() {
    signUpModal.style.display = "block";
}

function showConfirmation() {
    confirmationModal.style.display = "block";
}

function showResetPassword() {
    resetPasswordModal.style.display = "block";
}

function hideSignIn() {
    signInModal.style.display = "none";
    signInError.style.display = "none";
}

function hideSignUp() {
    signUpModal.style.display = "none";
    signUpError.style.display = "none";
}

function hideConfirmation() {
    confirmationModal.style.display = "none";
    confirmationError.style.display = "none";
}

function hideResetPassword() {
    resetPasswordModal.style.display = "none";
    resetPasswordError.style.display = "none";
}

function toConfirmation() {
    confirmationUsername.value = signUpUsername.value;
    hideSignUp();
    showConfirmation();
}

function fromConfirmation() {
    hideConfirmation();
    showSignUp();
}

function toReset() {
    resetPasswordUsername.value = signInUsername.value;
    hideSignIn();
    showResetPassword();
}

function fromReset() {
    hideResetPassword();
    showSignIn();
}

async function signIn() {
    try {
        await Auth.signIn(signInUsername.value, signInPassword.value);

        if (typeof(Storage) !== "undefined") {
            window.open("dashboard.html", "_self", false);
        } else {
            signInError.innerHTML = "ERROR: Browser not supported.";
            signInError.style.display = "block";
            alert("Error: Browser not supported.");
        }
    } catch (error) {
        if (signInUsername.value == "") {
            signInError.innerHTML = "ERROR: Username cannot be empty.";
        } else if (signInPassword.value == "") {
            signInError.innerHTML = "ERROR: Password cannot be empty.";
        } else {
            signInError.innerHTML = "ERROR: " + error.message;
        }
        signInError.style.display = "block"
    }
}

async function signUp() {
    try {
        if (signUpEmail.value == "") {
            signUpError.innerHTML = "ERROR: Email cannot be empty.";
            signUpError.style.display = "block";
            return;
        }
        const user = await Auth.signUp({
            username: signUpUsername.value,
            password: signUpPassword.value,
            attributes: {
                email: signUpEmail.value
            }
        });
        hideSignUp();
        showConfirmation();
        confirmationUsername.value = signUpUsername.value;
    } catch (error) {
        if (signUpUsername.value == "") {
            signUpError.innerHTML = "ERROR: Username cannot be empty.";
        } else if (signUpPassword.value == "") {
            signUpError.innerHTML = "ERROR: Password cannot be empty.";
        } else {
            signUpError.innerHTML = "ERROR: " + error.message;
        }
        signUpError.style.display = "block";
    }
}

async function confirmSignUp() {
    try {
        await Auth.confirmSignUp(confirmationUsername.value, confirmationCode.value);
        confirmationError.innerHTML = "Successfully signed up."
        confirmationError.style.display = "block";
    } catch (error) {
        if (confirmationUsername.value == "") {
            confirmationError.innerHTML = "ERROR: Username cannot be empty.";
        } else if (confirmationCode.value == "") {
            confirmationError.innerHTML = "ERROR: Code cannot be empty.";
        } else {
            confirmationError.innerHTML = "ERROR: " + error.message;
        }
        confirmationError.style.display = "block";
    }
}

async function reSendConfirmationCode() {
    try {
        await Auth.resendSignUp(confirmationUsername.value);
        confirmationError.innerHTML = "Confirmation code sent to " + signUpEmail.value + ".";
        confirmationError.style.display = "block";
    } catch (error) {
        if (confirmationUsername.value == "") {
            confirmationError.innerHTML = "ERROR: Username cannot be empty.";
        } else {
            confirmationError.innerHTML = "ERROR: " + error.message;
        }
        confirmationError.style.display = "block";
    }
}

async function sendResetCode() {
    Auth.forgotPassword(resetPasswordUsername.value)
        .then(data => {
            resetPasswordError.innerHTML = "Confirmation code sent to " + data.CodeDeliveryDetails.Destination + ".";
            resetPasswordError.style.display = "block";
        })
        .catch(error => {
            if (resetPasswordUsername.value == "") {
                resetPasswordError.innerHTML = "ERROR: Username cannot be empty.";
            } else {
                resetPasswordError.innerHTML = "ERROR: " + error.message;
            }
            resetPasswordError.style.display = "block";
        });
}

async function resetPassword() {
    Auth.forgotPasswordSubmit(resetPasswordUsername.value, resetPasswordCode.value, newPassword.value)
        .then(data => {
            resetPasswordError.innerHTML = "Successfully reset password.";
            resetPasswordError.style.display = "block";
        })
        .catch(error => {
            if (resetPasswordUsername.value == "") {
                resetPasswordError.innerHTML = "ERROR: Username cannot be empty.";
            } else if (resetPasswordCode.value == "") {
                resetPasswordError.innerHTML = "ERROR: Code cannot be empty.";
            } else if (newPassword.value == "") {
                resetPasswordError.innerHTML = "ERROR: Password cannot be empty.";
            } else {
                resetPasswordError.innerHTML = "ERROR: " + error.message;
            }
            resetPasswordError.style.display = "block";
        });
}
