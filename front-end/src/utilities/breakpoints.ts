import { useCallback, useEffect, useState } from "react"

const breakpoints = {
  sm: [ 0, 767 ],
  md: [ 768, 1023 ],
  lg: [ 1024, 1279 ],
  xl: [ 1280, 1439 ],
  xxl: [ 1440 ],
}

export const useBreakpoints = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('');

  const onMediaChange = useCallback((matchMedia, breakpointName) => {
    if ( matchMedia.matches ) {
      setCurrentBreakpoint(breakpointName)
    }
  }, []);

  useEffect(() => {
    Object.entries(breakpoints).forEach(([breakpointName, [ min, max ]]) => {
      const mediaQuery = [
        min ? `(min-width: ${min}px)` : '',
        max ? `(max-width: ${max}px)` : '',
      ].filter(Boolean).join(' and ');

      const media = window.matchMedia(mediaQuery);
      media.onchange = () => onMediaChange(media, breakpointName);

      // Initial media call
      onMediaChange(media, breakpointName);
    });
  }, [ onMediaChange ]);

  return currentBreakpoint;
}
