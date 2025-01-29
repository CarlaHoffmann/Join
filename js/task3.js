
/** 
 * Date
 */
let datepicker, warningDialog, dialogMessage, currentYear, maxYear;

/** 
 * This function initializes the date picker and sets up event listeners.
 */
function initializeDatePicker() {
    datepicker = document.getElementById('datepicker');
    warningDialog = document.getElementById('warning-dialog');
    dialogMessage = document.getElementById('dialog-message');
    currentYear = new Date().getFullYear();
    maxYear = currentYear + 5;

    if (datepicker) {
        setupEventListeners(datepicker, warningDialog);
    } else {
        return;
    }
}

/** 
 * This function sets up event listeners for the date picker.
 */
function setupEventListeners(datepicker, warningDialog) {
    datepicker.addEventListener('input', handleDateInput);
    datepicker.addEventListener('blur', validateFullDate);
    window.onclick = (event) => handleWindowClick(event, warningDialog);
}

/**
 * These functions handle and validate the date input.
 */
function handleDateInput() {
    let value = this.value.replace(/\D/g, '');
    let parts = [value.slice(0, 2), value.slice(2, 4), value.slice(4, 8)];
    validateAndFormatParts(parts);
    this.value = formatDate(parts);
}

/**
 * Validates and formats the day, month, and year parts of the date.
 * @param {Array<string>} parts - An array containing the day, month, and year parts.
 */
function validateAndFormatParts(parts) {
    validateDay(parts);
    validateMonth(parts);
    validateYear(parts);
}

/**
 * Validates the day part of the date to ensure it is within the valid range (1-31).
 * @param {Array<string>} parts - An array containing the day, month, and year parts.
 */
function validateDay(parts) {
    if (parts[0].length === 2) {
        let day = parseInt(parts[0]);
        if (day < 1) parts[0] = '01';
        if (day > 31) parts[0] = '31';
    }
}

/**
 * Validates the month part of the date to ensure it is within the valid range (1-12).
 * @param {Array<string>} parts - An array containing the day, month, and year parts.
 */
function validateMonth(parts) {
    if (parts[1].length === 2) {
        let month = parseInt(parts[1]);
        if (month < 1) parts[1] = '01';
        if (month > 12) parts[1] = '12';
    }
}

/**
 * Validates the year part of the date to ensure it is within a specified range.
 * @param {Array<string>} parts - An array containing the day, month, and year parts.
 */
function validateYear(parts) {
    if (parts[2].length === 4) {
        let year = parseInt(parts[2]);
        if (year < currentYear) parts[2] = currentYear.toString();
        if (year > maxYear) parts[2] = maxYear.toString();
    }
}

/**
 * Formats the date parts into a string in the format DD/MM/YYYY.
 * @param {Array<string>} parts - An array containing the day, month, and year parts.
 * @returns {string} The formatted date string.
 */
function formatDate(parts) {
    return parts.join('/').replace(/\/+$/, '');
}

/**
 * Validates the full date to ensure it forms a valid date.
 */
function validateFullDate() {
    const parts = this.value.split('/');
    if (parts.length === 3 && parts[2].length === 4) {
        const [day, month, year] = parts.map(part => parseInt(part, 10));
        const date = new Date(year, month - 1, day);
    }
}

/** 
 * This function handles window clicks to close the warning dialog if necessary.
 */
function handleWindowClick(event, warningDialog) {
    if (event.target == warningDialog) {
        closeWarningDialog(warningDialog);
    }
}