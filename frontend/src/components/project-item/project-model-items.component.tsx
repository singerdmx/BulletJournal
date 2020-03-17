import React from 'react';
import {Collapse, Timeline} from 'antd';
import {AccountBookOutlined, CarryOutOutlined, FileTextOutlined} from '@ant-design/icons';
import {ProjectItems} from '../../features/myBuJo/interface';

const {Panel} = Collapse;

type ProjectModelItemsProps = {
    projectItems: ProjectItems[];
};

const getTasksPanel = (items: ProjectItems, index: number) => {
    if (items.tasks.length === 0) {
        return null;
    }
    return (
        <Panel
    header={items.dayOfWeek}
    key={`tasks${index}`}
    extra={<CarryOutOutlined/>}
    />
    );
};

const getTransactionsPanel = (items: ProjectItems, index: number) => {
    if (items.transactions.length === 0) {
        return null;
    }
    return (
        <Panel
    header={items.dayOfWeek}
    key={`transactions${index}`}
    extra={<AccountBookOutlined/>}
    />
    );
};

const getNotesPanel = (items: ProjectItems, index: number) => {
    if (items.notes.length === 0) {
        return null;
    }
    return (
        <Panel
    header={items.dayOfWeek}
    key={`notes${index}`}
    extra={<FileTextOutlined/>}
    />
    );
};

const ProjectModelItems: React.FC<ProjectModelItemsProps> = props => {
    return (
        <Timeline mode={'left'}>
            {props.projectItems.map((items, index) => {
                return (
                    <Timeline.Item
                        key={items.date}
                        label={items.date}
                        style={{marginLeft: '-65%'}}
                    >
                        <Collapse
                            defaultActiveKey={[
                                'tasks' + index,
                                'transactions' + index,
                                'notes' + index
                            ]}
                        >
                            {getTasksPanel(items, index)}
                            {getTransactionsPanel(items, index)}
                            {getNotesPanel(items, index)}
                        </Collapse>
                    </Timeline.Item>
                );
            })}
        </Timeline>
    );
};

export default ProjectModelItems;
