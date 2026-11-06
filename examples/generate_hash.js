const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const canonicalize = require('canonicalize');

/**
 * CommonJS RFC 8785 Hash Generator Helper
 */
function hashFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const payload = JSON.parse(raw);
  const canonical = canonicalize(payload);
  if (!canonical) {
    throw new Error('Canonicalization failed');
  }
  const hash = crypto.createHash('sha256').update(canonical, 'utf8').digest('hex');
  return { canonical, hash };
}

if (require.main === module) {
  const target = process.argv[2] || path.join(__dirname, '../schemas/efti_transport_document.jsonld');
  console.log(`Processing eFTI payload: ${target}`);
  const { canonical, hash } = hashFile(target);
  console.log('\n--- RFC 8785 Canonical Representation ---');
  console.log(canonical);
  console.log('\n--- 32-Byte SHA-256 Digest ---');
  console.log(`0x${hash}`);
}

module.exports = { hashFile };
