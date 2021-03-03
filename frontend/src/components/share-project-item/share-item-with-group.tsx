import React, { useEffect } from 'react';
import { Avatar, Form, Result, Select, Tooltip } from 'antd';
import { TeamOutlined, SendOutlined, ShareAltOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { GroupsWithOwner } from '../../features/group/interface';
import { updateGroups } from '../../features/group/actions';
import { IState } from '../../store';
import { shareTask, shareTaskByEmail } from '../../features/tasks/actions';
import { shareNote, shareNoteByEmail } from '../../features/notes/actions';
import { shareTransactionByEmail } from '../../features/transactions/actions';
import {
  getProjectItemType,
  ProjectType,
} from '../../features/project/constants';
import './share-item-modal.styles.less';
import { Content } from '../../features/myBuJo/interface';

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
  shareNoteByEmail: (
    noteId: number,
    contents: Content[],
    emails: string[],
    targetUser?: string,
    targetGroup?: number,
  ) => void;
  shareTaskByEmail: (
    taskId: number,
    contents: Content[],
    emails: string[],
    targetUser?: string,
    targetGroup?: number,
  ) => void;
  shareTransactionByEmail: (
    transactionId: number,
    contents: Content[],
    emails: string[],
    targetUser?: string,
    targetGroup?: number,
  ) => void;
  noteContents: Content[];
  taskContents: Content[];
  transactionContents: Content[];
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

  const shareProjectItemByEmailCall: { [key in ProjectType]: Function } = {
    [ProjectType.NOTE]: props.shareNoteByEmail,
    [ProjectType.TODO]: props.shareTaskByEmail,
    [ProjectType.LEDGER]: props.shareTransactionByEmail,
  };

  const contents : { [key in ProjectType ] : Content[] } = {
    [ProjectType.NOTE]: props.noteContents,
    [ProjectType.TODO]: props.taskContents,
    [ProjectType.LEDGER]: props.transactionContents,
  }

  const shareFunction = shareProjectItemCall[props.type];
  const shareByEmailFunction = shareProjectItemByEmailCall[props.type];

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

  const shareProjectItemByEmail = (values: any) => {
    let groupId: number | undefined = values.group;
    if (!groupId) {
      groupId = groupsWithOwner[0].groups[0].id;
    }
    shareByEmailFunction(props.projectItemId, contents[props.type], [], undefined, groupId);
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
            {props.type === ProjectType.LEDGER ? null : 
            <Tooltip title='Share'>
              <ShareAltOutlined 
                style={{
                  marginRight: '16px', 
                  color: '#00cae9', 
                  fontSize: '20px'}}
                onClick={() =>
                  form
                    .validateFields()
                    .then((values) => {
                      shareProjectItem(values);
                    })
                    .catch((info) => console.log(info))
                }
              />
            </Tooltip>}
            <Tooltip title='Send email'>
                <SendOutlined 
                  onClick={()=> {
                    form
                    .validateFields()
                    .then((values) => {
                      shareProjectItemByEmail(values);
                    })
                    .catch((info) => console.log(info))
                  }} 
                  style={{color: '#00cae9', fontSize: '20px'}} 
                />
            </Tooltip>
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
  noteContents: state.note.contents,
  taskContents: state.task.contents,
  transactionContents: state.transaction.contents,
});

export default connect(mapStateToProps, {
  updateGroups,
  shareTask,
  shareNote,
  shareNoteByEmail,
  shareTaskByEmail,
  shareTransactionByEmail,
})(ShareProjectItemWithGroup);
