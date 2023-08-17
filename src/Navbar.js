import React, { useContext } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
} from "reactstrap";
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

function MyNavbar() {
  const { authenticated, setAuthenticated, username } = useContext(AuthContext);

  const handleLogout = () => {
    ChessApi.logout();
    setAuthenticated(false);
  };
  return (
    <Navbar color="light" light expand="md">
      <Container>
        <NavbarBrand href="/">
          <FaChess size={32} /> Chess
        </NavbarBrand>
        <Nav className="mx-auto" navbar>
          <NavItem>
            <NavLink href="/play">
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
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/leaderboard">
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
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/replays">
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
            </NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem>
            {username ? (
              <>
                <div>
                  <NavLink href={"/profile/" + username}>
                    <FaUser size={22} />
                    {username}
                  </NavLink>
                </div>
              </>
            ) : (
              <>
                <NavLink href="/signup">
                  <FaUserPlus size={22} /> Signup
                </NavLink>
              </>
            )}
          </NavItem>
          <NavItem>
            {authenticated ? (
              <>
                <NavLink href="/login" onClick={handleLogout}>
                  <FaSignOutAlt size={22} /> Logout
                </NavLink>
              </>
            ) : (
              <>
                <NavLink href="/login">
                  <FaSignInAlt size={22} /> Login
                </NavLink>
              </>
            )}
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
