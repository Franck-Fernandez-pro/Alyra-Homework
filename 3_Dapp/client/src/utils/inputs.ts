export function isAddress (potential_address: string) {
  if (potential_address.slice(0, 2) === "0x" && potential_address.length === 42) {
    return true;
  }
  return false;
};