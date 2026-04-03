import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function RouteChangeTracker({ onChange }) {
  const location = useLocation();
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    onChange?.(location);
  }, [location, onChange]);

  return null;
}
