import React, {FormEvent, MutableRefObject, RefObject, useRef, useState} from "react";
import { useTheme} from "sancho";
import { jsx } from '@emotion/core'


interface EditableTitleProps {
    value: string | null
    placeholder: string
    onKeyPress?(event: React.KeyboardEvent<HTMLHeadingElement>): void
    onChange?(value: string | null): void
}

function setEndOfContenteditable(contentEditableElement: Node)
{
    let range,selection;
    if(!document.createRange) throw new Error('browser not supported for caret postioning') //Firefox, Chrome, Opera, Safari, IE 9+
    range = document.createRange();//Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection();//get the selection object (allows you to change selection)
    selection?.removeAllRanges();//remove any selections already made
    selection?.addRange(range);//make the range you have just created the visible selection

}

/** @jsx jsx */
function EditableTitle({ value, placeholder, onKeyPress, onChange }: EditableTitleProps) {
    const theme = useTheme();
    const [selectedPlaceholder, setSelectedPlaceholder] = useState(false);
    const reference: MutableRefObject<any> = useRef<HTMLHeadingElement>(null);

    function addFocusOutEvent () {
        const listener = reference.current.addEventListener('focusout', () => {
            setSelectedPlaceholder(false);
            reference.current.removeEventListener('focusout', listener);
        })
    }

    function handleInput(event: FormEvent<HTMLHeadingElement>): void {
        if (onChange) onChange(event.currentTarget.textContent)
        setEndOfContenteditable(reference.current)
    }

    function handleFocus(): void {
        addFocusOutEvent();
        setSelectedPlaceholder(true)
    }



    return (
                <h1
                    ref={reference}
                    contentEditable={"true"}
                    placeholder={placeholder}
                    onInput={handleInput}
                    onKeyPress={onKeyPress}
                    onFocus={handleFocus}
                    css={{
                            fontSize: theme.fontSizes["7"],
                            fontWeight: theme.fontWeights.heading,
                            color: theme.colors.text.heading,
                            borderTopStyle: 'hidden',
                            borderLeftStyle: 'hidden',
                            borderRightStyle: 'hidden',
                            borderBottomStyle: 'hidden',
                            resize: 'none',
                            '&:empty:before': {
                                content: 'attr(placeholder)',
                                color: selectedPlaceholder ? '#C8CBD1' : '#9197A4',
                                pointerEvents: 'none',
                                display: 'block', /* For Firefox */
                            },
                            '&:focus': {
                                outline: 'none',
                            },
                        }}
                >
                    {value || ""}
            </h1>
    )
}

export default EditableTitle
