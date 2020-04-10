import {EditorControl, StyleControl, StyleHandler} from "../pages/NoteEditor";
import {ButtonSize, IconButton, Layer} from "sancho";
import React from "react";
import { jsx } from '@emotion/core'


interface EditorToolbarProps {
    controlsMap: Array<EditorControl>,
    buttonSize?: ButtonSize
}

/** @jsx jsx */
const EditorToolbar = ({    controlsMap,
                            buttonSize } : EditorToolbarProps) => {
    return (
        <Layer css={{
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 5,
            paddingBottom: 5,
            paddingRight: 10,
            paddingLeft: 10,
            marginRight: 30,
            marginTop: 50
        }} elevation="xs">
            { controlsMap.map(({ icon, label, handler }: EditorControl, key: number) =>
                <IconButton
                    variant="ghost"
                    key={key}
                    icon={icon}
                    label={label}
                    size={buttonSize || 'sm'}
                    onClick={handler}
                />) }
        </Layer>

    )
};

export default EditorToolbar
