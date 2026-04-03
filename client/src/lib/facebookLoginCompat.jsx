import React, { useEffect, useState } from "react";

const SCRIPT_ID = "facebook-jssdk";
const SCRIPT_SRC = "https://connect.facebook.net/en_US/sdk.js";

const loadFacebookSdk = (appId) =>
  new Promise((resolve, reject) => {
    if (window.FB) {
      window.FB.init({
        appId,
        cookie: true,
        version: "v22.0",
        xfbml: false
      });
      resolve(window.FB);
      return;
    }

    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.FB), { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    window.fbAsyncInit = () => {
      window.FB.init({
        appId,
        cookie: true,
        version: "v22.0",
        xfbml: false
      });
      resolve(window.FB);
    };

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onerror = reject;
    document.body.appendChild(script);
  });

export default function FacebookLogin({
  appId,
  callback,
  textButton = "Continue with Facebook"
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const resolvedAppId = appId || import.meta.env.VITE_FACEBOOK_APP_ID;

    if (!resolvedAppId) {
      return undefined;
    }

    loadFacebookSdk(resolvedAppId)
      .then(() => {
        if (isMounted) {
          setIsReady(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsReady(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [appId]);

  return (
    <button
      className="button full"
      disabled={!isReady}
      onClick={() => {
        if (!window.FB) {
          return;
        }

        window.FB.login(
          (response) => {
            if (!response?.authResponse?.accessToken) {
              return;
            }

            callback?.({
              accessToken: response.authResponse.accessToken
            });
          },
          { scope: "email,public_profile" }
        );
      }}
      type="button"
    >
      {textButton}
    </button>
  );
}
