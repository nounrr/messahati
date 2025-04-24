import React from 'react';
import DefaultLineChart from '../../Components/Statestique/DefaultLineChart';
import GradientLineChart from '../../Components/Statestique/GradientLineChart';
import StepLineChart from '../../Components/Statestique/StepLineChart';
import LineDataLabel from '../../Components/Statestique/LineDataLabel';
import ZoomAbleLineChart from '../../Components/Statestique/ZoomAbleLineChart';
import DoubleLineChart from '../../Components/Statestique/DoubleLineChart';
import UnitCountSix from '../../Components/Statestique/UnitCountSix';
import HealthLineChart from '../../Components/Statestique/HealthLineChart';

const Statestiques = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <h1 className="mb-4">Statistiques</h1>
                </div>
            </div>
            <div className="row">
                <DefaultLineChart />
                <GradientLineChart />
                <StepLineChart />
                <LineDataLabel />
                <ZoomAbleLineChart />
                <DoubleLineChart />
                <HealthLineChart />
                <UnitCountSix  />
                </div>
        </div>
    );
};

export default Statestiques;