import React, { Fragment, ReactElement, useRef } from "react";
import { List, ListItem, ScrollView, Skeleton } from "sancho";
import { Link, useNavigate } from "@reach/router";
import { jsx } from "@emotion/core";
import dateDisplayer, { timeDisplayer } from "../../utils/dateDisplayer";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoreNotes, selectNote } from "../../store/notes/thunks";
import { Note } from "../../store/notes/types";

export interface NoteListProps {
  list: any;
}

/**@jsx jsx */
function NoteList({ list }: NoteListProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const scrollViewRef = useRef();
  const { status, selectedNote } = useSelector(
    (state: RootState) => state.notes
  );
  const { isLoadingMore, isLoadingInit } = status;

  function handleScrollToBottom(event: React.UIEvent) {
    if (isLoadingMore || isLoadingInit) return;
    if (
      // prettier-ignore
      // @ts-ignore - cause Typescript thinks scrollViewRef.current can be undefined even with scrollViewRef.current !== undefined condition. But it works on screen.
      scrollViewRef.current.scrollHeight - scrollViewRef.current.scrollTop === scrollViewRef.current.clientHeight
    ) {
      dispatch(fetchMoreNotes());
    }
  }

  const skeletons = (skeleton: ReactElement) => {
    let elements = [];
    for (let i = 0; i < 10; i++) {
      elements.push(skeleton);
    }
    return elements;
  };

  const sortedList = list.sort((a: Note, b: Note) => {
    if (a.lastSaved.isBefore(b.lastSaved)) {
      return 1;
    } else if (a.lastSaved.isAfter(b.lastSaved)) {
      return -1;
    } else {
      return 0;
    }
  });

  return (
    <ScrollView
      onScroll={handleScrollToBottom}
      innerRef={scrollViewRef}
      overflowX
      overflowY
      style={{ height: window.innerHeight - 200 }}
    >
      <List>
        {status.isLoadingInit ? (
          <Fragment>
            {skeletons(
              <ListItem
                primary={<Skeleton />}
                secondary={<Skeleton />}
                wrap={false}
              />
            )}
          </Fragment>
        ) : (
          sortedList.map((item: any) => (
            <ListItem
              css={{
                borderLeft:
                  selectedNote.id === item.id ? "3px solid #47d5ad" : "",
              }}
              primary={item.title || "Untitled"}
              secondary={
                item.lastSaved.isToday()
                  ? timeDisplayer(item.lastSaved)
                  : dateDisplayer(item.lastSaved)
              }
              wrap={false}
              onClick={() => dispatch(selectNote(item.id, navigate))}
            />
          ))
        )}
        {status.isLoadingMore && !status.loadErrorMore ? (
          <Fragment>
            <ListItem
              primary={<Skeleton />}
              secondary={<Skeleton />}
              wrap={false}
            />
          </Fragment>
        ) : null}
      </List>
    </ScrollView>
  );
}

export default NoteList;
