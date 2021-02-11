import React, { useState, useContext } from "react";

import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";
import Card from "../../shared/components/UIElement/Card";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const Auth = (props) => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [authState, inputhandler, setformData] = useForm(
    {
      password: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setformData(
        {
          ...authState.inputs,
          name: undefined,
          image: undefined,
        },
        authState.inputs.email.isValid && authState.inputs.password.isValid
      );
    } else {
      setformData(
        {
          ...authState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const userUpdateSubmitHandler = async (e) => {
    e.preventDefault();

    if (isLoginMode) {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: authState.inputs.email.value,
            password: authState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );

        auth.login(response.userId, response.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", authState.inputs.email.value);
        formData.append("name", authState.inputs.name.value);
        formData.append("password", authState.inputs.password.value);
        formData.append("image", authState.inputs.image.value);

        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          formData
        );
        auth.login(response.userId, response.token);
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr></hr>
        <form onSubmit={userUpdateSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Your name"
              errorText="please enter a valid name"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputhandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputhandler}
              errorText="Please provide an image"
            />
          )}
          <Input
            id="email"
            element="input"
            type="text"
            label="E-mail"
            errorText="please enter a valid mail"
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputhandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            errorText="please enter a password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            onInput={inputhandler}
          />
          <Button type="submit" disabled={!authState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO{isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
