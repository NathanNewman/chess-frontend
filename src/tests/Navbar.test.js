import React from "react";
import {
  getByAltText,
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import "@testing-library/jest-dom/extend-expect";
import MyNavbar from "../Navbar";
import App from "../App";

// Mock the Worker constructor globally
global.Worker = class Worker {
  constructor() {
    this.onmessage = null;
  }
  postMessage() {}
  terminate() {}
};

// Mock the getComputedStyle function
// This is to fix and error with getByRole
window.getComputedStyle = () => {
    return {
      getPropertyValue: () => {
        // Return dummy values for computed styles
        return '';
      },
    };
  };

// Set AuthContext to be used to test authentication
const customRender = (ui, { providerProps, ...renderOptions } = {}) => {
  const Wrapper = ({ children }) => (
    <AuthContext.Provider value={providerProps.value}>
      {children}
    </AuthContext.Provider>
  );
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

describe("MyNavbar Component", () => {
  test("renders MyNavbar component correctly", () => {
    const providerProps = {
      value: {
        username: "testUser",
        authenticated: true,
        setElo: jest.fn(),
      },
    };
    const { getByText } = customRender(
      <MemoryRouter initialEntries={["/"]}>
        <MyNavbar />
      </MemoryRouter>,
      { providerProps }
    );

    const link = getByText("Play");
    expect(link).toBeInTheDocument();
  });
  test("displays login when not authenticated", () => {
    const providerProps = {
      value: {
        username: "testUser",
        authenticated: false,
        setElo: jest.fn(),
      },
    };
    const { getByRole } = customRender(
      <MemoryRouter initialEntries={["/"]}>
        <MyNavbar />
      </MemoryRouter>,
      { providerProps }
    );

    const link = getByRole("link", {
        name: "Login",
        href: "/login",
        class: "link-user",
      });
    expect(link).toBeInTheDocument();
  });
  test("displays signup when not authenticated", () => {
    const providerProps = {
      value: {
        username: "testUser",
        authenticated: false,
        setElo: jest.fn(),
      },
    };
    const { getByText } = customRender(
      <MemoryRouter initialEntries={["/"]}>
        <MyNavbar />
      </MemoryRouter>,
      { providerProps }
    );

    const link = getByText("Signup")
    expect(link).toBeInTheDocument();
  });
  test("displays profile link when authenticated", () => {
    const providerProps = {
      value: {
        username: "testUser",
        authenticated: true,
        setElo: jest.fn(),
      },
    };
    const { getByText } = customRender(
      <MemoryRouter initialEntries={["/leaderboard"]}>
        <MyNavbar />
      </MemoryRouter>,
      { providerProps }
    );

    const link = getByText("testUser")
    expect(link).toBeInTheDocument();
  });
  test("displays logout link when authenticated", () => {
    const providerProps = {
      value: {
        username: "testUser",
        authenticated: true,
        setElo: jest.fn(),
      },
    };
    const { getByText } = customRender(
      <MemoryRouter initialEntries={["/"]}>
        <MyNavbar />
      </MemoryRouter>,
      { providerProps }
    );

    const link = getByText("Logout")
    expect(link).toBeInTheDocument();
  });
  test("navigates to '/' when 'Play' link is clicked", () => {
    const providerProps = {
      value: {
        username: "testUser",
        authenticated: true,
        setElo: jest.fn(),
      },
    };

    const { container } = customRender(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>,
      { providerProps }
    );

    const playLink = screen.getByText("Chess");
    fireEvent.click(playLink);

    const chessPieceImage = getByAltText(container, "K");
    expect(chessPieceImage).toBeInTheDocument();
  });
  test("navigates to '/' when 'Chess' link is clicked", () => {
    const providerProps = {
      value: {
        username: "testUser",
        authenticated: true,
        setElo: jest.fn(),
      },
    };

    const { container } = customRender(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>,
      { providerProps }
    );

    const link = screen.getByText("Chess");
    fireEvent.click(link);

    const chessPieceImage = getByAltText(container, "K");
    expect(chessPieceImage).toBeInTheDocument();
  });
  test("navigates to '/leaderboard' when 'Leaderboard' link is clicked", () => {
    const providerProps = {
      value: {
        username: "testUser",
        authenticated: true,
        setElo: jest.fn(),
      },
    };

    const { getByText } = customRender(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
      { providerProps }
    );

    const link = getByText("Leaderboard");
    fireEvent.click(link);

    expect(
      getByText("Leaderboard", {
        selector: "h5.list-group-item-heading",
      })
    ).toBeInTheDocument();
  });
  test("navigates to '/replays' when 'replays' link is clicked", () => {
    const providerProps = {
      value: {
        username: "testUser",
        authenticated: true,
        setElo: jest.fn(),
      },
    };

    const { getByText } = customRender(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
      { providerProps }
    );

    const link = getByText("Replays");
    fireEvent.click(link);

    expect(
      getByText("Replay List", {
        selector: "h5.list-group-item-heading",
      })
    ).toBeInTheDocument();
  });
  test("navigates to '/profile/testUser' when 'testUser' link is clicked", () => {
    const providerProps = {
      value: {
        username: "testUser",
        authenticated: true,
        setElo: 500,
      },
    };

    const { getByText } = customRender(
      <MemoryRouter initialEntries={["/leaderboard"]}>
        <App />
      </MemoryRouter>,
      { providerProps }
    );

    const link = getByText("testUser");
    fireEvent.click(link);

    const testUserElements = screen.getAllByText("testUser");
    expect(testUserElements.length).toBeGreaterThan(1);
  });
});
