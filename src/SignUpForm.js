import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./helpers/AuthContext";
import { useHistory } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
} from "reactstrap";
import { Tooltip } from "@mui/material";
import ChessApi from "./helpers/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./chess.css";

function SignUpForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    repeatPassword: "",
  });
  const { setAuthenticated, username, setUsername } =
    useContext(AuthContext);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [repeatPasswordError, setRepeatPasswordError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const history = useHistory();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const hasErrors = checkSubmissionErrors();
    if (!hasErrors) {
      setServerError(false);
      try {
        const response = await ChessApi.createUser(
          formData.username,
          formData.password,
        );
        if (response.token) {
          setLoginError(false);
          setRedirect(true);
          setAuthenticated(response.token);
          setUsername(response.user.username);
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        if (error[0]) {
          setLoginError(error);
        } else {
          setServerError(true);
        }
      }
    }
    setFormData({
      username: "",
      password: "",
      repeatPassword: "",
    });
  };

  function checkSubmissionErrors() {
    let error = false;
    if (formData.username.length < 4 || formData.username.length > 20) {
      setUsernameError(true);
      error = true;
    }
    if (formData.password.length < 8 || formData.username.length > 20) {
      setPasswordError(true);
      error = true;
    }
    if (formData.password !== formData.repeatPassword) {
      setRepeatPasswordError(true);
      error = true;
    }
    if (error) return;

    setUsernameError(false);
    setPasswordError(false);
    setRepeatPasswordError(false);
  }

  useEffect(() => {
    if (redirect) {
      history.push("/");
    }
  }, [username]);

  return (
    <div className="chess-background">
      <Container>
        <Row>
          <Col md={{ size: 6, offset: 3 }}>
            <div className="card-container">
              <Card>
                <CardBody>
                  <h1>Sign Up</h1>
                  <Form onSubmit={handleSubmit}>
                    {loginError && !serverError && (
                      <div style={{ color: "red" }}>
                        {loginError.map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                      </div>
                    )}
                    {serverError && (
                      <div style={{ color: "red" }}>
                        Unable to connect to the server. Please try again later.
                      </div>
                    )}
                    <FormGroup>
                      <Tooltip title="Must be between 4 and 20 characters">
                        <span>
                          <Label for="username">Username:</Label>
                          <Input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                          />
                        </span>
                      </Tooltip>
                      {usernameError && (
                        <div style={{ color: "red" }}>
                          Username must be between 4-20 characters long
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Tooltip title="Must be between 8 and 20 characters">
                        <span>
                          <Label for="password">Password:</Label>
                          <Input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                          />
                        </span>
                      </Tooltip>
                      {passwordError && (
                        <div style={{ color: "red" }}>
                          Password must be between 8-20 characters long
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Tooltip title="Must be the same as above password">
                        <span>
                          <Label for="repeatPassword">Repeat Password:</Label>
                          <Input
                            type="password"
                            id="repeatPassword"
                            name="repeatPassword"
                            value={formData.repeatPassword}
                            onChange={handleChange}
                          />
                        </span>
                      </Tooltip>
                      {repeatPasswordError && (
                        <div style={{ color: "red" }}>
                          Passwords do not match
                        </div>
                      )}
                    </FormGroup>
                    <Button type="submit" color="primary">
                      Sign Up
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SignUpForm;
