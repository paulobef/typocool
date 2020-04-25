import React from 'react';
import { useFormik } from 'formik';
import {Button, Input, InputGroup, Select, Text, useToast} from "sancho";
import { jsx } from '@emotion/core'
import * as Yup from "yup"
import {RootState} from "../store";
import {useDispatch, useSelector} from "react-redux";
import {updateSettings} from "../store/settings/thunks";
import dayjs from "dayjs";
import dateDisplayer, {timeDisplayer} from "../utils/dateDisplayer";

interface SettingsProps {
    path: string
}

/**@jsx jsx */
const Settings = (props: SettingsProps) => {
    const dispatch = useDispatch();
    const { status, settings } = useSelector((state: RootState) => state.settings)
    const { fontSize, fontFamily } = settings
    const formik = useFormik({
        initialValues: {
            fontSize: fontSize || 14,
            fontFamily: fontFamily || 'Sans Serif',
        },
        validationSchema: Yup.object({
            fontSize: Yup.number()
                .max(24, 'Must be between 24 and 9')
                .min(9, 'Must be between 24 and 9')
                .default(14),
        }),
        onSubmit: values => {
            dispatch(updateSettings({
                ...values,
                lastSaved: dayjs()
            }));
        },
    });
    return (
        <div css={{ width: 850, paddingLeft: 50, paddingRight: 50, paddingTop: 20, paddingBottom: 20 }}>
            <Text variant={'h1'} css={{ marginBottom: 20, marginTop: 30}}>
                <strong>Settings</strong>
            </Text>
            <form onSubmit={formik.handleSubmit}>
                <InputGroup error={formik.errors.fontSize} label={"Font size"} css={{ maxWidth: 150}}>
                <Input
                    id="fontSize"
                    name="fontSize"
                    type="number"
                    {...formik.getFieldProps('fontSize')}
                />
                </InputGroup>
                <InputGroup error={formik.errors.fontFamily} label={"Font style"} css={{ maxWidth: 150}}>
                    <Select
                        id="fontFamily"
                        name="fontFamily"
                        {...formik.getFieldProps('fontFamily')}
                    >
                        <option>Sans Serif</option>
                        <option>Serif</option>
                    </Select>
                </InputGroup>

                <Button
                    type={"submit"}
                    css={{ marginBottom: 20, marginTop: 30}}
                    loading={status.isLoading}
                >Save</Button>
            </form>
            <Text variant={'subtitle'}>Last modified: {settings.lastSaved.isToday() ? timeDisplayer(settings.lastSaved) : dateDisplayer(settings.lastSaved)}</Text>
        </div>
    );
};

export default Settings
