function parseSajuInput(dateStr, timeStr) {
    let year, month, day, hour, minute;

    // Date Parsing (YYMMDD or YYYYMMDD)
    if (dateStr.length === 6) {
        let yy = parseInt(dateStr.substring(0, 2));
        year = (yy > 30 ? 1900 : 2000) + yy;
        month = parseInt(dateStr.substring(2, 4));
        day = parseInt(dateStr.substring(4, 6));
    } else if (dateStr.length === 8) {
        year = parseInt(dateStr.substring(0, 4));
        month = parseInt(dateStr.substring(4, 6));
        day = parseInt(dateStr.substring(6, 8));
    } else {
        return null;
    }

    // Time Parsing (HHMM)
    if (timeStr.length === 4) {
        hour = parseInt(timeStr.substring(0, 2));
        minute = parseInt(timeStr.substring(2, 4));
    } else if (timeStr === "") {
        hour = 0; minute = 0; // Default or handle "unknown"
    } else {
        return null;
    }

    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) return null;
    if (month < 1 || month > 12 || day < 1 || day > 31 || hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

    return { year, month, day, hour, minute };
}

// Test cases
console.log("880427 / 0104 ->", parseSajuInput("880427", "0104"));
console.log("19880427 / 1304 ->", parseSajuInput("19880427", "1304"));
console.log("010101 / 1200 ->", parseSajuInput("010101", "1200"));
console.log("invalid date ->", parseSajuInput("88042", "0104"));
console.log("invalid month ->", parseSajuInput("881327", "0104"));
