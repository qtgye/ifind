import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from "react";

export const OffersSideNavContext = createContext<OfferSideNavContext>({});

export const OffersSideNavProvider = ({
  children,
}: PropsWithChildren<ReactNode>) => {
  const [items, setItems] = useState<OffersSideNavItem[]>([]);

  return (
    <OffersSideNavContext.Provider value={{ items, setItems }}>
      {children}
    </OffersSideNavContext.Provider>
  );
};

export const useOffersSideNav = () => useContext(OffersSideNavContext);
