import { jsx } from "@emotion/core";
import {Button, Input, InputGroup, Layer, Toolbar, useTheme, Text} from "sancho";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {loginUser} from "../store/auth/thunks";
import {useNavigate} from "@reach/router";


/** @jsx jsx */
export default function SignInForm() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    function handleSignIn(e: React.FormEvent) {
        e.preventDefault()
        console.log(email, password)
        dispatch(loginUser(email, password));

    }

    return (
        <div css={{ maxWidth: "400px", margin: 'auto', marginTop: 100}}>
            <Layer>
                <Toolbar
                    css={{
                        justifyContent: "center",
                        borderBottom: `1px solid ${theme.colors.border.default}`
                    }}
                >
                    <Text gutter={false} variant="h4">
                        Sign in to Typocool
                    </Text>
                </Toolbar>
                <form onSubmit={handleSignIn} css={{ padding: theme.spaces.lg }}>
                    <InputGroup hideLabel label="Email address">
                        <Input value={email} onChange={(event: any) => setEmail(event.currentTarget.value)} inputSize="lg" type="email" placeholder="Email" />
                    </InputGroup>
                    <InputGroup hideLabel label="Password">
                        <Input value={password} onChange={(event: any) => setPassword(event.currentTarget.value)}inputSize="lg" type="password" placeholder="Password" />
                    </InputGroup>
                    <Button
                        css={{ marginTop: "1rem" }}
                        size="lg"
                        component="button"
                        type="submit"
                        block
                        variant={"ghost"}
                        intent="primary"

                    >
                        Sign in
                    </Button>
                </form>
            </Layer>
        </div>
    );
}
