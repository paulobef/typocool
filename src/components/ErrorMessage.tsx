import React from 'react'
import { jsx } from '@emotion/core'
import { IconAlertCircle, Text } from 'sancho'

/**@jsx jsx*/
function ErrorMessage({ errorText }: { errorText: string }) {
    return (
        <div css={{ marginTop: 10, marginBottom: 5 }}>
            <IconAlertCircle 
                size="sm" 
                color="red" 
                css={{
                    position: 'relative',
                    top: 3,
                    
                }}
            />
            <Text css={{ color: 'red' }} > Sorry, there was an error</Text>
        </div>
    )
}

export default ErrorMessage
