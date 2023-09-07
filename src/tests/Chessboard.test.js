import React from "react";
import { render } from "@testing-library/react";
import Chessboard from "../game/Chessboard";
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
 const board = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

test("renders Chessboard component without errors", () => {
  const providerProps = {
    value: {
      username: "testUser",
      authenticated: true,
      setElo: jest.fn(),
    },
  };

  customRender(
    <Chessboard
      board={board}
      playerColor="black"
      errorMessage=""
      prevClickedSquare=""
      handleClickedSquare=""
    />,
    { providerProps }
  );
});
