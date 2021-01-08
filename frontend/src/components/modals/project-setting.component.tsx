import React, { useState } from 'react';
import CSS from 'csstype';
import {
  Checkbox,
  Modal,
} from 'antd';
import { CompactPicker, RGBColor } from 'react-color';
import { IState } from '../../store';
import { connect } from 'react-redux';
import './modals.styles.less';
import { Project } from '../../features/project/interface';


type ProjectSettingProps = {
  project: Project | undefined;
  visible: boolean;
  onCancel: () => void;
};

const ProjectSetting: React.FC<ProjectSettingProps> = (props) => {
  const {
    project,
    visible,
  } = props;

  
  const onCheck = (e: any) => console.log(e.target.checked);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClickSetColor = () => {
      setDisplayColorPicker(!displayColorPicker);
  };

  const handleChange = (c : any , event : any) => {
    setBgColor(c.rgb);
  };

  const [bgColor, setBgColor] = useState({
    r: '255',
    g: '255',
    b: '255',
    a: '100',
  })

  const swatch : CSS.Properties = {
    padding: '5px',
    borderRadius: '1px',
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    display: 'inline-block',
    cursor: 'pointer',
    background: `rgba(${ bgColor.r }, ${ bgColor.g }, ${ bgColor.b }, ${ bgColor.a })`,
  }

  const popover : CSS.Properties = {
    position: 'absolute', 
    zIndex: 2
  }

  const cover : CSS.Properties = {
    position: 'fixed', 
    top: '0px', 
    right: '0px', 
    bottom: '0px', 
    left: '0px'
  }

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
            style={{ marginRight: '0.5rem', marginTop: '-0.5em' }}
            onChange={onCheck}
        >
            Auto Delete
        </Checkbox>

        <div>
            <div style={ swatch } onClick={ handleClickSetColor }> select color 
            </div> 
            { displayColorPicker ? <div style={ popover }>
            <div style={ cover } onClick={ handleClickSetColor }/>
            <CompactPicker color={color}  onChange={ handleChange } />
            </div> : null }

        </div>
      </div>
    </Modal>
  );
};

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
});

export default connect(mapStateToProps, {})(ProjectSetting);
