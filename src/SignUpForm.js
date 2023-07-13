import React, { useState, useContext } from "react";
import { AuthContext } from "./helpers/AuthContext";
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
import ChessApi from "./helpers/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./chess.css";

function SignUpForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    repeatPassword: "",
    imageURL: "",
  });
  const { setAuthenticated } = useContext(AuthContext);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [repeatPasswordError, setRepeatPasswordError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  function validateImageURL(url) {
    const img = new Image();
    img.onload = () => {
      setImageError(false);
    };
    img.onerror = () => {
      setImageError(true);
    };
    img.src = url;
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const hasErrors = checkSubmissionErrors();
    if (!hasErrors) {
      try {
        const response = await ChessApi.createUser(
          formData.username,
          formData.password,
          formData.imageURL
        );
        if (response.token) {
          setLoginError(false);
          setAuthenticated(response.token);
        } else {
          setLoginError(true);
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        setLoginError(true);
      }
    }
    setFormData({
      username: "",
      password: "",
      repeatPassword: "",
      imageURL: "",
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
    if (formData.imageURL) {
      validateImageURL(formData.imageURL);
      if (imageError) {
        setImageError(true);
        error = true;
      }
    }
    if (error) return;

    setUsernameError(false);
    setPasswordError(false);
    setRepeatPasswordError(false);
    setImageError(false);
  }
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
                    {loginError && (
                      <div style={{ color: "red" }}>
                        Username already taken!
                      </div>
                    )}
                    <FormGroup>
                      <Label for="username">Username</Label>
                      <Input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                      {usernameError && (
                        <div style={{ color: "red" }}>
                          Username must be between 4-20 characters long
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label for="password">Password</Label>
                      <Input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      {passwordError && (
                        <div style={{ color: "red" }}>
                          Password must be between 8-20 characters long
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label for="repeatPassword">Repeat Password</Label>
                      <Input
                        type="password"
                        id="repeatPassword"
                        name="repeatPassword"
                        value={formData.repeatPassword}
                        onChange={handleChange}
                        className={repeatPasswordError ? "is-invalid" : ""}
                      />
                      {repeatPasswordError && (
                        <div style={{ color: "red" }}>
                          Passwords do not match
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label for="imageURL">Image URL (optional)</Label>
                      <Input
                        type="text"
                        id="imageURL"
                        name="imageURL"
                        value={formData.imageURL}
                        onChange={handleChange}
                      />
                      {imageError && (
                        <div style={{ color: "red" }}>
                          Invalid image URL. Please enter a valid URL.
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
