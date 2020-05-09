import React, {useState} from "react";
import {IState} from "../../store";
import {Project} from "../../features/project/interface";
import {Modal, Tooltip} from "antd";
import {
    HistoryOutlined,
} from '@ant-design/icons';
import {connect} from "react-redux";

type ShowProjectHistoryProps = {
    project: Project | undefined;
};

const ShowProjectHistory: React.FC<ShowProjectHistoryProps> = ({project}) => {
    const [visible, setVisible] = useState(false);
    const onCancel = () => setVisible(false);
    const openModal = () => setVisible(true);

    if (!project) {
        return null;
    }

    return <Tooltip title='Show History'>
        <div className='show-project-history'>
            <HistoryOutlined
                style={{ fontSize: 20, cursor: 'pointer' }}
                onClick={openModal}
            />
            <Modal
                title={`BuJo "${project.name}" History`}
                visible={visible}
                onCancel={onCancel}
                footer={false}
            >
            </Modal>
        </div>
    </Tooltip>
};

const mapStateToProps = (state: IState) => ({
    project: state.project.project,
});

export default connect(mapStateToProps, {}) (ShowProjectHistory);