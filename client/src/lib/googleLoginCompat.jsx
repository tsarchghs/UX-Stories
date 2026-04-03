import React, { useEffect, useRef, useState } from "react";

const SCRIPT_ID = "google-identity-services";
const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

const loadScript = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve(window.google);
      return;
    }

    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google), { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.head.appendChild(script);
  });

export default function GoogleLogin({
  buttonText = "Continue with Google",
  clientId,
  onFailure,
  onSuccess
}) {
  const tokenClientRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    loadScript()
      .then((google) => {
        if (!isMounted) {
          return;
        }

        tokenClientRef.current = google.accounts.oauth2.initTokenClient({
          client_id: clientId || import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: "openid profile email",
          callback: (response) => {
            if (response?.error) {
              onFailure?.(response);
              return;
            }

            onSuccess?.({ accessToken: response.access_token });
          }
        });
        setIsReady(true);
      })
      .catch((error) => {
        onFailure?.(error);
      });

    return () => {
      isMounted = false;
    };
  }, [clientId, onFailure, onSuccess]);

  return (
    <button
      className="button full"
      disabled={!isReady}
      onClick={() => tokenClientRef.current?.requestAccessToken({ prompt: "consent" })}
      type="button"
    >
      {buttonText}
    </button>
  );
}
