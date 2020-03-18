import React, {useEffect, useState} from 'react';
import {Avatar, Form, Input, Modal, Select, Tooltip} from 'antd';
import {EditOutlined,} from '@ant-design/icons';
import {connect} from 'react-redux';
import {GroupsWithOwner} from '../../features/group/interface';
import {updateGroups} from '../../features/group/actions';
import {updateProject} from '../../features/project/actions';
import {IState} from '../../store';
import {Project} from '../../features/project/interface';
import {iconMapper} from '../side-menu/side-menu.component';

import './modals.styles.less';

const InputGroup = Input.Group;
const {TextArea} = Input;
const {Option} = Select;

type ProjectProps = {
  project: Project;
  updateProject: (
      projectId: number,
      description: string,
      groupId: number,
      name: string
  ) => void;
};

//props of groups
type GroupProps = {
  groups: GroupsWithOwner[];
  updateGroups: () => void;
};

const EditProject: React.FC<GroupProps & ProjectProps> = props => {
  const [name, setName] = useState<string>(props.project.name);
  const [description, setDescription] = useState<string>(props.project.description);
  const [groupId, setGroupId] = useState<number>(props.project && props.project.group ? props.project.group.id : -1);
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();

  const onCancel = () => setVisible(false);
  const openModal = () => {
    const {name, description, group} = props.project;
    const groupId = group.id;
    setName(name);
    setDescription(description);
    setGroupId(groupId);
    setVisible(true);
  };

  useEffect(() => {
    props.updateGroups();
  }, []);

  const updateProject = () => {
    setVisible(false);
    const {id} = props.project;
    props.updateProject(id, description, groupId, name);
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
    const {project, groups: groupsByOwner} = props;
    return <Modal
        title='Edit BuJo'
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
                updateProject();
              })
              .catch(info => console.log(info));
        }}
    >
      <Form>
        <Form.Item>
          <InputGroup compact>
            <div style={{alignItems: 'center', width: '100%'}}>
                  <span title={`${project.projectType}`}>
                    <strong>{iconMapper[project.projectType]}</strong>
                  </span>
              <Input
                  style={{width: '90%', marginLeft: '20px'}}
                  placeholder='Enter BuJo Name'
                  value={name}
                  onChange={e => onChangeName(e.target.value)}
              />
            </div>

            <div style={{margin: '24px 0'}}/>
            <TextArea
                placeholder='Enter Description'
                autoSize
                value={description}
                onChange={e => onChangeDescription(e.target.value)}
            />

            <div style={{margin: '24px 0'}}/>
            <Select
                placeholder='Choose Group'
                style={{width: '100%'}}
                value={groupId}
                onChange={value => onChangeGroupId(value)}
            >
              {groupsByOwner.map(groupsOwner => {
                return groupsOwner.groups.map(group => (
                    <Option
                        key={`group${group.id}`}
                        value={group.id}
                        title={`Group "${group.name}" (owner "${group.owner}")`}
                    >
                      <Avatar size='small' src={group.ownerAvatar}/>
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
  };


  return (
      <div className='edit-project' title='Edit Project'>
        <Tooltip placement='top' title='Edit Project'>
          <EditOutlined
              onClick={openModal}
              style={{fontSize: 20}}
          />
        </Tooltip>
        {getModal()}
      </div>
  );
};

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  groups: state.group.groups
});

export default connect(mapStateToProps, {updateGroups, updateProject})(
    EditProject
);
