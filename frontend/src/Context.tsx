import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';



// we for now using ContextAPI for state management later we can upgrade it to redux(i dont think we need too )
// bcoz it is used for larger apps which has to do with lot of state variables

export const ContextAPI = createContext();
const Context = (props) => {
    const navigate = useNavigate();
    const [user,setUser] = useState({});
    const loginBro = (userDetails) => {
        console.log(userDetails)
        sessionStorage.setItem('user-info', JSON.stringify(userDetails));
        if (userDetails.role == "customer") {
            navigate("/customer/dashboard");
        } else {
            navigate("/authority/dashboard");
        }
    }
    useEffect(() => {
        const detail = JSON.parse(sessionStorage.getItem('user-info'));
        if(detail){
            setUser(detail);
        }else{
            alert("User not found");
        }
    }, [])
    const logoutStudent = () => {
        setUser({});
        navigate("/login");

    };
    return (

        <ContextAPI.Provider value={{
            user,
            setUser,
            loginBro,

        }}>
            {props.children}
        </ContextAPI.Provider>

    )
}

export default Context