import styled from "styled-components";

const Loader = () => {
  return (
    <div className="loader">
      <StyledWrapper>
        <div id="page">
          <div id="container">
            <div id="ring" />
            <div id="ring" />
            <div id="ring" />
            <div id="ring" />
            <div id="h3">Donate Now</div>
          </div>
        </div>
      </StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  #page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  #container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  #h3 {
    color: rgb(82, 79, 79);
  }

  #ring {
    width: 190px;
    height: 190px;
    border: 1px solid transparent;
    border-radius: 50%;
    position: absolute;
  }

  #ring:nth-child(1) {
    border-bottom: 8px solid rgb(240, 42, 230);
    animation: rotate1 2s linear infinite;
  }

  @keyframes rotate1 {
    from {
      transform: rotateX(50deg) rotateZ(110deg);
    }

    to {
      transform: rotateX(50deg) rotateZ(470deg);
    }
  }

  #ring:nth-child(2) {
    border-bottom: 8px solid rgb(240, 19, 67);
    animation: rotate2 2s linear infinite;
  }

  @keyframes rotate2 {
    from {
      transform: rotateX(20deg) rotateY(50deg) rotateZ(20deg);
    }

    to {
      transform: rotateX(20deg) rotateY(50deg) rotateZ(380deg);
    }
  }

  #ring:nth-child(3) {
    border-bottom: 8px solid rgb(3, 170, 170);
    animation: rotate3 2s linear infinite;
  }

  @keyframes rotate3 {
    from {
      transform: rotateX(40deg) rotateY(130deg) rotateZ(450deg);
    }

    to {
      transform: rotateX(40deg) rotateY(130deg) rotateZ(90deg);
    }
  }

  #ring:nth-child(4) {
    border-bottom: 8px solid rgb(207, 135, 1);
    animation: rotate4 2s linear infinite;
  }

  @keyframes rotate4 {
    from {
      transform: rotateX(70deg) rotateZ(270deg);
    }

    to {
      transform: rotateX(70deg) rotateZ(630deg);
    }
  }
`;

export default Loader;

// Add this to your global CSS or in App.css
/*
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
*/
