import React, {useEffect} from 'react';
import './steps.styles.less';
import {BackTop} from "antd";
import {useParams} from "react-router-dom";

type StepsProps = {
};

const StepsPage: React.FC<StepsProps> = (props) => {
    useEffect(() => {
        document.title = 'Bullet Journal - Steps';
    }, []);
    const {categoryId} = useParams();
    return (
    <div className='steps-page'>
        <BackTop />

        {categoryId}
    </div>
  );
};


export default StepsPage;
