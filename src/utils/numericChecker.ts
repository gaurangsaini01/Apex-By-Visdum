export function isNumeric(value: any): boolean {
    return !isNaN(value) && !isNaN(parseFloat(value)) && isFinite(value);
}