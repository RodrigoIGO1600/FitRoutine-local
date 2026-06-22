export function createTempId(): string {
  const cryptoObj = globalThis.crypto;

  // crypto.randomUUID only exists in secure contexts (HTTPS or localhost).
  // On a phone the app is served over plain http://<LAN_IP>, which is not a
  // secure context, so we fall back to options that work everywhere.
  if (cryptoObj?.randomUUID) {
    return `temp_${cryptoObj.randomUUID().replace(/-/g, "")}`;
  }

  if (cryptoObj?.getRandomValues) {
    const bytes = new Uint8Array(16);
    cryptoObj.getRandomValues(bytes);
    return `temp_${Array.from(bytes, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("")}`;
  }

  return `temp_${Date.now().toString(16)}${Math.random()
    .toString(16)
    .slice(2, 12)}`;
}

export function isTempId(id: string): boolean {
  return id.startsWith("temp_");
}
