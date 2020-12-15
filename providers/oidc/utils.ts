import { promisify } from 'util';

import got from 'got';
import { decode, verify, Secret, VerifyOptions } from 'jsonwebtoken';

const verifyJwt = promisify<string, Secret, VerifyOptions, unknown>(verify);

interface Jwt<T> {
  header: {
    typ: string;
    alg: string;
    kid: string;
  };
  payload: T;
  signature: string;
}

interface Jwk {
  kty: string;
  use: string;
  kid: string;
  x5t: string;
  n: string;
  e: string;
  x5c: string[];
  pem: string | undefined;
}

let publicKeys: Jwk[] = [];
let publicKeysPromise: Promise<Jwk[]> | null = null;

async function getKeys(keysUrl: string): Promise<Jwk[]> {
  const response = await got.get(keysUrl).json<{ keys: Jwk[] }>();
  publicKeys = response.keys;
  publicKeysPromise = null;
  return response.keys;
}

async function ensureKeys(keysUrl: string) {
  if (publicKeys.length > 0) {
    return publicKeys;
  }
  if (!publicKeysPromise) {
    publicKeysPromise = getKeys(keysUrl);
  }
  return publicKeysPromise;
}

// http://stackoverflow.com/questions/18835132/xml-to-pem-in-node-js
// https://github.com/AzureAD/passport-azure-ad/blob/ee2ec66e8d1b393809f846547d36edb24a2fd2c8/lib/aadutils.js
function convertToPem(n: string, e: string): string {
  const modulus = Buffer.from(n, 'base64');
  const exponent = Buffer.from(e, 'base64');

  const modulusHex = prepadSigned(modulus.toString('hex'));
  const exponentHex = prepadSigned(exponent.toString('hex'));

  const modlen = modulusHex.length / 2;
  const explen = exponentHex.length / 2;

  const encodedModlen = encodeLengthHex(modlen);
  const encodedExplen = encodeLengthHex(explen);
  const encodedPubkey = `30${encodeLengthHex(
    modlen + explen + encodedModlen.length / 2 + encodedExplen.length / 2 + 2,
  )}02${encodedModlen}${modulusHex}02${encodedExplen}${exponentHex}`;

  const derB64 = Buffer.from(encodedPubkey, 'hex').toString('base64');

  // derB64 is guaranteed to match the RegExp
  // @ts-ignore
  const pem = `-----BEGIN RSA PUBLIC KEY-----\n${derB64
    .match(/.{1,64}/g)
    .join('\n')}\n-----END RSA PUBLIC KEY-----\n`;

  return pem;
}

function prepadSigned(hexStr: string): string {
  const msb = hexStr[0];
  if (msb < '0' || msb > '7') {
    return `00${hexStr}`;
  }
  return hexStr;
}

function toHex(number: number): string {
  const nstr = number.toString(16);
  if (nstr.length % 2) {
    return `0${nstr}`;
  }
  return nstr;
}

// encode ASN.1 DER length field
// if <=127, short form
// if >=128, long form
function encodeLengthHex(n: number): string {
  if (n <= 127) {
    return toHex(n);
  }
  const nHex = toHex(n);
  const lengthOfLengthByte = 128 + nHex.length / 2; // 0x80+numbytes
  return toHex(lengthOfLengthByte) + nHex;
}

export async function verifyOidcJwt<T>(token: string, keysUrl: string) {
  const decoded = decode(token, { complete: true, json: true }) as Jwt<T>;
  const keys = await ensureKeys(keysUrl);
  const correctKey = keys.find((key) => key.kid === decoded.header.kid);
  if (!correctKey) throw new Error(`could not find key: ${decoded.header.kid}`);

  if (!correctKey.pem) {
    correctKey.pem = convertToPem(correctKey.n, correctKey.e);
  }

  return verifyJwt(token, correctKey.pem, {}) as Promise<T>;
}
