import React, { useMemo } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

export * from "react-router-dom";

const getNavigationTarget = (to) => {
  if (typeof to === "string") {
    return to;
  }

  return `${to.pathname || ""}${to.search || ""}${to.hash || ""}`;
};

const navigateWithState = (navigate, to, replace = false) => {
  navigate(getNavigationTarget(to), {
    replace,
    state: typeof to === "string" ? undefined : to.state
  });
};

export function withRouter(Component) {
  const WrappedComponent = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const history = useMemo(
      () => ({
        push: (to) => navigateWithState(navigate, to),
        replace: (to) => navigateWithState(navigate, to, true),
        goBack: () => navigate(-1)
      }),
      [navigate]
    );

    const match = useMemo(
      () => ({
        params,
        path: location.pathname,
        url: location.pathname
      }),
      [location.pathname, params]
    );

    return (
      <Component
        {...props}
        history={history}
        location={location}
        match={match}
        navigate={navigate}
        params={params}
      />
    );
  };

  WrappedComponent.displayName = `withRouter(${Component.displayName || Component.name || "Component"})`;
  return WrappedComponent;
}

export function Redirect({ push = false, to }) {
  return <Navigate replace={!push} to={to} />;
}
