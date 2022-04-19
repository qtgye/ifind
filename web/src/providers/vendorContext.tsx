import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  PropsWithChildren,
  ReactNode,
  useRef,
} from "react";
import eventBus from "utilities/EventBus";

const vendors = {
  highcharts: {
    scripts: [
      "https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.3.2/highcharts.min.js",
    ],
    stylesheets: [
      "https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.3.2/css/highcharts.min.css",
    ],
    loadedCheck: () => (window.Highcharts ? true : false),
  },
};

export const VendorContext = createContext<VendorContextData>({});

export const VendorProvider = ({ children }: PropsWithChildren<ReactNode>) => {
  const vendorsMapRef = useRef<VendorMap>(vendors);

  const isVendorInjected = useCallback(
    (vendorId: string) => {
      const vendors = vendorsMapRef.current;
      return vendorId in vendors && vendors[vendorId].loaded ? true : false;
    },
    [vendorsMapRef]
  );

  const injectVendor = useCallback(
    (vendorId: keyof VendorMap, callback: () => void) => {
      const vendors = vendorsMapRef.current;

      if (vendorId in vendors && typeof callback === "function") {
        const matchedVendor = vendors[vendorId];

        if (matchedVendor.loaded) {
          callback();
          return;
        }

        eventBus.on("vendor-loaded-" + vendorId, callback);

        if (!matchedVendor.injecting) {
          const vendorScripts = matchedVendor.scripts || [];
          const vendorStylesheets = matchedVendor.stylesheets || [];
          matchedVendor.injecting = true;

          if (matchedVendor.loadedCheck) {
            const checkerInterval = window.setInterval(() => {
              if (matchedVendor.loadedCheck && matchedVendor.loadedCheck()) {
                window.clearInterval(checkerInterval);
                matchedVendor.loaded = true;
                matchedVendor.injecting = false;
                eventBus.dispatch("vendor-loaded-" + vendorId, {});
              }
            }, 100);
          }

          // Inject scripts
          vendorScripts.forEach((script) => {
            const scriptTag = document.createElement("script");
            scriptTag.async = true;
            scriptTag.src = script;
            document.head.appendChild(scriptTag);
          });

          // Inject stylesheets
          vendorStylesheets.forEach((stylesheet) => {
            const linkTag = document.createElement("link");
            linkTag.rel = "stylesheet";
            linkTag.href = stylesheet;
            document.head.appendChild(linkTag);
          });
        }
      }
    },
    [vendorsMapRef]
  );

  return (
    <VendorContext.Provider value={{ isVendorInjected, injectVendor }}>
      {children}
    </VendorContext.Provider>
  );
};

export const useVendor = (vendorId: string) => {
  const { injectVendor } = useContext(VendorContext);
  const [isVendorLoaded, setIsVendorLoaded] = useState(false);

  const onVendorLoaded = useCallback(() => {
    setIsVendorLoaded(true);
  }, []);

  useEffect(() => {
    if (injectVendor && onVendorLoaded) {
      injectVendor(vendorId, onVendorLoaded);
    }
  }, [injectVendor, onVendorLoaded, vendorId]);

  return isVendorLoaded;
};
