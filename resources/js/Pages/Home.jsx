import React from "react";
import { SafetyStatus, DangerStatus, WarningStatus } from "../Components/Buttons/Status";
const Home = () => {
    return <div>
        <SafetyStatus status="Safe" />
        <DangerStatus status="Danger" />    
        <WarningStatus status="Warning" />
    </div>;
};

export default Home;
          