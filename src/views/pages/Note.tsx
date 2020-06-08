import React, { useEffect, useRef, useState } from "react";
import { EditorState } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import {
  ItalicButton,
  BoldButton,
  UnorderedListButton,
} from "draft-js-buttons";
import { IconXCircle, Skeleton, Text, useTheme } from "sancho";
import { jsx } from "@emotion/core";
import { RouteComponentProps, useNavigate } from "@reach/router";
import "../../App.css";
import "draft-js/dist/Draft.css";
import "draft-js-inline-toolbar-plugin/lib/plugin.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import NoteToolbar from "../components/NoteToolbar";
import NoteTitle from "../components/NoteTitle";
import NoteIndex from "./NoteIndex";
import { updateLoadedNote } from "../../store/notes/actions";
// import { updateLoadedNote, visitLoadedNote } from "../../store/editor/actions";
import { deleteNote, updateNote } from "../../store/notes/thunks";
import NotFound from "./NotFound";
import dayjs from "dayjs";
import dateDisplayer, { timeDisplayer } from "../../utils/dateDisplayer";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import "../../styles/inline-toolbar.css";
import { StrikethroughButton } from "../components/StrikethroughButton";
import { Note as NoteType } from "../../store/notes/types";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(relativeTime);

export type StyleHandler = (style: string) => void;

export type StyleControl = {
  label: string;
  style: string;
  icon: React.ComponentElement<null, any>;
};

export type EditorControl = {
  icon: React.ComponentElement<null, any>;
  handler: (event: React.MouseEvent) => void;
  label: string;
};

const styleMap = {
  STRIKETHROUGH: {
    textDecoration: "line-through",
  },
};

const inlineToolbarPlugin = createInlineToolbarPlugin({
  theme: {
    toolbarStyles: {
      toolbar: "inline-toolbar",
    },
    buttonStyles: {
      button: "inline-toolbar-button",
      buttonWrapper: "inline-toolbar-button-wrapper",
      active: "inline-toolbar-button-active",
    },
  },
});
const { InlineToolbar } = inlineToolbarPlugin;

/** @jsx jsx */
const NoteEditor = ({ noteId }: { noteId: string }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const note = useSelector((state: RootState) =>
    state.notes.notes.find((note: NoteType): boolean => note.id === noteId)
  );
  if (!note) throw new Error("no note data");
  const { id, title, state, lastSaved, authorId, version } = note;
  const { fontSize, fontFamily } = useSelector(
    (state: RootState) => state.settings.settings
  );
  if (!state) throw new Error("no editor state");
  const editorRef = useRef(null);

  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const updater = (whatToUpdate: "title" | "editor") => (
    value: EditorState | string
  ): void => {
    if (timer) clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        if (id === "") return;
        dispatch(
          updateNote(id, title, state.getCurrentContent(), dayjs(), version + 1)
        );
      }, 0)
    );
    dispatch(
      updateLoadedNote({
        id,
        authorId,
        title: whatToUpdate === "title" ? (value as string) : title,
        state: whatToUpdate === "editor" ? (value as EditorState) : state,
        lastSaved: dayjs(),
        version: version + 1,
      })
    );
  };
  const handleUpdateTitle = updater("title") as (value: string) => void;
  const handleUpdateEditorState = updater("editor") as (
    value: EditorState
  ) => void;

  const handlePressEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // @ts-ignore
      editorRef.current.focus();
    }
  };

  const controlsMap = [];
  if (id) {
    controlsMap.push({
      label: "Delete",
      icon: <IconXCircle />,
      handler: function handleDeleteNote() {
        dispatch(deleteNote(id));
        navigate("/");
      },
    });
  } else {
    console.log("no id");
  }

  return (
    <div
      css={{
        width: 850,
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 20,
        paddingBottom: 20,
      }}
    >
      <div css={{ display: "flex", flexDirection: "row" }}>
        <div css={{ alignSelf: "flex-start", position: "sticky", top: 0 }}>
          <NoteToolbar controlsMap={controlsMap} />
        </div>
        <div css={{ display: "flex", flexDirection: "column" }}>
          <div
            css={{
              fontFamily: fontFamily === "Serif" ? "Georgia" : theme.fonts.base,
            }}
          >
            <NoteTitle
              onKeyPress={handlePressEnter}
              value={title}
              placeholder={"How to make raviolis"}
              onChange={handleUpdateTitle}
              date={dateDisplayer(lastSaved)}
              time={timeDisplayer(lastSaved)}
            />
          </div>
          <div>
            <div
              css={{
                width: 750,
                lineHeight: 2,
                fontSize: fontSize,
                fontFamily:
                  fontFamily === "Serif" ? "Georgia" : theme.fonts.base,
              }}
            >
              <Editor
                ref={editorRef}
                customStyleMap={styleMap}
                editorState={state}
                onChange={handleUpdateEditorState}
                placeholder={"Write down some thoughts..."}
                plugins={[inlineToolbarPlugin]}
              />
              <InlineToolbar
                children={(
                  externalProps: any
                ): any => ( // draft-js-plugins typescript support is buggy
                  <div>
                    <BoldButton {...externalProps} />
                    <ItalicButton {...externalProps} />
                    <UnorderedListButton {...externalProps} />
                    <StrikethroughButton {...externalProps} />
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface NoteScreenProps extends RouteComponentProps {
  noteId?: string;
}

/** @jsx jsx */
function Note(props: NoteScreenProps): JSX.Element {
  const navigate = useNavigate();

  if (!props.noteId) {
    navigate("/");
    return <NoteIndex path={"*"} />;
  }
  return <NoteEditor noteId={props.noteId} />;
}

export default Note;
