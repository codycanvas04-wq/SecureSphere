
"use strict";

const passwordInput = document.getElementById("passwordInput");
const togglePassword = document.getElementById("togglePassword");
const tryExample = document.getElementById("tryExample");

const strengthFill = document.getElementById("strengthFill");
const strengthProgress = document.getElementById("strengthProgress");
const strengthLabel = document.getElementById("strengthLabel");
const strengthMessage = document.getElementById("strengthMessage");
const improvementTip = document.getElementById("improvementTip");

const checks = {
    length: document.getElementById("lengthCheck"),
    long: document.getElementById("longCheck"),
    variety: document.getElementById("varietyCheck"),
    pattern: document.getElementById("patternCheck"),
    unique: document.getElementById("uniqueCheck")
};

function updateCheck(element, passed, message) {
    element.className = passed ? "pass" : "fail";
    element.textContent = (passed ? "✓ " : "○ ") + message;
}

function evaluatePassword(password) {
    const lower = password.toLowerCase();

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const types = [hasLower, hasUpper, hasNumber, hasSymbol]
        .filter(Boolean).length;

    const commonPasswords = [
        "password", "password123", "123456", "12345678",
        "qwerty", "qwerty123", "admin", "letmein",
        "welcome", "iloveyou", "abc123", "changeme",
        "monkey", "dragon", "football", "sunshine"
    ];

    const commonPassword = commonPasswords.includes(lower);

    // Detect simple repeated characters.
    const repeated = /^(.)\1+$/.test(password) ||
                     /(.)\1{3,}/.test(password);

    // Detect common ascending/descending sequences and keyboard patterns.
    const sequences = [
        "abcdefghijklmnopqrstuvwxyz",
        "0123456789",
        "9876543210",
        "qwertyuiop",
        "asdfghjkl",
        "zxcvbnm"
    ];

    const sequencePattern = sequences.some(sequence =>
        sequence.includes(lower) ||
        sequence.split("").reverse().join("").includes(lower)
    );

    // Flag username-like patterns such as two words joined by "_" or "-".
    // This is a heuristic: it cannot identify every real name.
    const tokens = lower.split(/[^a-z0-9]+/).filter(Boolean);

    const looksLikeNameOrUsername =
        /[_\-.]/.test(password) &&
        tokens.length >= 2 &&
        tokens.every(token => /^[a-z]{3,}$/.test(token));

    const commonWord = [
        "love", "hello", "welcome", "secret",
        "india", "computer", "master", "star"
    ].some(word => lower.includes(word));

    const lengthPass = password.length >= 12;
    const longPass = password.length >= 16;
    const varietyPass = types >= 3;
    const patternPass = !commonPassword &&
                        !looksLikeNameOrUsername &&
                        !commonWord;
    const uniquePass = !repeated && !sequencePattern;

    updateCheck(checks.length, lengthPass, "At least 12 characters");
    updateCheck(checks.long, longPass, "16 or more characters");
    updateCheck(checks.variety, varietyPass, "Uses 3 or more character types");
    updateCheck(checks.pattern, patternPass, "Avoids common words and name-like patterns");
    updateCheck(checks.unique, uniquePass, "Avoids obvious repetition and sequences");

    if (!password) {
        return {
            score: 0,
            label: "Waiting for your test password",
            message: "Type a fictional password to begin.",
            tip: "💡 Try a long, unique passphrase made from unrelated words."
        };
    }

    // A simple educational score, not a real cracking-time estimate.
    let score = 0;

    if (password.length >= 8) score += 10;
    if (password.length >= 12) score += 15;
    if (password.length >= 16) score += 20;
    if (password.length >= 20) score += 15;
    if (password.length >= 24) score += 10;

    // Variety contributes, but cannot compensate for a predictable pattern.
    score += types * 5;

    if (patternPass) score += 10;
    if (uniquePass) score += 10;

    if (commonPassword) score = Math.min(score, 10);
    if (looksLikeNameOrUsername) score = Math.min(score, 35);
    if (commonWord) score -= 10;
    if (repeated) score -= 25;
    if (sequencePattern) score -= 20;

    score = Math.max(0, Math.min(100, score));

    // Cap classifications when important warning signs are detected.
    let label;
    let message;
    let tip;

    if (commonPassword || repeated || password.length < 8) {
        score = Math.min(score, 20);
        label = "Very Weak";
        message = "This password is short, common, or highly predictable.";
        tip = "💡 Start again with a longer password that is not based on a common phrase.";
    } else if (looksLikeNameOrUsername || sequencePattern || score < 35) {
        score = Math.min(score, 35);
        label = "Weak";
        message = "This password may contain a predictable name-like pattern or sequence.";
        tip = "💡 Avoid names, usernames, birthdays, and simple sequences. Try a unique passphrase instead.";
    } else if (score < 55) {
        label = "Fair";
        message = "Some useful features are present, but it could be harder to guess.";
        tip = "💡 Increase the length and avoid words or details connected to you.";
    } else if (score < 75) {
        label = "Strong";
        message = "A good start, but this simple checker cannot verify whether it is common or exposed in a breach.";
        tip = "💡 Use a unique password for every account. A password manager can help.";
    } else {
        label = "Very Strong";
        message = "This passes our basic checks. That does not guarantee it is secure or uncompromised.";
        tip = "💡 Prefer a long, unique password or passphrase and enable two-factor authentication.";
    }

    return { score, label, message, tip };
}

function checkPassword() {
    const result = evaluatePassword(passwordInput.value);

    strengthFill.style.width = result.score + "%";
    strengthProgress.setAttribute("aria-valuenow", result.score);
    strengthLabel.textContent = result.label;
    strengthMessage.textContent = result.message;
    improvementTip.textContent = result.tip;

    const colors = {
        "Very Weak": "#e05252",
        "Weak": "#f08b45",
        "Fair": "#e3b341",
        "Strong": "#29a36a",
        "Very Strong": "#168b83",
        "Waiting for your test password": "#aab3c3"
    };

    strengthFill.style.background = colors[result.label] || "#aab3c3";
}

passwordInput.addEventListener("input", checkPassword);

togglePassword.addEventListener("click", function () {
    const showing = passwordInput.type === "text";

    passwordInput.type = showing ? "password" : "text";
    togglePassword.textContent = showing ? "Show" : "Hide";
    togglePassword.setAttribute("aria-pressed", String(!showing));
});

tryExample.addEventListener("click", function () {
    passwordInput.value = "River!Cloud7Garden";
    checkPassword();
});

document.getElementById("checkerForm").addEventListener("submit", function (event) {
    event.preventDefault();
});

checkPassword();
