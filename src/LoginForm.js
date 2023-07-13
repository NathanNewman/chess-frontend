import React, { useState, useContext } from "react";
import { AuthContext } from "./helpers/AuthContext";
import { Link } from "react-router-dom";
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
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserPlus } from "react-icons/fa";
import ChessApi from "./helpers/api";
import "./chess.css";

function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { setAuthenticated, setUsername, setImageURL } =
    useContext(AuthContext);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [serverError, setServerError] = useState(false);

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
        const response = await ChessApi.authenticate(
          formData.username,
          formData.password
        );
        if (response.token) {
          setLoginError(false);
          setAuthenticated(response.token);
          setUsername(response.user.username);
          setImageURL(response.user.imageURL);
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
    });
  };

  function checkSubmissionErrors() {
    let error = false;
    if (formData.username.length < 4 || formData.username.length > 20) {
      setUsernameError(true);
      error = true;
    } else setUsernameError(false);
    if (formData.password.length < 8 || formData.password.length > 20) {
      setPasswordError(true);
      error = true;
    } else setPasswordError(false);
    return error;
  }

  return (
    <div className="chess-background">
      <Container>
        <Row>
          <Col md={{ size: 6, offset: 3 }}>
            <div className="card-container">
              <Card>
                <CardBody>
                  <h1>Login</h1>
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
                    <Button type="submit" color="primary">
                      Login
                    </Button>
                  </Form>
                  <p>
                    If you have no account, please{" "}
                    <Link to="/signup">
                      <FaUserPlus />
                      Signup!
                    </Link>
                  </p>
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoginForm;
