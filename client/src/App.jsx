import React, { Component, useMemo } from "react";
import { ApolloProvider, Query } from "react-apollo";
import { Elements, StripeProvider } from "react-stripe-elements";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactGA from "react-ga";
import Cookies from "js-cookie";

import {
  Redirect,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  withRouter
} from "./lib/routerCompat";
import RouteChangeTracker from "./lib/RouteChangeTracker";

import { getQueryParams } from "./helpers";
import { STRIPE_PUBLISHABLE_KEY } from "./configs";
import client from "./apolloClient";
import { CREATE_PAGE_VIEW_MUTATION, GET_LOGGED_IN_USER_QUERY } from "./Queries";

import Detector from "./components/OnlineDetector/Detector";
import EventListener from "react-event-listener";
import E404 from "./components/E404";
import ForgetPassword from "./components/forgetPassword";
import Home from "./components/home";
import InitialSelectJobModal from "./components/initialSelectJobModal";
import Invoices from "./components/invoices";
import Library from "./components/library";
import Loading from "./components/loading";
import Login from "./components/login";
import Payment from "./components/payment";
import Profile from "./components/profile";
import ResetPassword from "./components/resetPassword";
import SignUp from "./components/signUp";
import SingleApp from "./components/singleApp";
import SingleStory from "./components/singleStory";
import Stories from "./components/stories";

import { AppCategories, UpdateAppCategory } from "./components/admin/appCategories";
import { Apps, UpdateApp } from "./components/admin/apps";
import Dashboard from "./components/admin/dashboard";
import { Jobs, UpdateJob } from "./components/admin/jobs";
import { StoryCategories, UpdateStoryCategory } from "./components/admin/storyCategories";
import { StoryElements, UpdateStoryElement } from "./components/admin/storyElements";
import { AdminStories, UpdateStory } from "./components/admin/stories";
import { Users, UpdateUser } from "./components/admin/users";

const sendPageView = () => {
  let userId;

  try {
    const cache = client.readQuery({
      query: GET_LOGGED_IN_USER_QUERY
    });

    if (cache.getLoggedInUser) {
      userId = cache.getLoggedInUser.id;
    }
  } catch (error) {
    console.log(error);
  }

  client.mutate({
    mutation: CREATE_PAGE_VIEW_MUTATION,
    variables: {
      agent: navigator.userAgent,
      pathname: window.location.pathname,
      user: userId
    }
  });
};

const createHistory = (navigate) => ({
  goBack: () => navigate(-1),
  push: (to) => {
    if (typeof to === "string") {
      navigate(to);
      return;
    }

    navigate(to.pathname || "", {
      state: to.state
    });
  },
  replace: (to) => {
    if (typeof to === "string") {
      navigate(to, { replace: true });
      return;
    }

    navigate(to.pathname || "", {
      replace: true,
      state: to.state
    });
  }
});

const RouteElement = ({ component: RoutedComponent, ...props }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const history = useMemo(() => createHistory(navigate), [navigate]);
  const match = useMemo(
    () => ({
      params,
      path: location.pathname,
      url: location.pathname
    }),
    [location.pathname, params]
  );

  return (
    <RoutedComponent
      {...props}
      history={history}
      location={location}
      match={match}
    />
  );
};

const StripePage = ({ component: RoutedComponent, ...props }) => (
  <Elements>
    <RoutedComponent {...props} />
  </Elements>
);

const AdminRoutes = ({ user }) => {
  if (!user || user.role !== "ADMIN") {
    return <Redirect to="/" />;
  }

  return (
    <Routes>
      <Route element={<Redirect to="/admin/dashboard" />} index />
      <Route element={<Apps user={user} />} path="apps" />
      <Route element={<AdminStories user={user} />} path="stories" />
      <Route element={<StoryCategories user={user} />} path="story_categories" />
      <Route element={<StoryElements user={user} />} path="story_elements" />
      <Route element={<Users user={user} />} path="users" />
      <Route element={<AppCategories user={user} />} path="app_categories" />
      <Route element={<Jobs user={user} />} path="jobs" />
      <Route element={<Dashboard user={user} />} path="dashboard" />
      <Route
        element={<RouteElement component={UpdateAppCategory} user={user} />}
        path="app_category/:id"
      />
      <Route
        element={<RouteElement component={UpdateStoryCategory} user={user} />}
        path="story_category/:id"
      />
      <Route
        element={<RouteElement component={UpdateStoryElement} user={user} />}
        path="story_element/:id"
      />
      <Route
        element={<RouteElement component={UpdateUser} user={user} />}
        path="user/:id"
      />
      <Route
        element={<RouteElement component={UpdateStory} user={user} />}
        path="story/:id"
      />
      <Route
        element={<RouteElement component={UpdateApp} user={user} />}
        path="app/:id"
      />
      <Route
        element={<RouteElement component={UpdateJob} user={user} />}
        path="job/:id"
      />
      <Route element={<Redirect to="/admin/dashboard" />} path="*" />
    </Routes>
  );
};

