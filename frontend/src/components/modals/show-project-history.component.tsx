import React, { useEffect, useState } from 'react';
import { IState } from '../../store';
import {
  Activity,
  Project,
  ProjectsWithOwner,
} from '../../features/project/interface';
import {Avatar, Button, DatePicker, Divider, Modal, Select, Tooltip} from 'antd';
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DeleteTwoTone,
  HistoryOutlined,
  PlusCircleTwoTone,
  StarTwoTone,
  TeamOutlined,
  EditTwoTone,
  SyncOutlined,
  RightCircleTwoTone,
  GiftTwoTone
} from '@ant-design/icons';
import { connect } from 'react-redux';
import {ContentAction, ProjectType} from '../../features/project/constants';
import { iconMapper } from '../side-menu/side-menu.component';
import {
  flattenOwnedProject,
  flattenSharedProject,
} from '../../pages/projects/projects.pages';
import { getGroup } from '../../features/group/actions';
import { Group, User } from '../../features/group/interface';
import moment from 'moment';
import { getProjectHistory, historyReceived } from '../../features/project/actions';
import ProjectHistory from '../project-history/project-history.component';

import './modals.styles.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

type ShowProjectHistoryProps = {
  project: Project | undefined;
  ownedProjects: Project[];
  sharedProjects: ProjectsWithOwner[];
  group: Group | undefined;
  timezone: string;
  projectHistory: Activity[];
  getGroup: (groupId: number) => void;
  getProjectHistory: (
    projectId: number,
    timezone: string,
    startDate: string,
    endDate: string,
    action: ContentAction,
    username: string
  ) => void;
  historyReceived: (activities: Activity[]) => void;
};

export const getIcon = (action: string) => {
  if (action.startsWith('ADD')) {
    return <PlusCircleTwoTone />;
  }
  if (action.startsWith('DELETE')) {
    return <DeleteTwoTone />;
  }
  if (action.startsWith('UPDATE')) {
    return <EditTwoTone />;
  }
  if (action.startsWith('COMPLETE')) {
    return <CheckCircleTwoTone />;
  }
  if (action.startsWith('UNCOMPLETE')) {
    return <CloseCircleTwoTone />;
  }
  if (action.startsWith('MOVE')) {
    return <RightCircleTwoTone />;
  }
  if (action.startsWith('SHARE')) {
    return <GiftTwoTone />;
  }
  return <StarTwoTone />;
};

