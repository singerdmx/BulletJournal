import React, {useEffect, useState} from 'react';
import {Avatar, Button, Form, Input, Modal, Select, Tooltip} from 'antd';
import {
  CarryOutOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  FolderAddOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {connect} from 'react-redux';
import {GroupsWithOwner} from '../../features/group/interface';
import {createProjectByName} from '../../features/project/actions';
import {updateGroups} from '../../features/group/actions';
import {ProjectType, toProjectType} from '../../features/project/constants';
import {IState} from '../../store';
import {Project} from '../../features/project/interface';
import {History} from 'history';
import {Button as FloatButton, Container, darkColors, lightColors} from "react-floating-action-button";

import './modals.styles.less';
import {inPublicPage} from "../../index";

const {TextArea} = Input;
const {Option} = Select;

type ProjectProps = {
  history: History<History.PoorMansUnknown>;
  project: Project | undefined;
  mode: string;
  createProjectByName: (
      description: string,
      groupId: number,
      name: string,
      projectType: ProjectType,
      history: History<History.PoorMansUnknown> | undefined
  ) => void;
};

//props of groups
type GroupProps = {
  groups: GroupsWithOwner[];
  updateGroups: () => void;
};

const AddProject: React.FC<GroupProps & ProjectProps> = (props) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [groupId, setGroupId] = useState<number>(-1);
  const [projectType, setProjectType] = useState<string>('');
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();
  const onCancel = () => {
    setVisible(false);
    form.resetFields();
  };
  const openModal = () => {
    setVisible(true);
  };

  useEffect(() => {
    if (visible) {
      props.updateGroups();
    }
  }, [visible]);

  const addProject = (history: History<History.PoorMansUnknown>) => {
    let type: ProjectType = toProjectType(projectType);
    const inPublic = inPublicPage();
    props.createProjectByName(description, groupId, name, type, inPublic ? undefined : history);
    if (inPublic) {
      window.location.reload();
      return;
    }
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
                  .then((values) => {
                    console.log(values);
                    form.resetFields();
                    addProject(history);
                  })
                  .catch((info) => console.log(info));
            }}
        >
          <Form form={form}>
            <Form.Item>
              <Form.Item
                  name="projectType"
                  rules={[{required: true, message: 'Missing Type'}]}
                  style={{display: 'inline-block', width: '28%'}}
              >
                <Select
                    placeholder="Choose Type"
                    value={projectType ? projectType : undefined}
                    onChange={(e) => onChangeProjectType(e)}
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
                    <CreditCardOutlined/>
                    &nbsp;LEDGER
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item
                  name="projectName"
                  rules={[{required: true, message: 'BuJo Name must be between 1 and 30 characters', min: 1, max: 30}]}
                  style={{display: 'inline-block', width: '70%'}}
              >
                <Input
                    placeholder="Enter BuJo Name"
                    value={name}
                    onChange={(e) => onChangeName(e.target.value)}
                />
              </Form.Item>
              <Form.Item name="projectDesp">
                <TextArea
                    placeholder="Enter Description"
                    autoSize
                    value={description}
                    onChange={(e) => onChangeDescription(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                  name="projectGroup"
                  rules={[{required: true, message: 'Missing Group'}]}
              >
                <Select
                    placeholder="Choose Group"
                    style={{width: '100%'}}
                    value={groupId < 0 ? undefined : groupId}
                    onChange={(e) => onChangeGroupId(e)}
                >
                  {groupsWithOwner.map(
                      (groupsOwner: GroupsWithOwner, index: number) => {
                        return groupsOwner.groups.map((group) => (
                            <Option
                                key={`group${group.id}`}
                                value={group.id}
                                title={`Group "${group.name}" (owner "${group.owner.alias}")`}
                            >
                              <Avatar size="small" src={group.owner.avatar}/>
                              &nbsp;&nbsp;Group <strong>
                              {group.name}
                            </strong> (owner <strong>{group.owner.alias}</strong>)
                            </Option>
                        ));
                      }
                  )}
                </Select>
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>
    );
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
    if (props.mode === 'button') {
      return <>
        <Button type="primary" key="sign-in" onClick={openModal}>
          Create New BuJo
        </Button>
        {getModal()}
      </>
    }

    if (props.mode === 'float') {
      return <Container>
        <FloatButton
            tooltip="Add New BuJo"
            onClick={openModal}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
        >
          <PlusOutlined/>
        </FloatButton>
        {getModal()}
      </Container>
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
  project: state.project.project,
});

export default connect(mapStateToProps, {updateGroups, createProjectByName})(
    AddProject
);
