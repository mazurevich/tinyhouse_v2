import React, { useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import { Layout, Typography, Spin, Card } from "antd";
import { ErrorBanner } from "../../lib/components";
import { Viewer } from "../../lib/types";
import { LOG_IN } from "../../lib/graphql/mutations";
import {
  LogIn as LoginInData,
  LogInVariables,
} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import { AUTH_URL } from "../../lib/graphql/queries";
import { AuthUrl as AuthUrlData } from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";
import {
  displayErrorMessage,
  displaySuccessNotification,
} from "../../lib/utils";

// resources
import googleLogo from "./assets/google_logo.jpg";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  setViewer: (viewer: Viewer) => void;
}

export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();
  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError },
  ] = useMutation<LoginInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);
        displaySuccessNotification("You've successfully logged in!");
      }
    },
  });

  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL,
      });
      window.location.href = data.authUrl;
    } catch (error) {
      displayErrorMessage(
        "Sorry! We weren't able to log you in. Please try again later."
      );
      console.log(`Failed`);
    }
  };

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..." />
      </Content>
    );
  }

  if (logInData?.logIn) {
    const { id: viewerId } = logInData.logIn;
    return <Redirect to={`/user/${viewerId}`} />;
  }

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner message="Sorry! We weren't able to log you in. Please try again later." />
  ) : null;

  return (
    <Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👏
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Title>
          <Text> Sign in with Google to start booking available rentals!</Text>
          <button
            onClick={handleAuthorize}
            type="button"
            className="log-in-card__google-button"
          >
            <img
              src={googleLogo}
              alt="Google Logo"
              className="log-in-card__google-button-logo"
            />
            <span className="log-in-card__google-button-text">
              Sing in with Google
            </span>
          </button>
          <Text type="secondary">
            Note: By signing in, you'll be redirected to the Google consent form
            to sign in with your Google account
          </Text>
        </div>
      </Card>
    </Content>
  );
};