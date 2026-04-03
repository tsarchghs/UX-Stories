const DEFAULT_API_URI = "http://localhost:4000/";
const DEFAULT_GOOGLE_CLIENT_ID =
  "1039054242322-stv546o8fp15utap8tv7630rr4h8p9cl.apps.googleusercontent.com";
const DEFAULT_FACEBOOK_APP_ID = "2450303615182439";
const DEFAULT_STRIPE_PUBLISHABLE_KEY = "pk_test_N1sdoxQTHRHokGxvtutLWw0x00HDZ2RDsi";

const normalizeBaseUrl = (value) => value.replace(/\/+$/, "");

const URI = import.meta.env.VITE_API_URI || DEFAULT_API_URI;
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;
const FACEBOOK_APP_ID =
  import.meta.env.VITE_FACEBOOK_APP_ID || DEFAULT_FACEBOOK_APP_ID;
const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || DEFAULT_STRIPE_PUBLISHABLE_KEY;
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";
const WS_URI = normalizeBaseUrl(URI).replace(/^http/i, "ws");

export {
  FACEBOOK_APP_ID,
  GA_MEASUREMENT_ID,
  GOOGLE_CLIENT_ID,
  STRIPE_PUBLISHABLE_KEY,
  URI,
  WS_URI
};
