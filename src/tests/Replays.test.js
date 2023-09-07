import React from "react";
import { render } from "@testing-library/react";
import Replays from "../Replays";
import { AuthContext } from "../helpers/AuthContext";
import { MemoryRouter } from "react-router-dom";

// Mock the Worker constructor globally
global.Worker = class Worker {
  constructor() {
    this.onmessage = null;
  }
  postMessage() {}
  terminate() {}
};

// Set AuthContext to be used to test authentication
const customRender = (ui, { providerProps, ...renderOptions } = {}) => {
  const Wrapper = ({ children }) => (
    <AuthContext.Provider {...providerProps}>{children}</AuthContext.Provider>
  );
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

test("renders Replays component without errors", () => {
  const providerProps = {
    value: {
      username: "testUser",
      authenticated: true,
      setElo: jest.fn(),
    },
  };
  customRender(
    <MemoryRouter>
      <Replays />
    </MemoryRouter>,
    { providerProps }
  );
});