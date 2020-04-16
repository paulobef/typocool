import React, { useEffect, useRef, useState } from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import {IconBold, IconCode, IconItalic, IconList, IconSave, IconXCircle} from "sancho";
import { jsx } from '@emotion/core'
import { RouteComponentProps, useNavigate} from '@reach/router'
import ToolbarManager from "../components/ToolbarManager";
import EditableTitle from "../components/EditableTitle";
import StylingToolbar from "../components/StylingToolbar";
import '../App.css'
import 'draft-js/dist/Draft.css'
import {useDispatch, useSelector} from "react-redux";
import { RootState } from "../store";
import EditorToolbar from "../components/EditorToolbar";
import NoteIndex from "./NoteIndex";
import {getNoteForEdition} from "../store/editor/thunks";
import {updateLoadedNote} from "../store/editor/actions";
import {deleteNote, updateNote} from "../store/notes/thunks";
import NotFound from "./NotFound";
import dayjs from "dayjs";
import dateDisplayer, {timeDisplayer} from "../utils/dateDisplayer";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
// @ts-ignore
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(relativeTime)




export type StyleHandler = (style: string) => void

export type StyleControl = {
    label: string
    style: string
    icon: React.ComponentElement<null, any>
}

export type EditorControl = {
    icon: React.ComponentElement<null, any>
    handler: (event: React.MouseEvent) => void
    label: string
}

const INLINE_STYLES: Array<StyleControl> = [
    {
        label: 'Bold',
        style: 'BOLD',
        icon: <IconBold/>
    },
    {
        label: 'Italic',
        style: 'ITALIC',
        icon: <IconItalic/>
    }
]
const BLOCK_TYPES: Array<StyleControl> = [
    {
        label: 'Unordered List Item',
        style: 'unordered-list-item',
        icon: <IconList/>
    },
    {
        label: 'Code Block',
        style: 'code-block',
        icon: <IconCode/>
    },

];

/** @jsx jsx */
const NoteEditor = () =>  {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id, title, editorState, lastSaved } = useSelector((state: RootState) => state.editor);
    if (!editorState) throw new Error('no editor state')
    const editorRef = useRef(null);

    function handleUpdateTitle(value: string) {
        dispatch(updateLoadedNote({
            id,
            title: value,
            editorState,
            lastSaved
        }))
    }

    function handleUpdateEditorState(value: EditorState) {
        dispatch(updateLoadedNote({
            id,
            title,
            editorState: value,
            lastSaved
        }))
    }

    function handleToggleInlineStyle(inlineStyle: string) {
        dispatch(updateLoadedNote({
            id,
            title,
            editorState: RichUtils.toggleInlineStyle(editorState, inlineStyle),
            lastSaved
        }))
    }

    function handleToggleBlockType(blockType: string) {
        dispatch(updateLoadedNote({
            id,
            title,
            editorState: RichUtils.toggleBlockType(editorState, blockType),
            lastSaved
        }))
    }

    function handleDeleteNote() {
        dispatch(deleteNote(id))
        navigate('/')
    }

    const handlePressEnter = (event: React.KeyboardEvent)  => {
        if (event.key === 'Enter') {
            event.preventDefault();
            // @ts-ignore
            editorRef.current.focus()
        }
    }

    function handleSaveNote() {
        dispatch(updateNote(id, title, editorState.getCurrentContent(), dayjs()))
        dispatch(updateLoadedNote({
            id,
            title,
            editorState,
            lastSaved: dayjs()
        }));
    }

    const controlsMap = [
        {
            label: 'save',
            icon: <IconSave/>,
            handler: handleSaveNote
        },
    ];

    if (id) controlsMap.push({ label: 'delete', icon: <IconXCircle/>, handler: handleDeleteNote});
    return (
        <div css={{ width: 850, paddingLeft: 50, paddingRight: 50, paddingTop: 20, paddingBottom: 20 }}>
            <ToolbarManager
                editorState={editorState}
                onKeyPress={handlePressEnter}
                flyingToolbar={
                    <StylingToolbar
                        editorState={editorState}
                        inlineStyleHandler={handleToggleInlineStyle}
                        blockTypeHandler={handleToggleBlockType}
                        inlineStyles={INLINE_STYLES}
                        blockTypes={BLOCK_TYPES}
                    />
                }
                fixedToolbar={
                    <EditorToolbar
                        controlsMap={controlsMap}
                    />
                }
                title={
                    <EditableTitle
                        value={title}
                        placeholder={'How to make your own sushi'}
                        onChange={handleUpdateTitle}
                        date={dateDisplayer(lastSaved)}
                        time={timeDisplayer(lastSaved)}
                    />
                }
                editor={
                    <div css={{ width: 750 }}>
                        <Editor ref={editorRef} editorState={editorState} onChange={handleUpdateEditorState} placeholder={'Write down some thoughts...'}/>
                    </div>
                }
            />
        </div>
    );
}

export interface NoteScreenProps extends RouteComponentProps
{
    noteId?: string;
}

/** @jsx jsx */
function NoteScreen(props: NoteScreenProps): JSX.Element {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loadError = useSelector((state: RootState) => state.editor.loadError)
    useEffect(() => {
        if (props.noteId) {
            dispatch(getNoteForEdition(props.noteId))
        }

    }, [dispatch, props.noteId]);

    if (!props.noteId) {
        navigate('/');
        return <NoteIndex path={'*'}/>
    } else if (loadError) {
        return <NotFound />
    }
    return <NoteEditor />
}

export default NoteScreen



