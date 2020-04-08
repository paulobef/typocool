import React, { ReactComponentElement, useState} from 'react';
import { jsx } from '@emotion/core'


interface SidebarLayoutProps {
    resizable?: boolean
    initialSidebarWidth: number
    sidebarComponent: ReactComponentElement<any>
    mainScreenComponent: ReactComponentElement<any>
    dividerWidth?: number
    dividerBackgroundColor?: string
    onResize?: (x: number)  => void

}

/** @jsx jsx */
function SidebarLayout({
                           resizable,
                           initialSidebarWidth,
                           sidebarComponent,
                           mainScreenComponent,
                           dividerWidth,
                           dividerBackgroundColor,
                           onResize

}: SidebarLayoutProps): React.ComponentElement<Element, any> {
    const [menuWidth, setMenuWidth] = useState(initialSidebarWidth);
    const [moving, setMoving] = useState(false);


    function handleMouseDown(event: React.MouseEvent) {
        setMoving(true)
    }

    function handleMouseMove(event: React.MouseEvent) {
        if (moving) {
            const x = event.pageX;
            setMenuWidth(x);
            if (onResize) {
                onResize(x)
            }
        }
    }

    function handleMouseUp(event: React.MouseEvent) {
        setMoving(false)
    }


    return (
        <div css={{ display: 'flex', flexDirection: 'row', height: window.innerHeight}}
             onMouseMove={ resizable ? handleMouseMove : () => null}
             onMouseUp={resizable ? handleMouseUp : () => null}>
            <div css={{ width: menuWidth, overflow: 'hidden', position: 'fixed' }} >
                { sidebarComponent }
            </div>
            <div css={{
                width: dividerWidth || 1,
                height: window.innerHeight,
                backgroundColor: dividerBackgroundColor || '#EEEEEE',
                alignSelf: 'stretch',
                position: 'fixed',
                top: 0,
                left: menuWidth,
                zIndex: 200,
                '&:hover': {
                    cursor: 'col-resize'
                }
            }}
                 onMouseDown={resizable ? handleMouseDown : () => null}
            > </div>
            <div css={{
                paddingLeft: menuWidth,
                margin: 'auto',
                marginTop: 0,
            }}>
                { mainScreenComponent }
            </div>
        </div>
    )
}

export default SidebarLayout
