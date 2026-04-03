import ReactGA4 from "react-ga4";

let initialized = false;

const getMeasurementId = () => import.meta.env.VITE_GA_MEASUREMENT_ID;

const ensureInitialized = () => {
  const measurementId = getMeasurementId();

  if (!measurementId || initialized) {
    return Boolean(measurementId);
  }

  ReactGA4.initialize(measurementId);
  initialized = true;
  return true;
};

const pageview = (path) => {
  if (!ensureInitialized()) {
    return;
  }

  ReactGA4.send({ hitType: "pageview", page: path });
};

const event = (payload) => {
  if (!ensureInitialized()) {
    return;
  }

  ReactGA4.event(payload);
};

const initialize = () => {
  ensureInitialized();
};

export default {
  initialize,
  pageview,
  event
};
