import React, { forwardRef, Ref} from "react";
import { IconButton, IconBold, Layer } from "sancho";
import { jsx } from '@emotion/core'
import {StyleControl, StyleHandler} from "../pages/NoteEditor";
import { EditorState } from "draft-js";


interface EditorToolbarProps {
    inlineStyleHandler: StyleHandler
    blockTypeHandler: StyleHandler
    editorState: EditorState
    inlineStyles: Array<StyleControl>
    blockTypes: Array<StyleControl>
    buttonSize?: 'xs' | 'sm' | 'md' | 'lg'  | 'xl'
}


/** @jsx jsx */
const StylingToolbar = ({
                           inlineStyleHandler,
                           blockTypeHandler,
                           inlineStyles,
                           blockTypes,
                           buttonSize,
                           editorState }: EditorToolbarProps) => {

    const selection = editorState.getSelection();
    const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
    const currentStyle = editorState.getCurrentInlineStyle();

    const styleMapper = (handler: StyleHandler): (value: StyleControl, index: number) => JSX.Element =>
        ({ icon, label, style }: StyleControl, key: number) =>
            <IconButton
                variant="ghost"
                intent={ style === blockType || currentStyle.has(style) ? 'primary' : 'none'}
                key={key}
                icon={icon}
                label={label}
                size={buttonSize || 'sm'}
                onClick={() => handler(style)}
            />;

    return (
            <Layer css={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: 5,
                paddingBottom: 5,
                paddingRight: 10,
                paddingLeft: 10,
            }} elevation="sm">
                { inlineStyles.map(styleMapper(inlineStyleHandler)) }
                <div css={{ width: 1, height: 20, backgroundColor: '#EEEEEE', alignSelf: 'center', marginLeft: 5, marginRight: 5}} />
                { blockTypes.map(styleMapper(blockTypeHandler)) }
            </Layer>
    )
};


export default StylingToolbar
