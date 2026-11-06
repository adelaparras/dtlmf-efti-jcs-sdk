# Open eFTI JCS RFC 8785 Canonicalizer SDK v1.8

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM Version](https://img.shields.io/badge/npm-v1.8.0-CB3837.svg)](https://npmjs.com/)
[![Regulation](https://img.shields.io/badge/eFTI-EU%202020%2F1056-blue.svg)](https://eur-lex.europa.eu/eli/reg/2020/1056/oj)
[![JCS Standard](https://img.shields.io/badge/RFC-8785-green.svg)](https://datatracker.ietf.org/doc/html/rfc8785)

## Overview

**`dtlmf-efti-jcs-sdk`** is a lightweight, zero-overhead TypeScript and JavaScript SDK developed by **Solomon Brokerage OÜ** and **Alejandro De La Parra Solomon** for European freight forwarders, logistics platforms, and eFTI Access Point Gateways.

Under **Regulation (EU) 2020/1056 (eFTI)** and **Regulation (EU) 910/2014 (eIDAS)**, regulatory freight information must be cryptographically anchored to distributed ledgers without leaking commercial trade secrets or sensitive pricing data. This SDK implements strict **JSON Canonicalization Scheme (JCS - RFC 8785)** preprocessing, guaranteeing bit-for-bit identical SHA-256 root digests across diverse programming runtimes (Node.js, Rust/Substrate, Go, Python).

---

## Key Capabilities

- **RFC 8785 Compliance:** Lexicographically sorts object keys, standardizes numeric IEEE 754 representations, removes redundant whitespace, and eliminates escaping discrepancies.
- **On-Chain Digest Preparation:** Produces exact 32-byte (`[u8; 32]`) SHA-256 hashes ready for direct submission to the Polkadot Substrate `pallet-efti-anchor-vc` or EVM oracles.
- **eFTI JSON-LD Schemas:** Out-of-the-box W3C Verifiable Credential and DG MOVE eFTI data models.

---

## Installation

```bash
npm install dtlmf-efti-jcs-sdk
# or
yarn add dtlmf-efti-jcs-sdk
# or
pnpm add dtlmf-efti-jcs-sdk
```

---

## Quickstart Guide

### 1. Ingesting & Canonicalizing Manifests

```typescript
import { generateEFTIDigest, verifyEFTIDigest } from 'dtlmf-efti-jcs-sdk';

// Sample eFTI Transport Document
const eFTIManifest = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://ec.europa.eu/transport/themes/sustainable/efti_en#"
  ],
  "id": "urn:uuid:32566b2f-7643-4247-9d6f-7c6334235245",
  "type": ["VerifiableCredential", "eFTITransportDocument"],
  "issuer": "did:substrate:5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  "issuanceDate": "2026-03-15T08:30:00Z",
  "credentialSubject": {
    "movementId": "EFTI-EU-2026-0098412",
    "carrier": "Solomon Maritime Logistics OÜ",
    "grossMassKg": 42500.5,
    "dangerousGoods": false
  }
};

// 1. Generate Canonical Representation and 32-byte SHA-256 Digest
const { canonicalJson, sha256Hex, sha256Bytes } = generateEFTIDigest(eFTIManifest);

console.log("Canonical Form:", canonicalJson);
console.log("On-Chain Digest (Hex):", `0x${sha256Hex}`);
// Output: 0x9f83c... (ready for pallet-efti-anchor-vc::anchor_document)

// 2. Client-side Verification
const isValid = verifyEFTIDigest(eFTIManifest, sha256Hex);
console.log("Digest Integrity Verified:", isValid); // true
```

### 2. Standalone CLI Usage

Run the bundled CLI helper to inspect any local JSON/JSON-LD file:

```bash
node examples/generate_hash.js ./path/to/freight_manifest.json
```

---

## Substrate On-Chain Anchoring Integration

Once generated, submit the `sha256Bytes` directly via `@polkadot/api`:

```typescript
import { ApiPromise, WsProvider } from '@polkadot/api';
import { generateEFTIDigest } from 'dtlmf-efti-jcs-sdk';

const wsProvider = new WsProvider('ws://127.0.0.1:9944');
const api = await ApiPromise.create({ provider: wsProvider });

const { sha256Bytes } = generateEFTIDigest(manifestPayload);

// Dispatch call to pallet-efti-anchor-vc
const tx = api.tx.eftiAnchorVc.anchorMovement(
  "EFTI-EU-2026-0098412", // movement_id
  sha256Bytes             // 32-byte RFC 8785 root digest
);

await tx.signAndSend(senderAccount, ({ status }) => {
  if (status.isInBlock) {
    console.log(`Document successfully anchored in block: ${status.asInBlock}`);
  }
});
```

---

## License & Attribution

- **Copyright:** © 2026 Solomon Brokerage OÜ & Alejandro De La Parra Solomon. All Rights Reserved.
- **License:** Open-sourced under the [MIT License](LICENSE).
- **Standards Track:** Implements RFC 8785 and Regulation (EU) 2020/1056.
