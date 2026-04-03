import React, { useMemo } from "react";
import {
  CardCvcElement as CardCVCElement,
  CardElement,
  CardExpiryElement,
  CardNumberElement,
  Elements as ModernElements,
  useElements,
  useStripe
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export { CardCVCElement, CardElement, CardExpiryElement, CardNumberElement };

export function StripeProvider({ apiKey, children }) {
  const stripePromise = useMemo(() => (apiKey ? loadStripe(apiKey) : null), [apiKey]);
  return <ModernElements stripe={stripePromise}>{children}</ModernElements>;
}

export function Elements({ children }) {
  return <>{children}</>;
}

const getElementForToken = (elements) => {
  return (
    elements.getElement(CardElement) ||
    elements.getElement(CardNumberElement)
  );
};

export function injectStripe(Component) {
  const WrappedComponent = (props) => {
    const stripe = useStripe();
    const elements = useElements();

    const legacyStripe = useMemo(() => {
      if (!stripe || !elements) {
        return null;
      }

      return {
        ...stripe,
        createToken: async (options = {}) => {
          const element = getElementForToken(elements);
          if (!element) {
            return { error: { message: "Stripe element is not mounted." } };
          }

          return stripe.createToken(element, options);
        }
      };
    }, [elements, stripe]);

    return <Component {...props} elements={elements} stripe={legacyStripe} />;
  };

  WrappedComponent.displayName = `injectStripe(${Component.displayName || Component.name || "Component"})`;
  return WrappedComponent;
}
