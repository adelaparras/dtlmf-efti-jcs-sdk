/**
 * Core eFTI Interfaces compliant with Regulation (EU) 2020/1056.
 */

export interface CredentialSubject {
  id: string;
  movementId: string;
  carrier?: string;
  shipper?: string;
  consignee?: string;
  placeOfLoading?: string;
  placeOfDelivery?: string;
  grossMassKg?: number;
  dangerousGoods?: boolean;
  [key: string]: unknown;
}

export interface EFTITransportDocument {
  '@context': string | string[] | Record<string, unknown>;
  id: string;
  type: string | string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: CredentialSubject;
  proof?: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    jws?: string;
    proofValue?: string;
  };
}

export interface CanonicalizationResult {
  canonicalJson: string;
  sha256Hex: string;
  sha256Bytes: Uint8Array;
  bytesLength: number;
}
