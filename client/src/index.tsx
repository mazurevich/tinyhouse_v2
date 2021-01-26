import React from "react";
import { render } from "react-dom";
import "./index.css";
// import reportWebVitals from "./reportWebVitals";
import { Listings, NavBar } from "./sections";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  uri: "/api",
});

render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <NavBar />
      <div className="container">
        <Listings title="Tinyhouse title" />
      </div>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
