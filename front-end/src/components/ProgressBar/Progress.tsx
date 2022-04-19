import React, { FunctionComponent } from "react";
import PropTypes from "prop-types";
import Styled from "styled-components";

const Container = Styled.div`
  progress {
    margin-right: 8px;
    margin-bottom: -2px;
  }

  span {
    font-weight: bold;
    font-size: 12px;
  }

  progress[value] {
    width: ${(props: ProgressProps) => props.width};

    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    height: 15px;
    border-radius: 20px;
  }

  progress[value]::-webkit-progress-bar {
    height: 15px;
    border-radius: 20px;
    background-color: #eee;
  }

  progress[value]::-moz-progress-bar {
    height: 15px;
    border-radius: 20px;
    background-color: ${props => props.color};
  }

  progress[value]::-webkit-progress-value {
    height: 15px;
    border-radius: 20px;
    background-color: ${props => props.color};
  }
` as FunctionComponent<{ color?: string; width?: string }>;

const ProgressBar = ({ value, max, color, width }: ProgressProps) => {
    return (
        <Container width={width} color={color}>
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
    color: "none",
    width: "150px"
};

export default ProgressBar;
