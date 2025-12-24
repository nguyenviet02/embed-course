import { createLocalJWKSet, jwtVerify } from "jose";


export async function validateJWTString(
  jwtStr, //https://api-beta.aicademy.org/auth/jwks
  jwksUrl
) {   
  let jwks;
  try {
    jwks = await fetch(jwksUrl, {
      cf: {
        cacheTtl: 60,
        cacheTtlByStatus: {
          "200-299": 3600,
          "300-599": 0,
        },
        cacheKey: jwksUrl,
      },
    });
    if (!jwks.ok) {
      throw new Error();
    }
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Failed to fetch JWKS");
  }

  let payload;
  try {
    const jwksJson = await jwks.json();
    const jwk = jose.createLocalJWKSet(jwksJson);

    const data = await jose.jwtVerify(jwtStr, jwk);

    payload = data.payload;
    if (!payload.sub) {
      throw new Error("Invalid user ID");
    }
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Invalid JWT string");
  }

  return payload;
}