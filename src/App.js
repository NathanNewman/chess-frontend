import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import MyNavbar from "./Navbar";
import Home from "./Home";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import LeaderBoard from "./LeaderBoard";
import Replays from "./Replays";
import ReplayMatch from "./game/ReplayMatch";
import Profile from "./Profile";
import { AuthContext } from "./helpers/AuthContext";

function App() {
  const { authenticated } = useContext(AuthContext);
  return (
    <>
      <MyNavbar />
      <main>
        <Route exact path="/">
          {authenticated || localStorage.getItem("authenticated") ? (
            <Home />
            ) : (
              <Redirect to="/login" />
              )}
        </Route>
        <Route exact path="/play">
          {authenticated || localStorage.getItem("authenticated") ? (
            <Home />
            ) : (
              <Redirect to="/login" />
              )}
        </Route>
        <Route exact path="/leaderboard">
          {authenticated || localStorage.getItem("authenticated") ? (
            <LeaderBoard />
            ) : (
              <Redirect to="/login" />
              )}
        </Route>
        <Route exact path="/replays">
          {authenticated || localStorage.getItem("authenticated") ? (
            <Replays />
            ) : (
              <Redirect to="/login" />
              )}
        </Route>
        <Route exact path="/replays/:matchId">
          {authenticated || localStorage.getItem("authenticated") ? (
            <ReplayMatch />
            ) : (
              <Redirect to="/login" />
              )}
        </Route>
        <Route exact path="/profile/:username">
          {authenticated || localStorage.getItem("authenticated") ? (
            <Profile />
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
              </>
  );
}

export default App;
