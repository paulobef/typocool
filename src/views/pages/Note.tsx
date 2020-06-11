import "../../App.css";
import "draft-js/dist/Draft.css";
import "../../styles/inline-toolbar.css";
import "../../styles/emoji.css";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import createEmojiPlugin from "draft-js-emoji-plugin";
import Editor from "draft-js-plugins-editor";
import React, { useRef, useState } from "react";
import { EditorState } from "draft-js";
import {
  BoldButton,
  ItalicButton,
  UnorderedListButton,
} from "draft-js-buttons";
import { IconXCircle, useTheme, Spinner } from "sancho";
import { jsx } from "@emotion/core";
import { RouteComponentProps, useNavigate } from "@reach/router";
import { useDispatch, useSelector } from "react-redux";

import NoteTitle from "../components/NoteTitle";
import NoteIndex from "./NoteIndex";
import dateDisplayer, { timeDisplayer } from "../../utils/dateDisplayer";
import { RootState } from "../../store";
import { updateLoadedNote, visitSelectedNote } from "../../store/notes/actions";
import { deleteNote, updateNote, selectNote } from "../../store/notes/thunks";
import { StrikethroughButton } from "../components/StrikethroughButton";
import { Note as NoteType } from "../../store/notes/types";
import { NoteToolbar } from "../components/NoteToolbar";
import NotFound from "./NotFound";

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
  handler: () => void;
  label: string;
};

// CUSTOM STYLE MAP
const styleMap = {
  STRIKETHROUGH: {
    textDecoration: "line-through",
  },
};

// DRAFTJS PLUGINS //
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
export const emojiTheme = {
  emoji: "emoji",
  emojiSuggestions: "emojiSuggestions",
  emojiSuggestionsEntry: "emojiSuggestionsEntry",
  emojiSuggestionsEntryFocused: "emojiSuggestionsEntryFocused",
  emojiSuggestionsEntryText: "emojiSuggestionsEntryText",
  emojiSuggestionsEntryIcon: "emojiSuggestionsEntryIcon",
  emojiSelect: "emojiSelect",
  emojiSelectButton: "emojiSelectButton",
  emojiSelectButtonPressed: "emojiSelectButtonPressed",
  emojiSelectPopover: "emojiSelectPopover",
  emojiSelectPopoverClosed: "emojiSelectPopoverClosed",
  emojiSelectPopoverTitle: "emojiSelectPopoverTitle",
  emojiSelectPopoverGroups: "emojiSelectPopoverGroups",
  emojiSelectPopoverGroup: "emojiSelectPopoverGroup",
  emojiSelectPopoverGroupTitle: "emojiSelectPopoverGroupTitle",
  emojiSelectPopoverGroupList: "emojiSelectPopoverGroupList",
  emojiSelectPopoverGroupItem: "emojiSelectPopoverGroupItem",
  emojiSelectPopoverToneSelect: "emojiSelectPopoverToneSelect",
  emojiSelectPopoverToneSelectList: "emojiSelectPopoverToneSelectList",
  emojiSelectPopoverToneSelectItem: "emojiSelectPopoverToneSelectItem",
  emojiSelectPopoverEntry: "emojiSelectPopoverEntry",
  emojiSelectPopoverEntryFocused: "emojiSelectPopoverEntryFocused",
  emojiSelectPopoverEntryIcon: "emojiSelectPopoverEntryIcon",
  emojiSelectPopoverNav: "emojiSelectPopoverNav",
  emojiSelectPopoverNavItem: "emojiSelectPopoverNavItem",
  emojiSelectPopoverNavEntry: "emojiSelectPopoverNavEntry",
  emojiSelectPopoverNavEntryActive: "emojiSelectPopoverNavEntryActive",
  emojiSelectPopoverScrollbar: "emojiSelectPopoverScrollbar",
  emojiSelectPopoverScrollbarThumb: "emojiSelectPopoverScrollbarThumb",
};
const emojiPlugin = createEmojiPlugin({
  theme: emojiTheme,
});
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const { InlineToolbar } = inlineToolbarPlugin;

/** @jsx jsx */
const NoteEditor = ({ note }: { note: NoteType }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  if (!note) throw new Error("no note data");
  const { id, title, state, lastSaved, authorId, version } = note;
  const { fontSize, fontFamily } = useSelector(
    (state: RootState) => state.settings.settings
  );
  const { visited } = useSelector(
    (state: RootState) => state.notes.selectedNote
  );
  if (!state) throw new Error("no editor state");
  const editorRef = useRef(null);

  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const updater = (whatToUpdate: "title" | "editor") => (
    value: EditorState | string
  ): void => {
    dispatch(
      updateLoadedNote({
        id,
        authorId,
        title: whatToUpdate === "title" ? (value as string) : title,
        state: whatToUpdate === "editor" ? (value as EditorState) : state,
        lastSaved: !visited ? lastSaved : dayjs(),
        version: version + 1,
      })
    );
    if (timer) clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        if (id === "") return;
        dispatch(
          updateNote(
            id,
            title,
            state.getCurrentContent(),
            !visited ? lastSaved : dayjs(),
            version + 1
          )
        );
      }, 0)
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
      handler: function handleDeleteNote(): void {
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
        <div
          css={{
            alignSelf: "flex-start",
            position: "sticky",
            top: 0,
          }}
        >
          <NoteToolbar moreControls={controlsMap} controls={<EmojiSelect />} />
        </div>
        <div
          css={{ display: "flex", flexDirection: "column" }}
          onClick={() => dispatch(visitSelectedNote())}
        >
          <div
            css={{
              fontFamily: fontFamily === "Serif" ? "Georgia" : theme.fonts.base,
            }}
          >
            <NoteTitle
              onKeyPress={handlePressEnter}
              value={title}
              placeholder={"A nice title here..."}
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
                css={{ zIndex: 1 }}
                ref={editorRef}
                customStyleMap={styleMap}
                editorState={state}
                onChange={handleUpdateEditorState}
                placeholder={"Write down some thoughts..."}
                plugins={[inlineToolbarPlugin, emojiPlugin]}
              />
              <InlineToolbar
                children={(
                  externalProps: any
                ): any => ( // draft-js-plugins typescript support is buggy
                  <div>
                    <BoldButton {...externalProps} />
                    <ItalicButton {...externalProps} />
                    <StrikethroughButton {...externalProps} />
                    <UnorderedListButton {...externalProps} />
                  </div>
                )}
              />
              <EmojiSuggestions />
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
function Note(props: NoteScreenProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notes, selectedNote } = useSelector(
    (state: RootState) => state.notes
  );
  const note = notes.find(
    (note: NoteType): boolean => note.id === props.noteId
  );
  const status = useSelector((state: RootState) => state.notes.status);

  if (!props.noteId) {
    navigate("/");
    return <NoteIndex path={"*"} />;
  } else {
    if (selectedNote.id === "") {
      dispatch(selectNote(props.noteId, navigate));
    }
    if (status.isLoadingEditor) {
      return (
        <div
          css={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: window.innerHeight,
          }}
        >
          <Spinner size={"lg"} delay={0} center />
        </div>
      );
    }
    if (status.loadErrorEditor) {
      return <NotFound />;
    }
    if (note && note.id === selectedNote.id) {
      return <NoteEditor note={note} />;
    }
    return <NotFound />;
  }
}

export default Note;
