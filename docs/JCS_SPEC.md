# JCS RFC 8785 Canonicalizer Specification

## Canonicalization Rules
1. **Lexicographical Key Sorting**: Keys sorted UTF-16 code unit order.
2. **Whitespace Elimination**: Zero insignificant whitespace outside string literals.
3. **Number Serialization**: IEEE 754 double precision floating point representation per ECMAScript standard.
4. **Digest Output**: SHA-256 hex string anchoring digest for eFTI data exchange.
