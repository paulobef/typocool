import React, { Fragment, ReactElement, useRef } from "react";
import { List, ListItem, ScrollView, Skeleton } from "sancho";
import { Link } from "@reach/router";
import { jsx } from "@emotion/core";
import dateDisplayer, { timeDisplayer } from "../../utils/dateDisplayer";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoreNotes } from "../../store/notes/thunks";

export interface NoteListProps {
  list: any;
}

/**@jsx jsx */
function NoteList({ list }: NoteListProps) {
  const dispatch = useDispatch();
  const scrollViewRef = useRef();
  const { status } = useSelector((state: RootState) => state.notes);

  function handleScrollToBottom(event: React.UIEvent) {
    if (
      // @ts-ignore - cause Typescript thinks scrollViewRef.current can be undefined even with scrollViewRef.current !== undefined condition. But it works on screen.
      scrollViewRef.current.scrollHeight - scrollViewRef.current.scrollTop ===
      // @ts-ignore
      scrollViewRef.current.clientHeight
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
          list.map((item: any) => (
            <Link css={{ textDecoration: "none" }} to={"notes/" + item.id}>
              <ListItem
                primary={item.title || "Untitled"}
                secondary={
                  item.lastSaved.isToday()
                    ? timeDisplayer(item.lastSaved)
                    : dateDisplayer(item.lastSaved)
                }
                wrap={false}
              />
            </Link>
          ))
        )}
        {status.isLoadingMore ? (
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
