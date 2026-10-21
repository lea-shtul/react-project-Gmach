import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { loginRequest, User } from '../types/user';
import { getMe, loginApi } from '../server/authApi';
import { useNavigate } from 'react-router-dom';


type userContextProps = {
    user: User | null
    login: (request: loginRequest) => Promise<void>,
    logout: () => void,
    isLoading: boolean; 

}

type providerProps = {
    children: ReactNode
}
export const userContext = createContext<userContextProps>({
    user: null,
    login: async () => { },
    logout: () => { },
    isLoading:false
});
export const UserProvider = ({ children }: providerProps) => {

    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true);
    const nav = useNavigate()

useEffect(() => {//אם הטוקן לא תקף או  שגיאת שרת אין כניהס כאילו לא רשום משתמש אם יש- מחזיק מהאיפיאי ומעדכן את היוזר ומשנה לFALSE
  const checkUser = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        localStorage.removeItem('token');
      }
    }

    setIsLoading(false);
  };

  checkUser();
}, []);







    const login = async (request: loginRequest) => {
        const data = await loginApi(request);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        nav('/')//???? כמובן לבדוק ניתוב וכו וכו וכו
    };

    const logout = () => {
        setUser(null)
        localStorage.removeItem("token")
        nav("/login")//???????
    }


    return (
        <userContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </userContext.Provider>
    )


}

export default UserProvider