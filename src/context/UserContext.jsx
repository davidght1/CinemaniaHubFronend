// UserContext.js
import React, { createContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const registerUser = async (userData) => {
    // Here you can handle the logic to register the user
    // For now, let's just set the user data in state
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, registerUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
