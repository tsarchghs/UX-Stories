import { useEffect } from "react";

const EVENT_MAP = {
  onBlur: "blur",
  onClick: "click",
  onKeyDown: "keydown",
  onKeyUp: "keyup",
  onMouseDown: "mousedown",
  onMouseUp: "mouseup",
  onResize: "resize"
};

const resolveTarget = (target) => {
  if (target === "document") {
    return document;
  }

  if (target === "window" || !target) {
    return window;
  }

  return target;
};

export default function EventListener({ target = "window", ...props }) {
  useEffect(() => {
    const resolvedTarget = resolveTarget(target);

    if (!resolvedTarget || !resolvedTarget.addEventListener) {
      return undefined;
    }

    const subscriptions = Object.entries(EVENT_MAP)
      .filter(([propName]) => typeof props[propName] === "function")
      .map(([propName, eventName]) => {
        const handler = props[propName];
        resolvedTarget.addEventListener(eventName, handler);
        return () => resolvedTarget.removeEventListener(eventName, handler);
      });

    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
    };
  }, [props, target]);

  return null;
}
