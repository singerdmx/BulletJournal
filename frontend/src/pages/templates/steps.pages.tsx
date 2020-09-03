import React, {useEffect} from 'react';
import './steps.styles.less';
import {useParams} from "react-router-dom";

type StepsProps = {
};

const StepsPage: React.FC<StepsProps> = () => {

    useEffect(() => {
        document.title = 'Bullet Journal - Steps';
    }, []);

    const {categoryId} = useParams();
    
    return (
        <div>
            <div>this is step pages</div>
            <div>{categoryId}</div>
        </div>
    );
};

export default StepsPage;
