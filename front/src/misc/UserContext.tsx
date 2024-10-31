import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction, FC } from 'react';
import { getJWT, refreshAccessToken } from '../misc/Tokens';

// Define types for user data and context
type UserData = {
  user_id: number;
  username: string;
  user_type: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: Dispatch<SetStateAction<UserData | null>>;
  fetchUserData: () => Promise<void>;
}

// Create a User Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// User Provider
export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {

  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchUserData = async () => {

    const token = getJWT().access;

    try {

      const response = await fetch('http://localhost:8000/user-data/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
      });

      if(response.status == 401) {
        // Try refresh token
        const newToken = await refreshAccessToken();
        if(newToken) {
          fetchUserData();
        }
      }

      if (!response.ok) {
        console.error('Failed to fetch user data in Context.');
        setUserData(null);
      }
      else {
        const data = await response.json();
        setUserData(data);
      }

    } catch (err) {
      console.error(err);
    }

  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );

};

// Custom hook to use the User Context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};