import React, { useState, useEffect } from 'react';
import { IState } from '../../store';
import { Project, ProjectsWithOwner } from '../../features/project/interface';
import {
  Modal,
  Tooltip,
  Select,
  DatePicker,
  Divider,
  Button,
  Avatar,
} from 'antd';
import { HistoryOutlined, SyncOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { ContentAction } from '../../features/project/constants';
import { iconMapper } from '../side-menu/side-menu.component';
import {
  flattenOwnedProject,
  flattenSharedProject,
} from '../../pages/projects/projects.pages';
import { getGroup } from '../../features/group/actions';
import { User, Group } from '../../features/group/interface';
const { Option } = Select;
const { RangePicker } = DatePicker;

type ShowProjectHistoryProps = {
  project: Project | undefined;
  ownedProjects: Project[];
  sharedProjects: ProjectsWithOwner[];
  aliases: any;
  group: Group | undefined;
  getGroup: (groupId: number) => void;
};

const ShowProjectHistory: React.FC<ShowProjectHistoryProps> = ({
  project,
  ownedProjects,
  sharedProjects,
  aliases,
  group,
}) => {
  const [visible, setVisible] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  //used for form
  const [selectProject, setSelectProject] = useState(-1);
  const [selectAction, setSelectAction] = useState(ContentAction.ADD_PROJECT);
  const [selectGroup, setSelectGroup] = useState([] as User[]);

  const onCancel = () => setVisible(false);
  const openModal = () => setVisible(true);

  useEffect(() => {
    if (group) {
      setSelectGroup(group.users);
    }
  }, [group]);
  useEffect(() => {
    if (project) {
      setSelectProject(project.id);
    }
  }, [project]);
  useEffect(() => {
    let updateProjects = [] as Project[];
    updateProjects = flattenOwnedProject(ownedProjects, updateProjects);
    updateProjects = flattenSharedProject(sharedProjects, updateProjects);
    setProjects(updateProjects);
  }, [ownedProjects, sharedProjects]);

  if (!project) {
    return null;
  }

  return (
    <Tooltip title='Show History'>
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
          <div>
            <div style={{ paddingBottom: '20px' }}>
              <RangePicker />
            </div>
            <div style={{ paddingBottom: '20px' }}>
              <Tooltip title='Select an Project'>
                <Select
                  style={{ width: '256px' }}
                  placeholder='Select a Project'
                  value={selectProject}
                  onChange={(id: number) => {
                    setSelectProject(id);
                    projects.forEach((p) => {
                      if (p.id === id) {
                        getGroup(p.group.id);
                        console.log(group);
                      }
                    });
                  }}
                >
                  {projects.map((project) => {
                    return (
                      <Option value={project.id} key={project.id}>
                        <Tooltip
                          title={`${
                            aliases[project.owner]
                              ? aliases[project.owner]
                              : project.owner
                          }`}
                          placement='right'
                        >
                          <span>
                            <Avatar size='small' src={project.ownerAvatar} />
                            &nbsp; {iconMapper[project.projectType]}
                            &nbsp; <strong>{project.name}</strong>
                            &nbsp; (Group <strong>{project.group.name}</strong>)
                          </span>
                        </Tooltip>
                      </Option>
                    );
                  })}
                </Select>
              </Tooltip>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <span>
              <Tooltip title='Select an Action'>
                <Select
                  style={{ width: '200px', marginRight: '25px' }}
                  placeholder='Select an Action'
                  value={selectAction}
                  onChange={(action) => {
                    setSelectAction(action);
                  }}
                >
                  {Object.keys(ContentAction).map((action) => {
                    return (
                      <Option value={action} key={action}>
                        <Tooltip title={action}>
                          <span> {action}</span>
                        </Tooltip>
                      </Option>
                    );
                  })}
                </Select>
              </Tooltip>
            </span>
            <span>
              <Tooltip title='Select an Person'>
                <Select
                  style={{ width: '150px' }}
                  placeholder='Select a Person'
                >
                  {selectGroup &&
                    selectGroup.length > 0 &&
                    selectGroup.map((user) => {
                      return (
                        <Option value={user.name} key={user.name}>
                          <Avatar size='small' src={user.avatar} />
                          &nbsp;&nbsp; <strong>{user.alias}</strong>
                        </Option>
                      );
                    })}
                </Select>
              </Tooltip>
            </span>
            <span className='history-refresh-button'>
              <Tooltip title='Refresh'>
                <Button type='primary'>Search</Button>
              </Tooltip>
            </span>
          </div>
          <Divider />
          <div>aaaaas</div>
        </Modal>
      </div>
    </Tooltip>
  );
};

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  ownedProjects: state.project.owned,
  sharedProjects: state.project.shared,
  aliases: state.system.aliases,
  group: state.group.group,
});

export default connect(mapStateToProps, { getGroup })(ShowProjectHistory);
