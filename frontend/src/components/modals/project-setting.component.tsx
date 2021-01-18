import React, { useState } from 'react';
import CSS from 'csstype';
import {
  Checkbox,
  Modal,
} from 'antd';
import { RGBColor, SwatchesPicker } from 'react-color';
import { IState } from '../../store';
import { connect } from 'react-redux';
import './modals.styles.less';
import { Project } from '../../features/project/interface';
import { BgColorsOutlined } from '@ant-design/icons';


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

  const [displayColorIcon, setDisplayColorIcon] = useState(false);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [bgColor, setBgColor] = useState({
    r: '255',
    g: '255',
    b: '255',
    a: '100',
  })

  const onCheckColorIcon = (e: any) => {
    setDisplayColorIcon(!displayColorIcon);
    if (!e.target.check) {
      setBgColor({
          r: '255',
          g: '255',
          b: '255',
          a: '100',
      });
    }
}

  const handleClickSetColorIcon = () => {
      setDisplayColorPicker(!displayColorPicker);
  };

  const handleColorChange = (c : any , event : any) => {
    setBgColor(c.rgb);
  };  

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
            onChange={onCheckColorIcon}
        >
            Set Bujo Background Color
        </Checkbox>

        {displayColorIcon ? <BgColorsOutlined onClick={handleClickSetColorIcon}/> : null}

        <div>
            { displayColorPicker ? <div style={ popover }>
            <div style={ cover } onClick={ handleClickSetColorIcon }/>
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
});

export default connect(mapStateToProps, {})(ProjectSetting);
