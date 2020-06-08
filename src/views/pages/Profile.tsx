import { useDispatch, useSelector } from "react-redux";
import { Button, IconLogOut, Input, InputGroup, Text } from "sancho";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RootState } from "../../store";
import { jsx } from "@emotion/core";
import { logoutUser } from "../../store/auth/thunks";
import { updateUser } from "../../store/user/thunks";

interface ProfileProps {
  path: string;
}

/**@jsx jsx */
const Profile = (props: ProfileProps) => {
  const dispatch = useDispatch();
  const { firstName, lastName, email } = useSelector(
    (state: RootState) => state.user.user
  );

  const handleLogout = () => dispatch(logoutUser());

  const formik = useFormik({
    initialValues: {
      firstName: firstName,
      lastName: lastName,
      email: email,
    },
    validationSchema: Yup.object({
      firstName: Yup.string(),
      lastName: Yup.string(),
      email: Yup.string(),
    }),
    onSubmit: (values) => {
      dispatch(updateUser(values.firstName, values.lastName, values.email));
    },
  });
  return (
    <div
      css={{
        width: 850,
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 20,
        paddingBottom: 20,
      }}
    >
      <Text variant={"h1"} css={{ marginBottom: 20, marginTop: 30 }}>
        <strong>Profile</strong>
      </Text>
      <form onSubmit={formik.handleSubmit}>
        <InputGroup
          error={formik.errors.firstName}
          label={"First Name"}
          css={{ maxWidth: 150 }}
        >
          <Input
            id="firstName"
            name="firstName"
            type="name"
            {...formik.getFieldProps("firstName")}
          />
        </InputGroup>
        <InputGroup
          error={formik.errors.lastName}
          label={"Last Name"}
          css={{ maxWidth: 150 }}
        >
          <Input
            id="lastName"
            name="lastName"
            type="name"
            {...formik.getFieldProps("lastName")}
          />
        </InputGroup>
        <InputGroup
          error={formik.errors.lastName}
          label={"Email"}
          css={{ maxWidth: 200 }}
        >
          <Input
            id="email"
            name="email"
            type="email"
            {...formik.getFieldProps("email")}
          />
        </InputGroup>
        <Button
          type={"submit"}
          css={{ marginBottom: 20, marginTop: 30 }}
          //loading={status.isLoading}
        >
          Save
        </Button>
      </form>
      <Button
        variant={"ghost"}
        intent={"danger"}
        iconAfter={<IconLogOut />}
        onClick={handleLogout}
        css={{ marginBottom: 20, marginTop: 30 }}
      >
        Logout
      </Button>
    </div>
  );
};

export default Profile;
