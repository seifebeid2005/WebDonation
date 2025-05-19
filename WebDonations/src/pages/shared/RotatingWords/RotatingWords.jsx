import styled from "styled-components";

const RotatingWords = styled.span`
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

export default RotatingWords;
