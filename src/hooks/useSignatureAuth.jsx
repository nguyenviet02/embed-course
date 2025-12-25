import React, { useEffect } from "react";
import { createLocalJWKSet, jwtVerify } from "jose";

const jwksUrl = "/api/auth/jwks";

export async function validateJWTString(jwtStr) {
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
    const jwk = createLocalJWKSet(jwksJson);

    const data = await jwtVerify(jwtStr, jwk);

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

const useSignatureAuth = ({ signature }) => {
  const [metadata, setMetadata] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const submitLesson = () => {
    if (!metadata?.user_id) {
      console.error("User ID not found");
      return;
    }
    const message = {
      type: "IFRAME_EVENT",
      payload: {
        event: "lesson_completed",
      },
    };

    window.postMessage(message, "*");
  };

  const submitCourse = () => {
    if (!metadata?.user_id) {
      console.error("User ID not found");
      return;
    }
    const message = {
      type: "IFRAME_EVENT",
      payload: {
        event: "course_completed",
      },
    };

    window.postMessage(message, "*");
  };

  useEffect(() => {
    if (!signature) return;

    const validateSignature = async () => {
      try {
        setLoading(true);
        const response = await validateJWTString(signature);
        console.log("🚀 ~ validateSignature ~ response:", response);
        setMetadata(response?.metadata);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    validateSignature();
  }, [signature]);

  return {
    metadata,
    loading,
    error,
    submitLesson,
    submitCourse,
  };
};

export default useSignatureAuth;
