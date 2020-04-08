import React, {useEffect, useRef, useState, Fragment, ReactElement, forwardRef, Ref} from "react";
import { jsx } from '@emotion/core'


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
}


/** @jsx jsx */
export const ToolbarWrapper = forwardRef(({
                                              pageX,
                                              pageY,
                                              visible,
                                              children
                                          }: ToolbarWrapperProps, ref: Ref<HTMLDivElement>): JSX.Element =>
    <div ref={ref} css={{
        position: 'fixed',
        left: pageX,
        top: pageY,
        zIndex: 300,
        display: visible ? 'block' : 'none',
    }}>
        {children}
    </div>);


/** @jsx jsx */
function ToolbarManager({
                              editor,
                              title,
                              flyingToolbar,
                              fixedToolbar
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

        // @ts-ignore
        // Because .contains() accept only Nodes | null and event.target is of EventTarget | null type
        if (toolbarRef.current && toolbarRef.current.contains(event.target)) {
            console.log('clicked on the toolbar');
            return;
        }
        if (!toolbarState.isVisible) return;
        const newState: ToolbarState = Object.assign({}, toolbarState, { isVisible: false });
        console.log('handleCloseToolbar');
        setToolbarState(newState)
    }

    function handleOpenToolbar(): void {
        const selection = window.getSelection();
        if (!selection) return;
        const range = selection.getRangeAt(0);
        if (range.collapsed) return;
        const position = range.getBoundingClientRect();
        const newState: ToolbarState = {
            x: position.x,
            y: position.y,
            isVisible: true
        };
        setToolbarState(newState)
    }

    useEffect(() => {
        document.addEventListener('click', handleCloseToolbar);
        return () => {
            document.removeEventListener('click', handleCloseToolbar)
        }
    });

    return (
        <div css={ {display: 'flex', flexDirection: 'row'} }>
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
