import React, { useContext } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import MyNavbar from "./Navbar";
import Home from "./Home";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import { AuthContext } from "./helpers/AuthContext";

function App() {
  const { username } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <MyNavbar />
      <main>
        <Route exact path="/">
          {username ? <Home /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/play">
          {username ? <Home /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/leaderboard">
          {username ? <Home /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/replays">
          {username ? <Home /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/signup">
          <SignUpForm />
        </Route>
        <Route exact path="/login">
          <LoginForm />
        </Route>
      </main>
    </BrowserRouter>
  );
}

export default App;
