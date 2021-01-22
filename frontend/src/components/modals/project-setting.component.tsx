import React, {useEffect, useState} from 'react';
import {Checkbox, Modal, Tooltip, Select, Avatar,} from 'antd';
import {RGBColor, SwatchesPicker} from 'react-color';
import {IState} from '../../store';
import {connect} from 'react-redux';
import './modals.styles.less';
import {Project, ProjectSetting} from '../../features/project/interface';
import {BgColorsOutlined, FileExcelOutlined, SettingOutlined, CrownOutlined} from '@ant-design/icons';
import {updateProjectSetting, updateSettingShown} from '../../features/project/actions';
import {ProjectType} from "../../features/project/constants";
import {Button as FloatButton, darkColors, lightColors} from "react-floating-action-button";
import {getGroupByProject} from '../../pages/projects/projects.pages';
import { GroupsWithOwner } from '../../features/group/interface';
import { iconMapper } from '../project-dnd/project-dnd.component';

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
  } = props;
  
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [bgColor, setBgColor] = useState({
    r: '0',
    g: '0',
    b: '0',
    a: '0',
  });

  useEffect(() => {
    setDisplayColorPicker(!!projectSetting.color);
    setBgColor(projectSetting.color ? JSON.parse(projectSetting.color) : {
      r: '0',
      g: '0',
      b: '0',
      a: '0',
    })
  }, [projectSetting]);

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

  const handleColorChange = (c : any , event : any) => {
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

  const color : RGBColor = {
    r: Number(bgColor.r),
    g: Number(bgColor.g),
    b: Number(bgColor.b),
    a: Number(bgColor.a),
  }

  const openModal = () => updateSettingShown(true);
  const closeModal = () => updateSettingShown(false);

  const group = getGroupByProject(groups, project);
  const { Option } = Select;

  const handleChange = (value: any) => {
    if (value.length === 0) return;
    console.log('set project owner ' + value);
  }

  const getModal = () => (
    <Modal
      title={'BuJo Settings'}
      visible={settingShown}
      onCancel={closeModal}
      footer={false}
    >
      <div>
        Owner <CrownOutlined style={{marginRight: '8px'}} />
        <Tooltip title='Set Project Owner'>
          <Select
            style={{ minWidth: '100px', maxWidth: '500px'}}
            placeholder='Select User'
            defaultValue={project.owner.name}
            onChange={handleChange}
          >
            {group.users.map((u, index) => { 
              return (
                <Option value={u.name} key={u.id}>
                  <Tooltip
                    title={`${u.alias}`}
                    placement='left'
                  >
                    <span>
                      <Avatar size='small' src={u.avatar} />
                        &nbsp; {u.alias}
                    </span>
                  </Tooltip>
                </Option>
              )})
            } 
          </Select>
        </Tooltip>
      </div>
      {project?.projectType === ProjectType.TODO && <div>
        <Checkbox
            style={{marginTop: '-0.5em'}}
            onChange={handleAutoDeleteChange}
            checked={projectSetting.autoDelete}
        >
          Automatically delete past due tasks
        </Checkbox>
        <FileExcelOutlined/>
      </div>}
      <div>
        <Checkbox
            style={{ marginTop: '-0.5em' }}
            checked={displayColorPicker}
            onChange={onCheckColorIcon}
        >
            Set background color
        </Checkbox>
        <BgColorsOutlined />

        <div>
            { displayColorPicker ? 
            <div>
              <SwatchesPicker
              color={color}
              onChange={ handleColorChange }
              width={420} 
              height={150}
              colors={[['#FCE9DA', '#FFCEC7', '#FFD0A6', '#E098AE'], 
                      ['#EFEFF1', '#ECD4D4', '#CCDBE2', '#C9CBE0'], 
                      ['#E9E1D4', '#F5DDAD', '#F1BCAE', '#C9DECF'], 
                      ['#F2EEE5', '#E5C1C5', '#C3E2DD', '#6ECEDA'], 
                      ['#D5E1DF', '#EACACB', '#E2B3A3', '#A3B6C5'],
                      ['#FDF2F0', '#F8DAE2', '#DEB3CF', '#B57FB3'],
                      ['#FAF0E4', '#EECFBB', '#F6B99D', '#CB8A90'],
                      ['#FEF5D4', '#FFD6AA', '#EFBAD6', '#DADAFC']]}
              />
            </div> : null }
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
          <SettingOutlined />
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
})(ProjectSettingDialog);
