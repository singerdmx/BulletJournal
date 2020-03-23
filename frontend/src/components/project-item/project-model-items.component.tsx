import React from 'react';
import {Collapse, Timeline, Empty, List } from 'antd';
import {AccountBookOutlined, CarryOutOutlined, FileTextOutlined} from '@ant-design/icons';
import {ProjectItems} from '../../features/myBuJo/interface';
import NoteItem from './note-item.component';

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
    >
        <List>
        {items.notes.map(item=>{
            return (<List.Item key={item.id}>
                        <NoteItem name={item.name} id={item.id} onDelete={()=>{}} onEdit={()=>{}}/>
                    </List.Item>);
        })}
        </List>
    </Panel>
    );
};

const ProjectModelItems: React.FC<ProjectModelItemsProps> = props => {
    if (!props.projectItems || props.projectItems.length === 0) {
        return <Empty />;
    }
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
