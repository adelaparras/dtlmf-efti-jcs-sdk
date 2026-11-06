import { createHash } from 'crypto';
import canonicalize from 'canonicalize';
import { EFTITransportDocument, CanonicalizationResult } from './types';

/**
 * Canonicalizes an eFTI JSON / JSON-LD document in accordance with RFC 8785 (JCS).
 * @param document Any valid JavaScript object or eFTI document payload.
 * @returns Deterministic canonical JSON string.
 */
export function canonicalizeDocument(document: unknown): string {
  const result = canonicalize(document);
  if (result === undefined) {
    throw new Error('JCS Canonicalization failed: invalid JSON payload or circular references detected');
  }
  return result;
}

/**
 * Computes the deterministic SHA-256 digest of an eFTI document after RFC 8785 canonicalization.
 * Ready for on-chain anchoring into Substrate pallet-efti-anchor-vc.
 *
 * @param document Any eFTI document or JavaScript object payload.
 * @returns CanonicalizationResult with canonical string and 32-byte SHA-256 digests.
 */
export function generateEFTIDigest(document: EFTITransportDocument | unknown): CanonicalizationResult {
  const canonicalJson = canonicalizeDocument(document);
  
  const hasher = createHash('sha256');
  hasher.update(canonicalJson, 'utf8');
  const digestBuffer = hasher.digest();
  
  const sha256Hex = digestBuffer.toString('hex');
  const sha256Bytes = new Uint8Array(digestBuffer);

  return {
    canonicalJson,
    sha256Hex,
    sha256Bytes,
    bytesLength: Buffer.byteLength(canonicalJson, 'utf8')
  };
}

/**
 * Verifies if an existing SHA-256 hex digest matches the RFC 8785 canonicalization of a document.
 */
export function verifyEFTIDigest(document: unknown, expectedHexDigest: string): boolean {
  const result = generateEFTIDigest(document);
  return result.sha256Hex.toLowerCase() === expectedHexDigest.toLowerCase().replace(/^0x/, '');
}

export * from './types';
