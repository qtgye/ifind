import React, { useState, useEffect } from "react";

import ProgressBar from './Progress';

const ProgressBars = () => {

    const [value, setValue] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setValue(oldValue => {
                const newValue = oldValue + 10;

                if (newValue === 100) {
                    clearInterval(interval);
                }

                return newValue;
            });
        }, 1300);
    }, []);

    return (
        <ProgressBar value={value} max={100} color="#dc3545" />
    )
}

export default ProgressBars;
