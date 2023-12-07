import Decimal from 'break_infinity.js'

export function displayDecimal(decimal:Decimal): string {
    return decimal.toString().replace("+","")
}