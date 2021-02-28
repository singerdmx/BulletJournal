import React, {useEffect, useState} from 'react';
import {Avatar, Checkbox, Modal, Select, Tooltip,} from 'antd';
import {RGBColor, SwatchesPicker} from 'react-color';
import {IState} from '../../store';
import {connect} from 'react-redux';
import './modals.styles.less';
import {Project, ProjectSetting} from '../../features/project/interface';
import {
  BgColorsOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CrownOutlined,
  FileExcelOutlined,
  SettingOutlined
} from '@ant-design/icons';
import {setProjectOwner, updateProjectSetting, updateSettingShown} from '../../features/project/actions';
import {ProjectType} from "../../features/project/constants";
import {Button as FloatButton, darkColors, lightColors} from "react-floating-action-button";
import {getGroupByProject} from '../../pages/projects/projects.pages';
import {GroupsWithOwner} from '../../features/group/interface';
import {useHistory} from 'react-router-dom';
import {swatchesPickerColors} from "../../utils/Util";

type ProjectSettingProps = {
  project: Project | undefined;
  projectSetting: ProjectSetting;
  settingShown: boolean;
  updateProjectSetting: (
      projectId: number,
      autoDelete: boolean,
      color: string | undefined,
  ) => void;
  updateSettingShown: (
      visible: boolean
  ) => void;
  setProjectOwner: (
      onSuccess: Function,
      projectId: number,
      owner: string,
  ) => void;
};

type GroupProps = {
  groups: GroupsWithOwner[];
};

const ProjectSettingDialog: React.FC<ProjectSettingProps & GroupProps> = (props) => {
  const {
    groups,
    project,
    projectSetting,
    settingShown,
    updateProjectSetting,
    updateSettingShown,
    setProjectOwner,
  } = props;

  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [bgColor, setBgColor] = useState({
    r: '0',
    g: '0',
    b: '0',
    a: '0',
  });
  const [currentOwner, setCurrentOwner] = useState("");

  useEffect(() => {
    setDisplayColorPicker(!!projectSetting.color);
    setBgColor(projectSetting.color ? JSON.parse(projectSetting.color) : {
      r: '0',
      g: '0',
      b: '0',
      a: '0',
    })
  }, [projectSetting]);

  useEffect(() => {
    if (project) {
      setCurrentOwner(project?.owner.name);
    }
  }, [project]);

  const history = useHistory();

  if (!project) {
    return null;
  }

  const onCheckColorIcon = (e: any) => {
    setDisplayColorPicker(!displayColorPicker);
    if (!e.target.checked && project) {
      updateProjectSetting(project.id, projectSetting.autoDelete, undefined);
      setBgColor({
        r: '0',
        g: '0',
        b: '0',
        a: '0',
      })
    }
  }

  const handleColorChange = (c: any, event: any) => {
    if (project) {
      updateProjectSetting(project.id, projectSetting.autoDelete, JSON.stringify(c.rgb));
    }
    setBgColor(c.rgb);
  };

  const handleAutoDeleteChange = (e: any) => {
    if (project) {
      updateProjectSetting(project.id, e.target.checked, projectSetting.color);
    }
  };

  const color: RGBColor = {
    r: Number(bgColor.r),
    g: Number(bgColor.g),
    b: Number(bgColor.b),
    a: Number(bgColor.a),
  }

  const openModal = () => updateSettingShown(true);
  const closeModal = () => updateSettingShown(false);

  const group = getGroupByProject(groups, project);
  const {Option} = Select;

  const handleSelectChange = (value: any) => {
    if (value.length === 0) return;
    setCurrentOwner(value);
  }

  const handleSetOwner = (change: boolean) => {
    if (change) {
      setProjectOwner(
          () => {
            history.push('/projects')
          },
          project.id,
          currentOwner
      )
    } else {
      setCurrentOwner(project.owner.name);
    }
  }

  const getModal = () => (
      <Modal
          title={`BuJo '${project.name}' Settings`}
          visible={settingShown}
          onCancel={closeModal}
          footer={false}
      >
        {group && <div style={{marginBottom: '5px'}}>
          <CrownOutlined style={{marginRight: '8px'}}/>Owner
          <Tooltip title='Set Project Owner'>
            <Select
                style={{width: '300px', marginLeft: '8px'}}
                defaultValue={project.owner.name}
                onChange={handleSelectChange}
                value={currentOwner}
            >
              {group.users.filter((u) => u.accepted).map((u, index) => {
                return (
                    <Option value={u.name} key={index}>
                      <Tooltip
                          title={`${u.alias}`}
                          placement='left'
                      >
                    <span>
                      <Avatar size='small' src={u.avatar}/>
                      &nbsp; {u.alias}
                    </span>
                      </Tooltip>
                    </Option>
                )
              })
              }
            </Select>
          </Tooltip>
          <Tooltip placement="top" title="Change BuJo Owner">
            <CheckCircleOutlined
                onClick={() => handleSetOwner(true)}
                style={{
                  marginLeft: '20px',
                  cursor: 'pointer',
                  color: '#00e600',
                  fontSize: 20,
                  visibility:
                      currentOwner !== project.owner.name
                          ? 'visible'
                          : 'hidden',
                }}
            />
          </Tooltip>
          <Tooltip placement="top" title="Cancel">
            <CloseCircleOutlined
                onClick={() => handleSetOwner(false)}
                style={{
                  marginLeft: '20px',
                  cursor: 'pointer',
                  color: '#ff0000',
                  fontSize: 20,
                  visibility:
                      currentOwner !== project.owner.name
                          ? 'visible'
                          : 'hidden',
                }}
            />
          </Tooltip>
        </div>}
        {project?.projectType === ProjectType.TODO && <div style={{marginBottom: '5px'}}>
          <Checkbox
              style={{marginTop: '-0.5em'}}
              onChange={handleAutoDeleteChange}
              checked={projectSetting.autoDelete}
          >
            Automatically delete past due tasks
          </Checkbox>
          <FileExcelOutlined/>
        </div>}
        <div style={{marginBottom: '5px'}}>
          <Checkbox
              style={{marginTop: '-0.5em'}}
              checked={displayColorPicker}
              onChange={onCheckColorIcon}
          >
            Set background color
          </Checkbox>
          <BgColorsOutlined/>
          <div style={{marginTop: '5px'}}>
            {displayColorPicker &&
            <div>
              <SwatchesPicker
                  color={color}
                  onChange={handleColorChange}
                  width={420}
                  height={130}
                  colors={swatchesPickerColors}
              />
            </div>}
          </div>
        </div>
      </Modal>
  );

  return (
      <>
        <FloatButton
            tooltip="Settings"
            onClick={openModal}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
        >
          <SettingOutlined/>
        </FloatButton>
        {getModal()}
      </>
  );
};

const mapStateToProps = (state: IState) => ({
  groups: state.group.groups,
  project: state.project.project,
  projectSetting: state.project.setting,
  settingShown: state.project.settingShown,
});

export default connect(mapStateToProps, {
  updateProjectSetting,
  updateSettingShown,
  setProjectOwner,
})(ProjectSettingDialog);
