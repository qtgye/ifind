import { useState, useEffect } from "react";
import { useIsRouteMatch, useCurrentRouteConfig } from "utilities/route";

import ProgressBar from './Progress';


const ProgressBars = () => {
    const isRouteMatch = useIsRouteMatch();
    const currentRouteConfig = useCurrentRouteConfig();
    const [value, setValue] = useState(0);

    useEffect(() => {
        let unmounted = false;

        if (isRouteMatch('/')) {
            const interval = setInterval(() => {
                if (!unmounted) {
                    setValue(oldValue => {
                        const newValue = oldValue + 10;

                        if (newValue === 100) {
                            clearInterval(interval);
                        }

                        return newValue;
                    });
                }
            }, 600);
        } else {
            const interval = setInterval(() => {
                if (!unmounted) {
                    setValue(oldValue => {
                        const newValue = oldValue + 10;

                        if (newValue === 100) {
                            clearInterval(interval);
                        }

                        return newValue;
                    });
                }
            }, 1300);

        }

        return () => {
            unmounted = true;
        }

    }, [currentRouteConfig, isRouteMatch]);

    return (
        <ProgressBar value={value} max={100} color="#dc3545" />
    )
}

export default ProgressBars;
