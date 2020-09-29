import React, {useEffect} from 'react';
import './admin-metadata.styles.less';
import {BackTop} from "antd";


type AdminMetadataProps = {};

const AdminMetadataPage: React.FC<AdminMetadataProps> = (props) => {
    useEffect(() => {
        document.title = 'Bullet Journal - Metadata';
    }, []);

    return (
        <div className='metadata-page'>
            <BackTop/>
            <div>
            </div>
        </div>
    );
};

export default AdminMetadataPage;
