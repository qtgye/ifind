import { createContext, useEffect, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { BASIC_USER_NAME, BASIC_USER_PASSWORD, apiSourceHandle, userTokenHandle } from '@config/adminApi';
import loginUserQuery from '@gql/loginUserQuery';

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const [
        loginUser,
        {
            // loading,
            // error,
            data,
        }
    ] = useMutation(loginUserQuery);

    useEffect(() => {
        loginUser({
            variables: {
                username: BASIC_USER_NAME,
                password: BASIC_USER_PASSWORD
            },
            context: { apiSource: apiSourceHandle }
        })
    }, [ loginUser ]);

    useEffect(() => {
        if ( data?.login?.jwt ) {
            window.localStorage.setItem(userTokenHandle, data.login.jwt);
        }
    }, [ data ]);

    return (
        <UserContext.Provider value={data}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext);
    return context;
}

// Export as default to be used in testing
export default UserContext;