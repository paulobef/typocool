import React, { useEffect, useRef, useState } from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import {IconBold, IconCode, IconItalic, IconList, IconSave, IconXCircle} from "sancho";
import { jsx } from '@emotion/core'
import {navigate, RouteComponentProps, useNavigate} from '@reach/router'
import ToolbarManager from "../components/ToolbarManager";
import EditableTitle from "../components/EditableTitle";
import StylingToolbar from "../components/StylingToolbar";
import '../App.css'
import 'draft-js/dist/Draft.css'
import {useDispatch, useSelector} from "react-redux";
import { RootState } from "../store";
import EditorToolbar from "../components/EditorToolbar";
import { updateNote} from "../store/notes/actions";
import { deleteNoteAndNavigate } from "../store/notes/helpers";
import { Note } from "../store/notes/types";
import NoteIndex from "./NoteIndex";
import {getNoteForEdition} from "../store/editor/thunks";


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
const TypocoolEditor = ({ note }: { note: Note}) =>  {
    const dispatch = useDispatch();
    const { id, title, content } = note;
    const [editorTitle, setEditorTitle] = useState(title)
    const [editorState, setEditorState] = useState(EditorState.createWithContent(content))
    const editorRef = useRef(null);

    useEffect(() => {
        setEditorState(EditorState.createWithContent(content))
        setEditorTitle(title)
    }, [title, content])

    function handleToggleInlineStyle(inlineStyle: string) {
        setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle))
    }

    function handleToggleBlockType(blockType: string) {
        setEditorState(RichUtils.toggleBlockType(editorState, blockType))
    }

    function handleDeleteNote(id: number) {
        deleteNoteAndNavigate(id, '/', { dispatch, navigate })
    }

    const handlePressEnter = (event: React.KeyboardEvent)  => {
        if (event.key === 'Enter') {
            event.preventDefault()
            // @ts-ignore
            editorRef.current.focus()
        }
    }

    function handleSaveNote() {
        if (id) {
            dispatch(updateNote({
                id: id,
                title: editorTitle,
                content: editorState.getCurrentContent()
            }))
        }
    }

    const controlsMap = [
        {
            label: 'save',
            icon: <IconSave/>,
            handler: handleSaveNote
        },
    ];

    if (id) controlsMap.push({ label: 'delete', icon: <IconXCircle/>, handler: () => handleDeleteNote(id)})
    return (
        <div css={{ width: 850, paddingLeft: 50, paddingRight: 50, paddingTop: 20, paddingBottom: 20 }}>
            <ToolbarManager
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
                        value={editorTitle}
                        placeholder={'How to make your own sushi'}
                        onChange={(value) => { setEditorTitle(value)}}
                    />
                }
                editor={
                    <div css={{ width: 750 }}>
                        <Editor ref={editorRef} editorState={editorState} onChange={value => setEditorState(value)} placeholder={'Write down some thoughts...'}/>
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
function NoteEditor(props: NoteScreenProps): JSX.Element {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (props.noteId) {
            dispatch(getNoteForEdition(props.noteId))
        }

    }, [props.noteId]);
    if (!props.noteId) {
        navigate('/');
        return <NoteIndex path={'*'}/>
    }
    return <TypocoolEditor />
}

export default NoteEditor



