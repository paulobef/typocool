import React, {Fragment, useRef} from 'react'
import {List, ListItem, ScrollView, useTheme, Button, Skeleton, useInfiniteScroll} from "sancho";
import { Link } from '@reach/router'
import { jsx } from '@emotion/core'
import dateDisplayer, {timeDisplayer} from "../utils/dateDisplayer";
import {RootState} from "../store";
import {useDispatch, useSelector} from "react-redux";
import {fetchMoreNotes} from "../store/notes/thunks";

export interface NoteListProps {
    list: any
}


/**@jsx jsx */
function NoteList({ list }: NoteListProps) {
    const dispatch = useDispatch();
    const scrollViewRef = useRef()
    const { status } = useSelector((state: RootState) => state.notes)

    function handleScrollToBottom(event: React.UIEvent) {
        // @ts-ignore - cause Typescript thinks scrollViewRef.current can be undefined even with scrollViewRef.current !== undefined condition. But it works on screen.
        if (scrollViewRef.current.scrollHeight - scrollViewRef.current.scrollTop === scrollViewRef.current.clientHeight) {
            dispatch(fetchMoreNotes())
        }


    }
    const loadedNoteId = useSelector((state: RootState) => state.editor.editor.id)
    return (
        <ScrollView onScroll={handleScrollToBottom} innerRef={scrollViewRef} overflowX overflowY style={{ height: window.innerHeight - 200}}>
            <List >
                { status.isLoadingInit ?
                    <Fragment>
                        <ListItem
                            primary={ <Skeleton />}
                            secondary={ <Skeleton />}
                            wrap={false} />
                        <ListItem
                            primary={ <Skeleton />}
                            secondary={ <Skeleton />}
                            wrap={false} />
                        <ListItem
                            primary={ <Skeleton />}
                            secondary={ <Skeleton />}
                            wrap={false} />
                        <ListItem
                            primary={ <Skeleton />}
                            secondary={ <Skeleton />}
                            wrap={false} />
                        <ListItem
                            primary={ <Skeleton />}
                            secondary={ <Skeleton />}
                            wrap={false} />
                        <ListItem
                            primary={ <Skeleton />}
                            secondary={ <Skeleton />}
                            wrap={false} />
                        <ListItem
                            primary={ <Skeleton />}
                            secondary={ <Skeleton />}
                            wrap={false} />
                        <ListItem
                            primary={ <Skeleton />}
                            secondary={ <Skeleton />}
                            wrap={false} />
                        <ListItem
                            primary={ <Skeleton />}
                            secondary={ <Skeleton />}
                            wrap={false} />
                        <ListItem
                            primary={ <Skeleton />}
                            secondary={ <Skeleton />}
                            wrap={false} />
                        <ListItem
                            primary={ <Skeleton />}
                            secondary={ <Skeleton />}
                            wrap={false} />
                        <ListItem
                            primary={ <Skeleton />}
                            secondary={ <Skeleton />}
                            wrap={false} />
                    </Fragment>
                                            :
                    list.map((item: any) =>
                        <Link css={{ textDecoration: 'none' }} to={'notes/' + item.id }>
                            <ListItem
                                css={{ borderLeft: loadedNoteId === item.id ? 'solid #47D5AD 4px' : 'none'}}
                                primary={ item.title || 'Untitled'}
                                secondary={item.lastSaved.isToday() ? timeDisplayer(item.lastSaved) : dateDisplayer(item.lastSaved)}
                                wrap={false}
                            />
                        </Link>
                    )
                }
                { status.isLoadingMore ?
                    <Fragment>
                        <ListItem
                            primary={ <Skeleton />}
                            secondary={ <Skeleton />}
                            wrap={false} />
                    </Fragment>
                    : null }
            </List>
        </ScrollView>
    )
}

export default NoteList