class _App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_message: "",
      show_messages_register: [],
      user: undefined
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.copiedToClipboardToastId = undefined;
    this.keysState = {};
  }

  componentDidMount() {
    sendPageView();
    ReactGA.initialize();
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  handleKeyDown(event) {
    this.keysState[event.key] = true;

    if (this.keysState.Control && this.keysState.c) {
      if (!this.copiedToClipboardToastId || !toast.isActive(this.copiedToClipboardToastId)) {
        this.copiedToClipboardToastId = toast.success("Copied to clipboard");
      }
    }
  }

  handleKeyUp(event) {
    this.keysState[event.key] = false;
  }

  handleRouteChange(location) {
    const pathname = `${location.pathname}${location.search}`;
    sendPageView();
    ReactGA.pageview(pathname);
    ReactGA.event({
      action: `MovedTo:${location.pathname}`,
      category: "RouteChange",
      label: `User moved to ${location.pathname}`
    });
  }

  render() {
    return (
      <>
        <StripeProvider apiKey={STRIPE_PUBLISHABLE_KEY}>
          <ApolloProvider client={client}>
            <Query query={GET_LOGGED_IN_USER_QUERY}>
              {({ data, error, loading, refetch }) => {
                if (error) {
                  return error.message;
                }

                if (loading || !data || !Object.keys(data).length) {
                  return <Loading style={{ margin: 140 }} />;
                }

                const user = data.getLoggedInUser;

                if (user && !user.logout) {
                  user.logout = async () => {
                    Cookies.set("token", "");
                    this.props.history.push("/");
                    await client.resetStore();
                    refetch();
                  };
                }

                return (
                  <div>
                    <RouteChangeTracker onChange={this.handleRouteChange} />
                    <InitialSelectJobModal
                      closeModal={() => null}
                      modalIsOpen={Boolean(user && !user.job)}
                      user={user}
                    />
                    <Routes>
                      <Route element={<Home refetchApp={refetch} user={user} />} path="/" />
                      <Route
                        element={<Stories client={client} user={user} />}
                        path="/stories"
                      />
                      <Route
                        element={
                          <SignUp
                            refetchApp={async (callback) => {
                              await refetch();
                              callback();
                            }}
                          />
                        }
                        path="/register"
                      />
                      <Route
                        element={
                          !user ? (
                            <Redirect to="/register" />
                          ) : (
                            <StripePage component={Payment} user={user} />
                          )
                        }
                        path="/payment"
                      />
                      <Route
                        element={
                          !user ? (
                            <Redirect to="/login?success=invoices" />
                          ) : (
                            <StripePage component={Invoices} user={user} />
                          )
                        }
                        path="/invoices"
                      />
                      <Route
                        element={
                          (() => {
                            const params = getQueryParams(window.location.href);
                            if (user && params.success) {
                              return <Redirect to={params.success.replace(":", "/")} />;
                            }

                            return user ? <Redirect to="/" /> : <Login refetchApp={refetch} />;
                          })()
                        }
                        path="/login"
                      />
                      <Route
                        element={user ? <Redirect to="/" /> : <ForgetPassword />}
                        path="/forget_password"
                      />
                      <Route
                        element={<RouteElement component={ResetPassword} user={user} />}
                        path="/reset/:token"
                      />
                      <Route
                        element={<RouteElement component={SingleStory} user={user} />}
                        path="/story/:id"
                      />
                      <Route
                        element={
                          user ? (
                            <Profile
                              refetchApp={(to) => {
                                refetch();
                                if (to) {
                                  this.props.history.push(to);
                                }
                              }}
                              user={user}
                            />
                          ) : (
                            <Redirect to="/login?success=profile" />
                          )
                        }
                        path="/profile"
                      />
                      <Route
                        element={
                          user ? (
                            <RouteElement component={Library} user={user} />
                          ) : (
                            <RouteElement
                              component={({ match }) => (
                                <Redirect to={`/login?success=library:${match.params.id}`} />
                              )}
                            />
                          )
                        }
                        path="/library/:id"
                      />
                      <Route
                        element={<RouteElement component={SingleApp} user={user} />}
                        path="/app/:id"
                      />
                      <Route
                        element={<AdminRoutes user={user} />}
                        path="/admin/*"
                      />
                      <Route element={<E404 />} path="*" />
                    </Routes>
                  </div>
                );
              }}
            </Query>
          </ApolloProvider>
        </StripeProvider>

        <Detector>
          {({ online }) => {
            if (!online) {
              toast.error("No internet connection!", { toastId: "InternetError" });
              this.wasDisconnected = true;
            }

            if (online && this.wasDisconnected) {
              toast.success("You are back online!", { toastId: "RECONNECTED" });
              this.wasDisconnected = false;
            }

            return (
              <>
                <EventListener
                  onKeyDown={this.handleKeyDown}
                  onKeyUp={this.handleKeyUp}
                  target="window"
                />
                <ToastContainer autoClose={5000} draggable />
              </>
            );
          }}
        </Detector>
      </>
    );
  }
}

export default withRouter(_App);
