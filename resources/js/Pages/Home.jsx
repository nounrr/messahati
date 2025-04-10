import React from "react";
import { SafetyStatus, DangerStatus, WarningStatus } from "../Components/Child/Status";
import Departement from "./Components/Popup/Departement";
const Home = () => {
    const [isActive, setIsActive] = useState(false)
        const Activate = ()=>{
            console.log('active');
            
                     setIsActive(true)
        }
        const Desactivate = ()=>{
            setIsActive(false)
        }
    return <div>
        <button></button>
        <Departement />
    </div>;
};

export default Home;
          