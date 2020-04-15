import { jsx } from "@emotion/core";
import {Button, Input, InputGroup, Layer, Toolbar, useTheme, Text} from "sancho";
import React, {FormEvent, useState} from "react";
import {useDispatch} from "react-redux";
import {createUser} from "../store/user/thunks";
import {useNavigate} from "@reach/router";


/** @jsx jsx */
export default function CreateAccount() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleSetValue = (name: string) => (event: any) => {
        setForm({
            ...form,
            [name]: event.currentTarget.value
        })
    };

    function handleSignIn(e: React.FormEvent) {
        e.preventDefault();
        console.log(form.toString());
        const { firstName, lastName, email, password } = form;
        dispatch(createUser(
            firstName,
            lastName,
            email,
            password
        )); //TODO: maybe change the thunk to pass an object as parameter

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
                        Create a Typocool Account
                    </Text>
                </Toolbar>
                <form onSubmit={handleSignIn} css={{ padding: theme.spaces.lg }}>
                    <InputGroup hideLabel label="First Name">
                        <Input value={form.firstName} onChange={handleSetValue('firstName')} inputSize="lg" type="name" placeholder="First Name" />
                    </InputGroup>
                    <InputGroup hideLabel label="Last Name">
                        <Input value={form.lastName} onChange={handleSetValue('lastName')} inputSize="lg" type="name" placeholder="Last Name" />
                    </InputGroup>
                    <InputGroup hideLabel label="Email address">
                        <Input value={form.email} onChange={handleSetValue('email')} inputSize="lg" type="email" placeholder="Email" />
                    </InputGroup>
                    <InputGroup hideLabel label="Password">
                        <Input value={form.password} onChange={handleSetValue('password')}inputSize="lg" type="password" placeholder="Password" />
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
