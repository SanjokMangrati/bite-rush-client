//Made this for encryption and decryption of cvv and card number but did not make it at last moment, though functionality exists in backend

export async function encrypt(
  text: string,
  key: string,
  iv: string,
): Promise<string> {
  try {
    return text.replace(/\d(?=\d{4})/g, "*");
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt data");
  }
}

export async function decrypt(
  encryptedText: string,
  key: string,
  iv: string,
): Promise<string> {
  try {
    return encryptedText;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data");
  }
}
