import React from "react";
import { render } from "@testing-library/react";
import GameInfoDisplay from "../game/GameInfoDisplay";
import { AuthContext } from "../helpers/AuthContext";

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

test("renders GameInfoDisplay component without errors", () => {
  const providerProps = {
    value: {
      username: "testUser",
      authenticated: true,
      setElo: jest.fn(),
    },
  };

  customRender(
    <GameInfoDisplay
    username="AI"
    elo="500"
    playerColor="black"
    piecesTaken=""
  />,
    { providerProps }
  );
});