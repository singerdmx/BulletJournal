import React, { useEffect, useState } from 'react';
import { Avatar, Form, Input, Modal, Select, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { GroupsWithOwner } from '../../features/group/interface';
import { updateGroups } from '../../features/group/actions';
import { updateProject } from '../../features/project/actions';
import { IState } from '../../store';
import { Project } from '../../features/project/interface';
import { iconMapper } from '../side-menu/side-menu.component';

import './modals.styles.less';

const { TextArea } = Input;
const { Option } = Select;

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
  // hooks 
  const [name, setName] = useState<string>(props.project.name);
  const [description, setDescription] = useState<string>(
    props.project.description
  );
  const [groupId, setGroupId] = useState<number>(
    props.project && props.project.group ? props.project.group.id : -1
  );
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  // initial props
  const {updateGroups} = props;
  // methods
  const onCancel = () => {
    form.resetFields();
    setVisible(false);
  };
  const openModal = () => {
    form.setFieldsValue({
      projectName: name,
      projectDesp: description,
      projectGroup: groupId
    });
    setVisible(true);
  };

  useEffect(() => {
    updateGroups();
  }, []);

  useEffect(() => {
    setName(props.project.name);
    setDescription(props.project.description);
    setGroupId(props.project.group.id);
  }, [props.project]);

  const updateProject = () => {
    setVisible(false);
    const { id } = props.project;
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
    const { project, groups: groupsByOwner } = props;
    return (
      <Modal
        title="Edit BuJo"
        destroyOnClose
        centered
        okText="Edit"
        visible={visible}
        onCancel={onCancel}
        onOk={() => {
          // setName(props.project.name);
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
        <Form
          form={form}
          initialValues={{
            projectName: name,
            projectDesp: description,
            projectGroup: groupId
          }}
        >
          <Form.Item>
            <Form.Item
              name="projectName"
              rules={[{ required: true, message: 'BuJo Name must be between 1 and 20 characters', min: 1, max: 20 }]}
            >
              <Input
                prefix={
                  <Tooltip title={`${project.projectType}`}>
                    <span>
                      <strong>{iconMapper[project.projectType]}</strong>
                    </span>
                  </Tooltip>
                }
                placeholder="Enter BuJo Name"
                value={name}
                onChange={e => onChangeName(e.target.value)}
              />
            </Form.Item>

            <Form.Item name="projectDesp">
              <TextArea
                placeholder="Enter Description"
                autoSize
                value={description}
                onChange={e => onChangeDescription(e.target.value)}
              />
            </Form.Item>
            <Form.Item name="projectGroup">
              <Select
                placeholder="Choose Group"
                style={{ width: '100%' }}
                value={groupId}
                onChange={value => onChangeGroupId(value)}
              >
                {groupsByOwner.map(groupsOwner => {
                  return groupsOwner.groups.map(group => (
                    <Option
                      key={`group${group.id}`}
                      value={group.id}
                      title={`Group "${group.name}" (owner "${group.owner.alias}")`}
                    >
                      <Avatar size="small" src={group.owner.avatar} />
                      &nbsp;&nbsp;Group <strong>
                        {group.name}
                      </strong> (owner <strong>{group.owner.alias}</strong>)
                    </Option>
                  ));
                })}
              </Select>
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <div className="edit-project" title="Edit BuJo">
      <Tooltip placement="top" title="Edit BuJo">
        <EditOutlined onClick={openModal} />
      </Tooltip>
      {getModal()}
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  groups: state.group.groups,
});

export default connect(mapStateToProps, { updateGroups, updateProject })(
  EditProject
);
