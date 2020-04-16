import React from 'react'
import {List, ListItem, ScrollView, IconChevronRight} from "sancho";
import { Link } from '@reach/router'
import { jsx } from '@emotion/core'
import dateDisplayer, {timeDisplayer} from "../utils/dateDisplayer";

export interface NoteListProps {
    list: any
}


/**@jsx jsx */
function NoteList({ list }: NoteListProps) {
    return (
        <ScrollView overflowX style={{ height: window.innerHeight - 200 }}>
            <List >
                {
                    list.map((item: any) =>
                        <Link css={{ textDecoration: 'none' }} to={'notes/' + item.id }>
                            <ListItem contentAfter={<IconChevronRight />}
                                primary={ item.title || 'Untitled'}
                                secondary={item.lastSaved.isToday() ? timeDisplayer(item.lastSaved) : dateDisplayer(item.lastSaved)}
                            >
                            </ListItem>
                        </Link>
                    )
                }
            </List>
        </ScrollView>
    )
}

export default NoteList
