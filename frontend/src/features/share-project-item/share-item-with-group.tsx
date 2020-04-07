import React, {useEffect} from 'react';
import {Avatar, Form, Result, Select} from 'antd';
import {TeamOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {GroupsWithOwner} from '../../features/group/interface';
import {updateGroups} from '../../features/group/actions';
import {IState} from '../../store';
import {shareTask} from '../../features/tasks/actions';
import {shareNote} from '../../features/notes/actions';
import {getProjectItemType, ProjectType} from "../../features/project/constants";

const {Option} = Select;

type ProjectItemProps = {
    type: ProjectType;
    projectItemId: number;
    shareTask: (
        taskId: number,
        generateLink: boolean,
        targetUser?: string,
        targetGroup?: number,
        ttl?: number
    ) => void;
    shareNote: (
        noteId: number,
        generateLink: boolean,
        targetUser?: string,
        targetGroup?: number,
        ttl?: number
    ) => void;
};

//props of groups
type GroupProps = {
    groups: GroupsWithOwner[];
    updateGroups: () => void;
};

const ShareProjectItemWithGroup: React.FC<GroupProps & ProjectItemProps> = props => {
    const [form] = Form.useForm();

    const shareProjectItemCall = {
        [ProjectType.NOTE]: props.shareNote,
        [ProjectType.TODO]: props.shareTask
    };

    useEffect(() => {
        props.updateGroups();
    }, []);

    const shareProjectItem = (values: any) => {
        switch (props.type) {
            case ProjectType.NOTE:
                // props.moveNote(props.projectItemId, projectId, history);
                break;
            case ProjectType.TODO:
                // props.moveTask(props.projectItemId, projectId, history);
                break;
            case ProjectType.LEDGER:
                // props.moveTransaction(props.projectItemId, projectId, history);
                break;
        }
    };

    const shareWithGroup = () => {
        const {groups: groupsWithOwner} = props;
        if (groupsWithOwner.length === 0) {
            return null;
        }

        return (
            <div>
                <Form form={form}>
                    <Form.Item name='group'>
                        <Select
                            placeholder='Choose Group'
                            style={{width: '100%'}}
                            defaultValue={groupsWithOwner[0].groups[0].id}
                        >
                            {groupsWithOwner.map(
                                (groupsOwner: GroupsWithOwner, index: number) => {
                                    return groupsOwner.groups.map(group => (
                                        <Option
                                            key={`group${group.id}`}
                                            value={group.id}
                                            title={`Group "${group.name}" (owner "${group.owner}")`}
                                        >
                                            <Avatar size='small' src={group.ownerAvatar}/>
                                            &nbsp;&nbsp;
                                            <strong> {group.name} </strong> (owner{' '}
                                            <strong>{group.owner}</strong>)
                                        </Option>
                                    ));
                                }
                            )}
                        </Select>
                    </Form.Item>
                </Form>
                <Result
                    icon={<TeamOutlined/>}
                    title={`Share ${getProjectItemType(props.type)} with GROUP`}
                />
            </div>
        );
    };

    return shareWithGroup();
};

const mapStateToProps = (state: IState) => ({
    groups: state.group.groups,
});

export default connect(mapStateToProps, {
    updateGroups,
    shareTask,
    shareNote,
})(ShareProjectItemWithGroup);
