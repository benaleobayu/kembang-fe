import Decimal from "decimal.js";

export function getDistanceAsDecimal(distanceText) {
    const distanceValue = distanceText.split(" ")[0];  // Ambil bagian angka dari "7.0 km"
    return new Decimal(distanceValue);  // Gunakan BigDecimal untuk mengonversinya
}
