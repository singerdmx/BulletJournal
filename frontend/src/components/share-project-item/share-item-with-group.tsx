import React, { useEffect } from 'react';
import { Avatar, Button, Form, Result, Select } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { GroupsWithOwner } from '../../features/group/interface';
import { updateGroups } from '../../features/group/actions';
import { IState } from '../../store';
import { shareTask } from '../../features/tasks/actions';
import { shareNote } from '../../features/notes/actions';
import {
  getProjectItemType,
  ProjectType,
} from '../../features/project/constants';
import './share-item-modal.styles.less';

const { Option } = Select;

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

const ShareProjectItemWithGroup: React.FC<GroupProps & ProjectItemProps> = (
  props
) => {
  const [form] = Form.useForm();
  const { groups: groupsWithOwner } = props;

  const shareProjectItemCall: { [key in ProjectType]: Function } = {
    [ProjectType.NOTE]: props.shareNote,
    [ProjectType.TODO]: props.shareTask,
    [ProjectType.LEDGER]: () => {},
  };

  const shareFunction = shareProjectItemCall[props.type];

  useEffect(() => {
    props.updateGroups();
  }, []);

  const shareProjectItem = (values: any) => {
    let groupId: number | undefined = values.group;
    if (!groupId) {
      groupId = groupsWithOwner[0].groups[0].id;
    }

    shareFunction(props.projectItemId, false, undefined, groupId);
  };

  const shareWithGroup = () => {
    if (groupsWithOwner.length === 0) {
      return null;
    }

    return (
      <div>
        <Form form={form} layout="inline">
          <Form.Item name="group">
            <Select
              placeholder="Choose Group"
              style={{maxWidth: '300px'}}
              defaultValue={groupsWithOwner[0].groups[0].id}
            >
              {groupsWithOwner.map(
                (groupsOwner: GroupsWithOwner, index: number) => {
                  return groupsOwner.groups.map((group) => (
                    <Option
                      key={`group${group.id}`}
                      value={group.id}
                      title={`Group "${group.name}" (owner "${group.owner.alias}")`}
                    >
                      <Avatar size="small" src={group.owner.avatar} />
                      &nbsp;&nbsp;
                      <strong> {group.name} </strong> (owner{' '}
                      <strong>{group.owner.alias}</strong>)
                    </Option>
                  ));
                }
              )}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() =>
                form
                  .validateFields()
                  .then((values) => {
                    shareProjectItem(values);
                  })
                  .catch((info) => console.log(info))
              }
            >
              Share
            </Button>
          </Form.Item>
        </Form>
        <div className="share-info">
          <Result
            icon={<TeamOutlined />}
            title={`Share ${getProjectItemType(
              props.type
            ).toLocaleLowerCase()} with group`}
          />
        </div>
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
