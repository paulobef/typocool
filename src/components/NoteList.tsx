import React from 'react'
import {IconButton, IconX, MenuItem, MenuList, ScrollView} from "sancho";
import { Link } from '@reach/router'
import { jsx } from '@emotion/core'

export interface NoteListProps {
    list: any
}
/**@jsx jsx */
function NoteList({ list }: NoteListProps) {
    return (
        <ScrollView overflowX style={{ height: window.innerHeight - 200 }}>
            <MenuList >
                {
                    list.map((item: any) =>
                        <Link css={{ textDecoration: 'none' }} to={'notes/' + item.id }>
                            <MenuItem >
                                    { item.title || 'Untitled' }
                            </MenuItem>
                        </Link>
                    )
                }
            </MenuList>
        </ScrollView>
    )
}

export default NoteList
