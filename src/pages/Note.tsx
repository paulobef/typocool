import React, {useEffect, useRef, Fragment, useState} from 'react';
import { EditorState, RichUtils} from 'draft-js';
import Editor from 'draft-js-plugins-editor'
import createInlineToolbarPlugin, {ToolbarChildrenProps} from 'draft-js-inline-toolbar-plugin';
import {
    ItalicButton,
    BoldButton,
    UnorderedListButton, DraftJsButtonProps, DraftJsStyleButtonType,
} from 'draft-js-buttons'
import {IconBold, IconCode, IconItalic, IconList, IconSave, IconXCircle, Skeleton, Text, useTheme} from "sancho";
import { jsx } from '@emotion/core'
import { RouteComponentProps, useNavigate} from '@reach/router'
import '../App.css'
import 'draft-js/dist/Draft.css'
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import {useDispatch, useSelector} from "react-redux";
import { RootState } from "../store";
import NoteToolbar from "../components/NoteToolbar";
import NoteTitle from "../components/NoteTitle";
import NoteIndex from "./NoteIndex";
import {getNoteForEdition} from "../store/editor/thunks";
import {updateLoadedNote, visitLoadedNote} from "../store/editor/actions";
import {deleteNote, updateNote} from "../store/notes/thunks";
import NotFound from "./NotFound";
import dayjs from "dayjs";
import dateDisplayer, {timeDisplayer} from "../utils/dateDisplayer";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import '../styles/inline-toolbar.css'
type Timeout = NodeJS.Timeout;

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

const inlineToolbarPlugin = createInlineToolbarPlugin( {
    theme: {
        toolbarStyles: {
            toolbar: 'inline-toolbar',
        },
        buttonStyles: {
            button: 'inline-toolbar-button',
            buttonWrapper: 'inline-toolbar-button-wrapper',
            active: 'inline-toolbar-button-active',
        },
    },
});
const { InlineToolbar } = inlineToolbarPlugin


/** @jsx jsx */
const NoteEditor = () =>  {
    const dispatch = useDispatch();
    const theme = useTheme()
    const navigate = useNavigate();
    const { editor, visited } = useSelector((state: RootState) => state.editor);
    const {id, title, editorState, lastSaved } = editor
    const { fontSize, fontFamily } = useSelector((state: RootState) => state.settings.settings);
    const { isLoading } = useSelector((state: RootState) => state.editor.status);
    if (!editorState) throw new Error('no editor state')
    const editorRef = useRef(null);


    const [timer, setTimer] = useState()
    const updater = (whatToUpdate: 'title' | 'editor') => (value: EditorState | string): void => {
        clearTimeout(timer)
        setTimer(setTimeout(() => {
            if(id === "") return
            if (!visited) return
            dispatch(updateNote(
                id,
                title,
                editorState.getCurrentContent(),
                dayjs()
            ))
        }, 0))
        dispatch(updateLoadedNote({
            id,
            title: whatToUpdate === 'title' ? value as string : title,
            editorState: whatToUpdate === 'editor' ? value as EditorState  : editorState,
            lastSaved: visited ? dayjs() : lastSaved
        }))
    }
    const handleUpdateTitle = updater("title") as (value: string) => void
    const handleUpdateEditorState = updater("editor") as (value: EditorState) => void


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


    const controlsMap = []; if (id) controlsMap.push(
        {
            label: 'delete',
            icon: <IconXCircle/>,
            handler: handleDeleteNote
        }
    );

    if (isLoading){
        return (
            <div css={{ width: 850, paddingLeft: 50, paddingRight: 50, paddingTop: 20, paddingBottom: 20 }}>
                <div css={{ width: 750, marginLeft: 80, marginTop: 50 }}>
                    <Text variant={'h1'}><Skeleton animated /></Text>
                    <Text css={{ width: 200 }} variant={'subtitle'}><Skeleton animated /></Text>
                </div>
            </div>
        )
    }

    return (
        <div css={{ width: 850, paddingLeft: 50, paddingRight: 50, paddingTop: 20, paddingBottom: 20 }}>
            <div css={ {display: 'flex', flexDirection: 'row'}}>
                <div css={{ alignSelf: 'flex-start', position: 'sticky', top: 0 }}>
                    <NoteToolbar controlsMap={controlsMap} />
                </div>
                <div onClick={() => dispatch(visitLoadedNote())} css={ {display: 'flex', flexDirection: 'column'} }>
                    <div css={{ fontFamily: fontFamily === 'Serif' ? 'Georgia' : theme.fonts.base}}>
                        <NoteTitle
                            onKeyPress={handlePressEnter}
                            value={title}
                            placeholder={'How to make raviolis'}
                            onChange={handleUpdateTitle}
                            date={dateDisplayer(lastSaved)}
                            time={timeDisplayer(lastSaved)}
                        />
                    </div>
                    <div>
                        <div css={{ width: 750, lineHeight: 2, fontSize: fontSize, fontFamily: fontFamily === 'Serif' ? 'Georgia' : theme.fonts.base }}>
                            <Editor
                                ref={editorRef}
                                editorState={editorState}
                                onChange={handleUpdateEditorState}
                                placeholder={'Write down some thoughts...'}
                                plugins={[inlineToolbarPlugin]}
                            />
                            <InlineToolbar children={(externalProps: any): any  => ( // draft-js-plugins typescript support is buggy
                                <div>
                                    <BoldButton {...externalProps} />
                                    <ItalicButton {...externalProps} />
                                    <UnorderedListButton {...externalProps} />
                                </div>)} />

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export interface NoteScreenProps extends RouteComponentProps
{
    noteId?: string;
}

/** @jsx jsx */
function Note(props: NoteScreenProps): JSX.Element {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loadError = useSelector((state: RootState) => state.editor.status.loadError)
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

export default Note



