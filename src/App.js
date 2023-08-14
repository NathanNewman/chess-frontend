import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import MyNavbar from "./Navbar";
import Home from "./Home";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import LeaderBoard from "./LeaderBoard";
import Replays from "./Replays";
import ReplayMatch from "./game/ReplayMatch"

function App() {
  return (
    <BrowserRouter>
      <MyNavbar />
      <main>
        <Route exact path="/">
          {localStorage.getItem("username") ? (
            <Home />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/play">
          {localStorage.getItem("username") ? (
            <Home />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/leaderboard">
          {localStorage.getItem("username") ? (
            <LeaderBoard />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/replays">
          {localStorage.getItem("username") ? (
            <Replays />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/replays/:matchId">
          {localStorage.getItem("username") ? (
            <ReplayMatch />
          ) : (
            <Redirect to="/login" />
          )}
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
