import React from "react";
import { getByAltText, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import "@testing-library/jest-dom/extend-expect";
import App from "../App";

// Mock the Worker constructor globally
global.Worker = class Worker {
  constructor() {
    this.onmessage = null;
  }
  postMessage() {}
  terminate() {}
};

// Define a custom function to set up localStorage values for the test
const setupLocalStorage = (eloValue) => {
  const localStorageMock = {
    getItem: jest.fn((key) => {
      if (key === "elo") {
        return eloValue.toString();
      }
      return null;
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
};

// Set AuthContext to be used to test authentication
const customRender = (ui, { providerProps, ...renderOptions } = {}) => {
  const Wrapper = ({ children }) => (
    <AuthContext.Provider {...providerProps}>{children}</AuthContext.Provider>
  );
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

describe("App Component", () => {
  it("'/login' renders the login page when not authenticated", () => {
    const providerProps = {
      value: { authenticated: false },
    };

    customRender(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>,
      { providerProps }
    );

    // Check that the "Login" button within the login form is present
    expect(
      screen.getByText("Login", { selector: 'button[type="submit"]' })
    ).toBeInTheDocument();
  });
  it("'/' redirects to the login page when not authenticated", () => {
    const providerProps = {
      value: { authenticated: false },
    };

    customRender(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
      { providerProps }
    );

    // Check that the "Login" button within the login form is present
    expect(
      screen.getByText("Login", { selector: 'button[type="submit"]' })
    ).toBeInTheDocument();
  });
  it("'/play' redirects to the login page when not authenticated", () => {
    const providerProps = {
      value: { authenticated: false },
    };

    customRender(
      <MemoryRouter initialEntries={["/play"]}>
        <App />
      </MemoryRouter>,
      { providerProps }
    );

    // Check that the "Login" button within the login form is present
    expect(
      screen.getByText("Login", { selector: 'button[type="submit"]' })
    ).toBeInTheDocument();
  });
  it("'/leaderboard' redirects to the login page when not authenticated", () => {
    const providerProps = {
      value: { authenticated: false },
    };

    customRender(
      <MemoryRouter initialEntries={["/leaderboard"]}>
        <App />
      </MemoryRouter>,
      { providerProps }
    );

    // Check that the "Login" button within the login form is present
    expect(
      screen.getByText("Login", { selector: 'button[type="submit"]' })
    ).toBeInTheDocument();
  });
  it("'/replays' redirects to the login page when not authenticated", () => {
    const providerProps = {
      value: { authenticated: false },
    };

    customRender(
      <MemoryRouter initialEntries={["/replays"]}>
        <App />
      </MemoryRouter>,
      { providerProps }
    );

    // Check that the "Login" button within the login form is present
    expect(
      screen.getByText("Login", { selector: 'button[type="submit"]' })
    ).toBeInTheDocument();
  });
  it("renders the signup page when not authenticated", () => {
    const providerProps = {
      value: { authenticated: false },
    };

    customRender(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>,
      { providerProps }
    );

    expect(
      screen.getByText("Sign Up", { selector: 'button[type="submit"]' })
    ).toBeInTheDocument();
  });
  it("renders the leaderboard page when authenticated", () => {
    const providerProps = {
      value: { authenticated: true },
    };

    customRender(
      <MemoryRouter initialEntries={["/leaderboard"]}>
        <App />
      </MemoryRouter>,
      { providerProps }
    );

    expect(
      screen.getByText("Leaderboard", {
        selector: "h5.list-group-item-heading",
      })
    ).toBeInTheDocument();
  });
  it("renders the homepage page when authenticated", () => {
    // Set up localStorage with an initial Elo value
    setupLocalStorage(500);

    const providerProps = {
      value: {
        username: "testUser",
        authenticated: true,
        setElo: jest.fn(),
      },
    };

    const { container } = customRender(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
      { providerProps }
    );

    // Use getByAltText to select the img element by its alt text
    const chessPieceImage = getByAltText(container, "K");

    // Check that the img element is present
    expect(chessPieceImage).toBeInTheDocument();
  });
  it("renders the replays page when authenticated", () => {
    // Set up localStorage with an initial Elo value
    setupLocalStorage(500);

    const providerProps = {
      value: {
        username: "testUser",
        authenticated: true,
        setElo: jest.fn(),
      },
    };

    customRender(
      <MemoryRouter initialEntries={["/replays"]}>
        <App />
      </MemoryRouter>,
      { providerProps }
    );

    expect(
      screen.getByText("Replay List", {
        selector: "h5.list-group-item-heading",
      })
    ).toBeInTheDocument();
  });
  it("renders the user's profile page when authenticated", () => {
    // Set up localStorage with an initial Elo value
    setupLocalStorage(500);

    const providerProps = {
      value: {
        username: "testUser",
        authenticated: true,
        setElo: jest.fn(),
      },
    };

    customRender(
      <MemoryRouter initialEntries={["/replays"]}>
        <App />
      </MemoryRouter>,
      { providerProps }
    );

    expect(screen.getByText("testUser")).toBeInTheDocument();
  });
});