const ShowProjectHistory: React.FC<ShowProjectHistoryProps> = ({
  project,
  ownedProjects,
  sharedProjects,
  group,
  projectHistory,
  timezone,
  getGroup,
  getProjectHistory,
  historyReceived,
}) => {
  const [visible, setVisible] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  //used for form
  const [selectDate, setSelectDate] = useState([
    moment().startOf('month').format('YYYY-MM-DD'),
    moment().endOf('month').format('YYYY-MM-DD'),
  ]);

  const [selectProject, setSelectProject] = useState(-1);
  const [selectAction, setSelectAction] = useState(
    'ALL_ACTIONS' as ContentAction
  );
  const [selectGroup, setSelectGroup] = useState([] as User[]);
  const [selectUser, setSelectUser] = useState('Everyone');
  const [actions, setActions] = useState(Object.values(ContentAction));

  const onCancel = () => setVisible(false);
  const openModal = () => {
    historyReceived([]);
    setVisible(true);
  };

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

  const handleRangeChange = (dates: any, dateStrings: string[]) => {
    setSelectDate([dateStrings[0], dateStrings[1]]);
  };

  const handleGetHistory = () => {
    getProjectHistory(
      selectProject,
      timezone,
      selectDate[0],
      selectDate[1],
      selectAction,
      selectUser
    );
  };

  if (!project || project.shared) {
    return null;
  }

  const filterActions = (action: ContentAction, projectType: ProjectType) => {
    const s = action.toString().toLowerCase();
    switch (projectType) {
      case ProjectType.LEDGER:
        return !s.includes('note') && !s.includes('task');
      case ProjectType.TODO:
        return !s.includes('transaction') && !s.includes('note');
      case ProjectType.NOTE:
        return !s.includes('transaction') && !s.includes('task');
      default:
        return true;
    }
  }

  return (
    <Tooltip title='Show History'>
      <div className='show-project-history'>
        <HistoryOutlined
          style={{ fontSize: 20, cursor: 'pointer' }}
          onClick={openModal}
        />
        <Modal
          title='BuJo History'
          visible={visible}
          onCancel={onCancel}
          footer={false}
          destroyOnClose={true}
        >
          <div>
            <div style={{ paddingBottom: '20px' }}>
              <div className='history-label'>Range </div>{' '}
              <RangePicker
                ranges={{
                  Today: [moment(), moment()],
                  'This Week': [
                    moment().startOf('week'),
                    moment().endOf('week'),
                  ],
                  'This Month': [
                    moment().startOf('month'),
                    moment().endOf('month'),
                  ],
                }}
                value={[moment(selectDate[0]), moment(selectDate[1])]}
                allowClear={false}
                onChange={handleRangeChange}
              />
            </div>
            <div style={{ paddingBottom: '20px' }}>
              <div className='history-label'>BuJo </div>{' '}
              <Tooltip title='Select BuJo'>
                <Select
                  style={{ width: '256px' }}
                  placeholder='Select BuJo'
                  value={selectProject}
                  onChange={(id: number) => {
                    setSelectProject(id);
                    projects.forEach((p) => {
                      if (p.id === id) {
                        getGroup(p.group.id);
                        setSelectUser('Everyone');
                        setActions(Object.values(ContentAction).filter(action => filterActions(action, p.projectType)));
                      }
                    });
                  }}
                >
                  {projects.map((project) => {
                    return (
                      <Option value={project.id} key={project.id}>
                        <Tooltip
                          title={`${project.name} (Group ${project.group.name})`}
                          placement='left'
                        >
                          <span>
                            <Avatar size='small' src={project.owner.avatar} />
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
              <Select
                style={{ width: '160px', marginRight: '25px' }}
                value={selectAction.replace('_', ' ')}
                onChange={(action) => {
                  let actionKey = action.replace(' ', '_');
                  setSelectAction(actionKey as ContentAction);
                }}
              >
                {actions.map((action) => {
                  return (
                    <Option value={action} key={action}>
                      <Tooltip key={action} title={action} placement='left'>
                        <span>
                          {getIcon(action)}&nbsp;{action.replace('_', ' ')}
                        </span>
                      </Tooltip>
                    </Option>
                  );
                })}
              </Select>
            </span>
            <span>
              <Tooltip title='Select User'>
                <Select
                  style={{ width: '150px' }}
                  placeholder='Select User'
                  value={selectUser}
                  onChange={(user) => {
                    setSelectUser(user);
                  }}
                >
                  <Option value='Everyone' key='Everyone'>
                    <TeamOutlined style={{ fontSize: '20px' }} />
                    &nbsp;&nbsp;&nbsp;&nbsp;<strong>Everyone</strong>
                  </Option>
                  {selectGroup &&
                    selectGroup.length > 0 &&
                    selectGroup.map((user) => {
                      return (
                        <Option value={user.name} key={user.name}>
                          <Tooltip title={user.alias} placement='right'>
                          <span><Avatar size='small' src={user.avatar}/>
                            &nbsp;&nbsp; <strong>{user.alias}</strong></span>
                          </Tooltip>
                        </Option>
                      );
                    })}
                </Select>
              </Tooltip>
            </span>
            <span className='history-refresh-button'>
              <Button type="primary" icon={<SyncOutlined />} onClick={handleGetHistory}>Refresh</Button>
            </span>
          </div>
          <Divider />
          <ProjectHistory activities={projectHistory} />
        </Modal>
      </div>
    </Tooltip>
  );
};

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  ownedProjects: state.project.owned,
  sharedProjects: state.project.shared,
  group: state.group.group,
  projectHistory: state.project.projectHistory,
  timezone: state.myself.timezone,
});

export default connect(mapStateToProps, { getGroup, getProjectHistory, historyReceived })(
  ShowProjectHistory
);
