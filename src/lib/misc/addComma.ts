export function addCommasToNumber(number?: number | string | null): string {
  if (!number && number !== 0) return "";

  // Convert the input to a string
  const numString = number.toString();

  // Split the string into integer and decimal parts
  const parts = numString.split(".");

  // Add commas to the integer part
  parts[0] = parts[0]!.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Combine the integer and decimal parts
  return parts.join(".");
}
