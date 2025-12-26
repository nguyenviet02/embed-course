import React, { useEffect } from "react";
import { createLocalJWKSet, jwtVerify, JWTPayload } from "jose";

const jwksUrl = "/api/auth/jwks";

export interface UserMetadata {
  course_id: string;
  name: string;
  user_email: string;
  user_id: string;
  user_points: number;
}

export interface jwksResponse extends JWTPayload {
  metadata?: UserMetadata;
}

export async function validateJWTString(jwtStr: string): Promise<jwksResponse> {
  let jwks;
  try {
    jwks = await fetch(jwksUrl);
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

const useSignatureAuth = ({ signature }: { signature: string }) => {
  const [metadata, setMetadata] = React.useState<UserMetadata | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);

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
    console.log("🚀 ~ submitLesson ~ message:", message);

    window.parent.postMessage(message, "*");
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
    console.log("🚀 ~ submitCourse ~ message:", message);

    window.parent.postMessage(message, "*");
  };

  useEffect(() => {
    if (!signature) return;

    const validateSignature = async () => {
      try {
        setLoading(true);
        const response = await validateJWTString(signature);
        if (!response?.metadata) {
          throw new Error("Invalid JWT string");
        }
        setMetadata(response?.metadata);
      } catch (err: Error | unknown) {
        setError(err as Error);
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
