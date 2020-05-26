import {EditorControl} from "../pages/Note";
import {ButtonSize, IconButton, IconMoreVertical, MenuItem, MenuList, ResponsivePopover} from "sancho";
import React from "react";
import { jsx } from '@emotion/core'


interface EditorToolbarProps {
    controlsMap: Array<EditorControl>,
    buttonSize?: ButtonSize
}

/** @jsx jsx */
const NoteToolbar = ({    controlsMap,
                            buttonSize } : EditorToolbarProps) => {
    return (
        <div css={{
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 5,
            paddingBottom: 5,
            paddingRight: 10,
            paddingLeft: 10,
            marginRight: 30,
            marginTop: 50
        }} >
            <ResponsivePopover
                content={
                    <MenuList>
                        { controlsMap.map(({ icon, label, handler }: EditorControl, key: number) =>
                            <MenuItem key={key} contentBefore={icon} component="a" onClick={handler}>
                                {label}
                            </MenuItem>) }
                    </MenuList>
                }
                placement={'left'}
            >
                <IconButton variant="ghost" icon={<IconMoreVertical />} label="show more" />
            </ResponsivePopover>
        </div>

    )
};

export default NoteToolbar
