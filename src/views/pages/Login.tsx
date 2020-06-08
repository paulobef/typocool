import React from "react";
import { jsx } from "@emotion/core";
import SignInForm from "../containers/SignInForm";
import SignUpForm from "../containers/SignUpForm";
import { Spinner } from "sancho";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

/**@jsx jsx */
export default function Login() {
  const { isVerifying } = useSelector((state: RootState) => state.auth);

  return isVerifying ? (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: window.innerHeight,
      }}
    >
      <Spinner size={"lg"} delay={0} label="Booting up Typocool" center />
    </div>
  ) : (
    <div css={{ display: "flex" }}>
      <SignInForm />
      <SignUpForm />
    </div>
  );
}
