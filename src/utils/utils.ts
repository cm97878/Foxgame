import Decimal from 'break_infinity.js'

export function displayDecimal(decimal:Decimal): string {
    if(decimal.eq(0)) {
        return "0";
    }
    if(decimal.lt(1e3)) {
        return decimal.toFixed(2);
    }
    else {
        return decimal.toExponential(2).replace("+","");
    }
}