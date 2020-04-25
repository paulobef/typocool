import React, {useEffect, useRef, useState, ReactElement, forwardRef, Ref} from "react";
import { jsx } from '@emotion/core'
import {EditorState, getVisibleSelectionRect} from "draft-js";
import {Portal} from "sancho";


type ToolbarState = {
    x: number
    y: number
    isVisible: boolean
}

interface ToolbarWrapperProps {
    pageX: number
    pageY: number
    visible?: boolean
    children: ReactElement
}

interface ToolbarManagerProps {
    editor: React.ComponentElement<any, any>
    flyingToolbar?: React.ComponentElement<any, any>
    fixedToolbar?: React.ComponentElement<any, any>
    title?: React.ComponentElement<any, any> | Text
    onKeyPress?: ((event: React.KeyboardEvent<HTMLDivElement>) => void),
    editorState: EditorState
}


/** @jsx jsx */
export const ToolbarWrapper = forwardRef(({
                                              pageX,
                                              pageY,
                                              visible,
                                              children

                                       }: ToolbarWrapperProps, ref: Ref<HTMLDivElement>): JSX.Element =>

    <Portal>
        <div ref={ref} css={{
        position: 'fixed',
        left: pageX,
        top: pageY,
        zIndex: 300,
        display: visible ? 'block' : 'none',
        }}>
            {children}
        </div>
    </ Portal> );


/** @jsx jsx */
function ToolbarManager({
                              editor,
                              title,
                              flyingToolbar,
                              fixedToolbar,
                              onKeyPress,
                              editorState
}: ToolbarManagerProps): React.ComponentElement<any, any> {

    const [toolbarState, setToolbarState] = useState<ToolbarState>({
        x: 0,
        y: 0,
        isVisible: false
    });

    const toolbarRef = useRef<HTMLDivElement>(null);

    function handleCloseToolbar(event: Event): void {
        if (!event) {
            console.log('no event');
            return;
        }

        // type assertion - cause contains() only accepts Nodes | null and event.target is of EventTarget | null type
        if (toolbarRef.current && toolbarRef.current.contains(event.target as Node)) {
            console.log('clicked on the toolbar');
            return;
        }
        if (!toolbarState.isVisible) return;
        const newState: ToolbarState = Object.assign({}, toolbarState, { isVisible: false });
        console.log('handleCloseToolbar');
        setToolbarState(newState)
    }

    function handleOpenToolbar(): void {
        setTimeout(() => {
            const selection = editorState.getSelection();
            if (!selection) return;
            const position = getVisibleSelectionRect(window);
            if(!position) return;
            const newState: ToolbarState = {
                x: position.left,
                y: position.top,
                isVisible: true
            };
            setToolbarState(newState)
        })
    }

    useEffect(() => {
        document.addEventListener('click', handleCloseToolbar);
        return () => {
            document.removeEventListener('click', handleCloseToolbar)
        }
    });

    return (
        <div  onKeyPress={onKeyPress} css={ {display: 'flex', flexDirection: 'row'} }>
            { flyingToolbar ?
                <ToolbarWrapper
                    ref={toolbarRef}
                    visible={toolbarState.isVisible}
                    pageX={toolbarState.x}
                    pageY={toolbarState.y + 30}
                >
                    {flyingToolbar}
                </ToolbarWrapper> : null
            }
            <div css={{ alignSelf: 'flex-start', position: 'sticky', top: 0 }}>
                { fixedToolbar }
            </div>
            <div css={ {display: 'flex', flexDirection: 'column'} }>
                {title}
                <div onMouseUp={handleOpenToolbar}>
                    {editor}
                </div>
            </div>
        </div>

    )
}

export default ToolbarManager
