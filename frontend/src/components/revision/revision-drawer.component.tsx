import React from 'react';
import { Drawer } from 'antd';
import Revision from './revision.component';



const RevisionDrawer = () => {
    return (
        <Drawer closable>
            <Revision />
        </Drawer>
    )
}

export default RevisionDrawer;