export function generateDates() {
    const dates = [];
    const today = new Date();
    const oneYear = new Date();
    oneYear.setFullYear(today.getFullYear() + 1);

    for (let d = new Date(today); d <= oneYear; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
    }
    return dates;
}

export function formatDateStr(date) {
    return date.toISOString().split('T')[0];
}

export function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

export function extractNameFromEmail(email) {
    return email.split('@')[0];
}