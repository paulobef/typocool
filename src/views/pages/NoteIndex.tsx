import React from "react";
import { jsx } from "@emotion/core";
import { Button, Text, IconMoreVertical } from "sancho";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "@reach/router";
import { NoteScreenProps } from "./Note";
import { RootState } from "../../store";
import { createNote } from "../../store/notes/thunks";
import platform from "platform";

/** @jsx jsx */
function NoteIndex(props: NoteScreenProps): JSX.Element {
  const isChrome = platform.name === "Chrome";
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userFirstName = useSelector(
    (state: RootState) => state.user.user.firstName
  );

  function handleNewNote() {
    // we navigate inside the thunk because outside we don't have access to the user.uid
    dispatch(createNote(location.pathname, navigate));
  }

  return (
    <div
      css={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <img
        src={"drawkit-notebook-man-monochrome.svg"}
        alt={"notebook"}
        height={500}
        width={500}
      />
      <div
        css={{
          width: "65%",
          textAlign: "center",
        }}
      >
        <Text variant="h4">
          <strong>Hey {userFirstName}! Welcome to Typocool, man</strong>
        </Text>
        <Text variant="lead">
          It's a place where, like, you know, you can write your opinion, man...
        </Text>
      </div>
      {isChrome ? (
        <div
          css={{
            marginTop: 25,
            width: "65%",
            padding: "25px",
            border: "1px #47d5ad solid",
            borderRadius: "5px",
          }}
        >
          <Text variant="paragraph">
            <strong>FREE TIP!!!</strong>: Go to your Chrome context menu:{" "}
            <IconMoreVertical />, select "More Tools", then click "Create
            Shortcut", check "Open in new Window" and click{" "}
            <strong>Save</strong>.
          </Text>
          <Text variant="paragraph">
            And Voilà, you've just made Typocool a "desktop" app without
            downloading it (make sure you're connected to internet to use it
            though).
          </Text>
        </div>
      ) : null}
      <Button
        css={{ marginTop: 20 }}
        variant="ghost"
        size={"lg"}
        onClick={handleNewNote}
      >
        Create a note
      </Button>
    </div>
  );
}

export default NoteIndex;
