import React from "react";
import {Tooltip} from "antd";
import {PauseCircleOutlined, TagOutlined} from '@ant-design/icons';

type LabelManagementProps = {
    labelEditableHandler: React.MouseEventHandler<HTMLElement>;
    labelEditable: boolean;
}

const LabelManagement: React.FC<LabelManagementProps> = ({labelEditableHandler, labelEditable}) => {

    if (labelEditable) {
        return <Tooltip title='Stop Editing'>
            <div>
                <PauseCircleOutlined onClick={labelEditableHandler}/>
            </div>
        </Tooltip>
    }

    return <Tooltip title='Edit Label(s)'>
        <div>
            <TagOutlined onClick={labelEditableHandler}/>
        </div>
    </Tooltip>
};

export default LabelManagement;