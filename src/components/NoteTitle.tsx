import React, {FormEvent, MutableRefObject, Fragment, useRef, useState} from "react";
import { useTheme, Text} from "sancho";
import { jsx } from '@emotion/core'
import ContentEditable from "react-contenteditable";


interface EditableTitleProps {
    value: string | null
    placeholder: string
    onKeyPress?(event: React.KeyboardEvent<HTMLHeadingElement>): void
    onChange?(value: string | null): void,
    date: string,
    time: string
}

/** @jsx jsx */
function NoteTitle({ value, placeholder, onKeyPress, onChange, date, time }: EditableTitleProps) {
    const theme = useTheme();
    const [selectedPlaceholder, setSelectedPlaceholder] = useState(false);
    const reference: MutableRefObject<any> = useRef<HTMLHeadingElement>(null);

    function addFocusOutEvent () {
        const listener = reference.current.addEventListener('focusout', () => {
            setSelectedPlaceholder(false);
            reference.current.removeEventListener('focusout', listener);
        })
    }

    function handleChange(event: FormEvent<HTMLHeadingElement>): void {
        if (onChange) onChange(event.currentTarget.textContent)
        //setEndOfContenteditable(reference.current)
    }

    function handleFocus(): void {
        addFocusOutEvent();
        setSelectedPlaceholder(true)
    }



    return (
        <Fragment>
                <ContentEditable
                    innerRef={reference}
                    html={value || ""}
                    placeholder={placeholder}
                    onChange={handleChange}
                    onKeyPress={onKeyPress}
                    onFocus={handleFocus}
                    tagName='h1'
                    css={{
                            fontSize: theme.fontSizes["7"],
                            fontWeight: theme.fontWeights.heading + 100,
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
                />


            <Text css={{
                marginTop: - 20,
                marginBottom: 50
            }} variant={'subtitle'} >Last saved: <strong>{date} - {time}</strong></Text>
        </Fragment>
    )
}

export default NoteTitle
