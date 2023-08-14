import React from "react";
import "./styles.css";

const Square = ({ piece, onClick, isDarkSquare, isSelected }) => {
  // Determine the class names based on the props
  const classNames = `square ${isDarkSquare ? "dark" : "light"} ${
    isSelected ? "square-selected" : ""
  }`;

  return (
    <div className={classNames} onClick={onClick}>
      {/* Render the piece within the square */}
      {piece && (
        <img
          src={require(`./pieces/${piece}.png`)} // Replace this with the correct path to your chess piece images
          alt={piece}
          className="chess-piece"
        />
      )}
    </div>
  );
};

export default Square;
