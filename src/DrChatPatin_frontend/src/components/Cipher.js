// --- Funciones Auxiliares para Hexadecimal ---

function arrayBufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToArrayBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
}

// --- Configuración de Cifrado ---

const ALGORITMO = 'AES-CBC';
const B = process.env.KEY;

const KEY_BYTES = new Uint8Array(B); // Clave de 256 bits (32 bytes)
const IV_BYTES = window.crypto.getRandomValues(new Uint8Array(16));  // IV de 128 bits (16 bytes)

let cryptoKey;

async function setupCryptoKey() {
  if (!cryptoKey) {
    cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      KEY_BYTES,
      { name: ALGORITMO, length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }
  return cryptoKey;
}

/**
 * Cifra un texto usando la Web Crypto API.
 * @param {string} password - El texto plano a cifrar.
 * @returns {Promise<object>} Un objeto con el iv y el texto encriptado en formato hexadecimal.
 */
export async function Encrypt(password) {
  const key = await setupCryptoKey();
  const encodedText = new TextEncoder().encode(password);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: ALGORITMO,
      iv: IV_BYTES
    },
    key,
    encodedText
  );

  return {
    iv: arrayBufferToHex(IV_BYTES),
    encripted: arrayBufferToHex(encryptedBuffer)
  };
}

/**
 * Descifra datos usando la Web Crypto API.
 * @param {object} encryptedData - Un objeto con { iv, encripted } en formato hexadecimal.
 * @returns {Promise<string>} El texto plano descifrado.
 */
export async function Decrypt(encryptedData) {
  const key = await setupCryptoKey();

  const iv = hexToArrayBuffer(encryptedData.iv);
  const encryptedContent = hexToArrayBuffer(encryptedData.encripted);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: ALGORITMO,
      iv: iv
    },
    key,
    encryptedContent
  );

  return new TextDecoder().decode(decryptedBuffer);
}