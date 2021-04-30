import { GlobalContextProvider } from './global';

export const Providers = ({ children }) => (
    <GlobalContextProvider>
        {children}
    </GlobalContextProvider>
);
