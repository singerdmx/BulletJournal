import React, { useState } from 'react';
import {
  Checkbox,
  Modal,
} from 'antd';
import { RGBColor, SwatchesPicker } from 'react-color';
import { IState } from '../../store';
import { connect } from 'react-redux';
import './modals.styles.less';
import {Project, ProjectSetting} from '../../features/project/interface';
import { BgColorsOutlined } from '@ant-design/icons';
import {updateProjectSetting} from '../../features/project/actions';

type ProjectSettingProps = {
  project: Project | undefined;
  projectSetting: ProjectSetting;
  visible: boolean;
  onCancel: () => void;
  updateProjectSetting: (
    projectId: number,
    autoDelete: boolean,
    color: string | undefined,
  ) => void;
};

const ProjectSettingDialog: React.FC<ProjectSettingProps> = (props) => {
  const {
    project,
    projectSetting,
    visible,
    updateProjectSetting,
  } = props;

  const [displayColorPicker, setDisplayColorPicker] = useState(!!projectSetting.color);
  
  const [bgColor, setBgColor] = useState(projectSetting.color ? JSON.parse(projectSetting.color) : {
      r: '0',
      g: '0',
      b: '0',
      a: '0',
    })

  const onCheckColorIcon = (e: any) => {
    setDisplayColorPicker(!displayColorPicker);
    if (!e.target.checked && project) {
      updateProjectSetting(project.id, projectSetting.autoDelete, undefined);
    } 
  }

  const handleColorChange = (c : any , event : any) => {
    if (project) {
      updateProjectSetting(project.id, projectSetting.autoDelete, JSON.stringify(c.rgb));
    }
    setBgColor(c.rgb);
  };  

  const color : RGBColor = {
    r: Number(bgColor.r),
    g: Number(bgColor.g),
    b: Number(bgColor.b),
    a: Number(bgColor.a),
  }

  return (
    <Modal
      title={'BuJo Settings'}
      visible={visible}
      onCancel={props.onCancel}
      footer={false}
    >
      <div>
        <Checkbox
            style={{ marginTop: '-0.5em' }}
            defaultChecked={displayColorPicker}
            onChange={onCheckColorIcon}
        >
            Set Background Color
        </Checkbox>

        <BgColorsOutlined />

        <div>
            { displayColorPicker ? 
            <div>
              <SwatchesPicker color={color}  onChange={ handleColorChange } />
            </div> : null }
        </div>
      </div>

      {/* <Checkbox
            style={{ marginRight: '0.5rem', marginTop: '-0.5em' }}
            onChange={onCheck}
        >
            Auto Delete
        </Checkbox> */}
    </Modal>
  );
};

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  projectSetting: state.project.setting
});

export default connect(mapStateToProps, {
  updateProjectSetting
})(ProjectSettingDialog);
