import React from "react";
import { SafetyStatus, DangerStatus, WarningStatus } from "../Components/Buttons/Status";
const Home = () => {
    return <div>
        <h1>Status</h1>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam est quaerat voluptas sequi optio? Assumenda impedit excepturi minima qui ullam odio similique, eos inventore dignissimos iure! Veniam maxime optio consectetur.</p>
        <SafetyStatus status="Safe" />
        <DangerStatus status="Danger" />    
        <WarningStatus status="Warning" />
    </div>;
};

export default Home;
          