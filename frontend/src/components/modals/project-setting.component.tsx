import React, { useState } from 'react';
import {
  Checkbox,
  Modal,
  Tooltip,
} from 'antd';
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

  return (
    <Modal
      title={'Project Settings'}
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
          
      </div>
    </Modal>
  );
};

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
});

export default connect(mapStateToProps, {})(ProjectSetting);
