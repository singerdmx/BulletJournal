import React, {useEffect, useState} from 'react';
import {Avatar, Button, Form, Input, Modal, Select, Tooltip} from 'antd';
import {
  AccountBookOutlined,
  CarryOutOutlined,
  FileTextOutlined,
  FolderAddOutlined,
  PlusOutlined
} from '@ant-design/icons';
import {connect} from 'react-redux';
import {GroupsWithOwner} from '../../features/group/interface';
import {createProjectByName} from '../../features/project/actions';
import {updateGroups} from '../../features/group/actions';
import {ProjectType, toProjectType} from '../../features/project/constants';
import {IState} from '../../store';
import {Project} from '../../features/project/interface';
import {History} from 'history';

import './modals.styles.less';

const InputGroup = Input.Group;
const {TextArea} = Input;
const {Option} = Select;

type ProjectProps = {
  history: History<History.PoorMansUnknown>;
  project: Project;
  mode: string;
  createProjectByName: (
      description: string,
      groupId: number,
      name: string,
      projectType: ProjectType,
      history: History<History.PoorMansUnknown>
  ) => void;
};

//props of groups
type GroupProps = {
  groups: GroupsWithOwner[];
  updateGroups: () => void;
};

const AddProject: React.FC<GroupProps & ProjectProps> = props => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [groupId, setGroupId] = useState<number>(-1);
  const [projectType, setProjectType] = useState<string>('');
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();

  const onCancel = () => setVisible(false);
  const openModal = () => {
    setVisible(true);
  };

  useEffect(() => {
    props.updateGroups();
  }, []);

  const addProject = (history: History<History.PoorMansUnknown>) => {
    let type: ProjectType = toProjectType(projectType);
    props.createProjectByName(description, groupId, name, type, history);
    setVisible(false);
    setName('');
    setDescription('');
    setGroupId(-1);
    setProjectType('');
  };

  const onChangeProjectType = (projectType: string) => {
    setProjectType(projectType);
  };

  const onChangeName = (name: string) => {
    setName(name);
  };

  const onChangeDescription = (description: string) => {
    setDescription(description);
  };

  const onChangeGroupId = (groupId: number) => {
    setGroupId(groupId);
  };

  const getModal = () => {
    const {groups: groupsWithOwner, history} = props;

    return (
        <Modal
            title="Create New BuJo"
            destroyOnClose
            centered
            okText="Create"
            visible={visible}
            onCancel={onCancel}
            onOk={() => {
              form
                  .validateFields()
                  .then(values => {
                    console.log(values);
                    form.resetFields();
                    addProject(props.history);
                  })
                  .catch(info => console.log(info));
            }}
        >
          <Form>
            <Form.Item>
              <InputGroup compact>
                <Select
                    style={{width: '40%'}}
                    placeholder="Choose Project Type"
                    value={
                      projectType ? projectType : undefined
                    }
                    onChange={e => onChangeProjectType(e)}
                >
                  <Option value="TODO" title="Project Type: TODO">
                    <CarryOutOutlined/>
                    &nbsp;TODO
                  </Option>
                  <Option value="NOTE" title="Project Type: NOTE">
                    <FileTextOutlined/>
                    &nbsp;NOTE
                  </Option>
                  <Option value="LEDGER" title="Project Type: LEDGER">
                    <AccountBookOutlined/>
                    &nbsp;LEDGER
                  </Option>
                </Select>
                <Input
                    style={{width: '60%'}}
                    placeholder="Enter BuJo Name"
                    value={name}
                    onChange={e => onChangeName(e.target.value)}
                />
                <div style={{margin: '24px 0'}}/>
                <TextArea
                    placeholder="Enter Description"
                    autoSize
                    value={description}
                    onChange={e => onChangeDescription(e.target.value)}
                />
                <div style={{margin: '24px 0'}}/>
                <Select
                    placeholder="Choose Group"
                    style={{width: '100%'}}
                    value={groupId < 0 ? undefined : groupId}
                    onChange={e => onChangeGroupId(e)}
                >
                  {groupsWithOwner.map((groupsOwner: GroupsWithOwner, index: number) => {
                    return groupsOwner.groups.map(group => (
                        <Option
                            key={`group${group.id}`}
                            value={group.id}
                            title={`Group "${group.name}" (owner "${group.owner}")`}
                        >
                          <Avatar size="small" src={group.ownerAvatar}/>
                          &nbsp;&nbsp;Group <strong>
                          {group.name}
                        </strong> (owner <strong>{group.owner}</strong>)
                        </Option>
                    ));
                  })}
                </Select>
              </InputGroup>
            </Form.Item>
          </Form>
        </Modal>
    )
  };

  const getDiv = () => {
    if (props.mode === 'singular') {
      return (
          <Tooltip placement="right" title="Create New BuJo">
            <div className="add-project menu">
              <Button onClick={openModal} type="dashed" block>
                <FolderAddOutlined style={{fontSize: 20}}/>
              </Button>
              {getModal()}
            </div>
          </Tooltip>
      );
    }
    if (props.mode === 'MyBuJo') {
      return (
          <div>
            <Tooltip placement="bottom" title="Create New BuJo">
              <h2 className="add-todo-button" onClick={openModal}>
                <PlusOutlined/>
              </h2>
            </Tooltip>
            {getModal()}
          </div>
      );
    }

    return (
        <div>
          <Tooltip placement="bottom" title="Create New BuJo">
            <PlusOutlined className="rotateIcon" onClick={openModal}/>
          </Tooltip>
          {getModal()}
        </div>
    );
  };

  return getDiv();
};

const mapStateToProps = (state: IState) => ({
  groups: state.group.groups,
  project: state.project.project
});

export default connect(mapStateToProps, {updateGroups, createProjectByName})(
    AddProject
);
