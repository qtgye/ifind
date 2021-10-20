import React, { FunctionComponent } from "react";
import PropTypes from "prop-types";
import Styled from "styled-components";

const Container = Styled.div`
  progress {
    margin-bottom: 2px;
    margin-right: 8px;
  }

  span {
    font-weight: bold;
    font-size: 14px;
  }

  progress[value] {
    width: ${(props: ProgressProps) => props.width};

    -webkit-appearance: none;
    appearance: none;
  }

  progress[value]::-webkit-progress-bar {
    height: 18px;
    border-radius: 20px;
    background-color: #eee;
  }

  progress[value]::-webkit-progress-value {
    height: 18px;
    border-radius: 20px;
    background-color: #dc3545;
  }
` as FunctionComponent<{ color?: string, width?: string }>;

const ProgressBar = ({ value, max, color, width }: ProgressProps) => {
    return (
        <Container color={color} width={width}>
            <progress value={value} max={max} />
            <span>{(value / max) * 100}%</span>
        </Container>
    );
};

ProgressBar.propTypes = {
    value: PropTypes.number.isRequired,
    max: PropTypes.number,
    color: PropTypes.string,
    width: PropTypes.string
};

ProgressBar.defaultProps = {
    max: 100,
    color: "lightBlue",
    width: "250px"
};

export default ProgressBar;
