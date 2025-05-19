import React from "react";
import styled from "styled-components";

const FancyDonateButton = ({ onClick }) => {
  return (
    <StyledWrapper>
      <div className="container-button">
        <div className="hover bt-1" />
        <div className="hover bt-2" />
        <div className="hover bt-3" />
        <div className="hover bt-4" />
        <div className="hover bt-5" />
        <div className="hover bt-6" />
        <button onClick={onClick} />
      </div>
    </StyledWrapper>
  );
};


const StyledWrapper = styled.div`
  .container-button {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas: "bt-1 bt-2 bt-3" "bt-4 bt-5 bt-6";
    position: relative;
    perspective: 800;
    padding: 0;
    width: 135px;
    height: 47px;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
  }

  .container-button:active {
    transform: scale(0.95);
  }

  .hover {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 200;
  }

  .bt-1 { grid-area: bt-1; }
  .bt-2 { grid-area: bt-2; }
  .bt-3 { grid-area: bt-3; }
  .bt-4 { grid-area: bt-4; }
  .bt-5 { grid-area: bt-5; }
  .bt-6 { grid-area: bt-6; }

  .bt-1:hover ~ button {
    transform: rotateX(15deg) rotateY(-15deg);
    box-shadow: -2px -2px #1D2C99;
  }
  .bt-1:hover ~ button::after {
    animation: shake 0.5s ease-in-out 0.3s;
    text-shadow: -2px -2px #1D2C99;
  }
  .bt-3:hover ~ button {
    transform: rotateX(15deg) rotateY(15deg);
    box-shadow: 2px -2px #1D2C99;
  }
  .bt-3:hover ~ button::after {
    animation: shake 0.5s ease-in-out 0.3s;
    text-shadow: 2px -2px #1D2C99;
  }
  .bt-4:hover ~ button {
    transform: rotateX(-15deg) rotateY(-15deg);
    box-shadow: -2px 2px #1D2C99;
  }
  .bt-4:hover ~ button::after {
    animation: shake 0.5s ease-in-out 0.3s;
    text-shadow: -2px 2px #1D2C99;
  }
  .bt-6:hover ~ button {
    transform: rotateX(-15deg) rotateY(15deg);
    box-shadow: 2px 2px #1D2C99;
  }
  .bt-6:hover ~ button::after {
    animation: shake 0.5s ease-in-out 0.3s;
    text-shadow: 2px 2px #1D2C99;
  }

  .hover:hover ~ button::before {
    background: transparent;
  }

  .hover:hover ~ button::after {
    content: "NOW";
    top: -150%;
    transform: translate(-50%, 0);
    font-size: 34px;
    color: #233BBE;
  }

  button {
    position: absolute;
    padding: 0;
    width: 135px;
    height: 47px;
    background: transparent;
    font-size: 17px;
    font-weight: 900;
    border: 3px solid #2A3DCC;
    border-radius: 12px;
    transition: all 0.3s ease-in-out;
  }

  button::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 135px;
    height: 47px;
    background-color: #4361EE;
    border-radius: 12px;
    transition: all 0.3s ease-in-out;
    z-index: -1;
  }

  button::after {
    content: "Donate";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 135px;
    height: 47px;
    background-color: transparent;
    font-size: 17px;
    font-weight: 900;
    line-height: 47px;
    color: #ffffff;
    border: none;
    border-radius: 12px;
    transition: all 0.3s ease-in-out;
    z-index: 2;
  }

  @keyframes shake {
    0%   { left: 45%; }
    25%  { left: 54%; }
    50%  { left: 48%; }
    75%  { left: 52%; }
    100% { left: 50%; }
  }
`;

export default FancyDonateButton;

export const RotatingWords = styled.span`
  display: inline-block;
  height: 1.5em;
  overflow: hidden;
  position: relative;
  vertical-align: middle;

  .word {
    display: block;
    color: #4361EE;
    font-weight: bold;
    animation: spin 6s infinite;
  }

  &::after {
    content: none;
  }

  @keyframes spin {
    0%, 10% {
      transform: translateY(0%);
    }
    25%, 35% {
      transform: translateY(-100%);
    }
    50%, 60% {
      transform: translateY(-200%);
    }
    75%, 85% {
      transform: translateY(-300%);
    }
    100% {
      transform: translateY(-400%);
    }
  }
`;