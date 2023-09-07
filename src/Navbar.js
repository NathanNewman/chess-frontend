import React, { useContext } from "react";
import { Navbar, Nav, NavItem, Container } from "reactstrap";
import { Link } from "react-router-dom";
import {
  FaTrophy,
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt,
  FaChess,
  FaChessPawn,
  FaUser,
} from "react-icons/fa";
import { MdReplayCircleFilled } from "react-icons/md";
import { Tooltip } from "@mui/material";
import { AuthContext } from "./helpers/AuthContext";
import ChessApi from "./helpers/api";
import "./nav.css";

function MyNavbar() {
  const { authenticated, setAuthenticated, username } = useContext(AuthContext);

  const handleLogout = () => {
    ChessApi.logout();
    setAuthenticated(false);
  };
  return (
    <Navbar color="light" light expand="md">
      <Container>
        <Link className="navbrand" to="/">
          <FaChess size={32} /> Chess
        </Link>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Link className="link-play" to="/play">
              {authenticated ? (
                <>
                  <FaChessPawn size={22} />
                  Play
                </>
              ) : (
                <Tooltip title="Login to access">
                  <span>
                    <FaChessPawn size={22} />
                    Play
                  </span>
                </Tooltip>
              )}
            </Link>
          </NavItem>
          <NavItem>
            <Link className="link-leaderboard" to="/leaderboard">
              {authenticated ? (
                <>
                  <FaTrophy size={22} /> Leaderboard
                </>
              ) : (
                <Tooltip title="Login to access">
                  <span>
                    <FaTrophy size={22} /> Leaderboard
                  </span>
                </Tooltip>
              )}
            </Link>
          </NavItem>
          <NavItem>
            <Link className="link-replays" to="/replays">
              {authenticated ? (
                <>
                  <MdReplayCircleFilled size={22} /> Replays
                </>
              ) : (
                <Tooltip title="Login to access">
                  <span>
                    <MdReplayCircleFilled size={22} /> Replays
                  </span>
                </Tooltip>
              )}
            </Link>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem>
            {authenticated ? (
              <>
                <div>
                  <Tooltip title="Profile">
                    <Link className="link-user" to={"/profile/" + username}>
                      <FaUser size={22} />
                      {username}
                    </Link>
                  </Tooltip>
                </div>
              </>
            ) : (
              <>
                <Link className="link-user" to="/signup">
                  <FaUserPlus size={22} /> Signup
                </Link>
              </>
            )}
          </NavItem>
          <NavItem>
            {authenticated ? (
              <>
                <Link className="link-user" to="/login" onClick={handleLogout}>
                  <FaSignOutAlt size={22} /> Logout
                </Link>
              </>
            ) : (
              <>
                <Link className="link-user" to="/login">
                  <FaSignInAlt size={22} /> Login
                </Link>
              </>
            )}
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
