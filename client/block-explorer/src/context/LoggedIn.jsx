import { createContext, useState } from 'react';
import secureLocalStorage from 'react-secure-storage'

const LoginContext = createContext();

function Provider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(secureLocalStorage.getItem("loggedIn"));


  return (
    <LoginContext.Provider value={ isLoggedIn }>
      {children}
    </LoginContext.Provider>
  );
}

export { Provider };
export default LoginContext;