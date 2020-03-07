import React from 'react';
import { connect } from 'react-redux';
import { IState } from '../store/index';
import { Divider, Tag, Button, Tooltip } from 'antd';
import AddLabel from '../components/modals/add-label.component';
import { Label } from '../features/label/interfaces'
import { labelsUpdate } from '../features/label/actions';
import { TagOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';

import './pages.style.less';

type LabelsProps = {
  labels: Label[];
  labelsUpdate: () => void;
}

class LablesPage extends React.Component<LabelsProps> {
  componentDidMount() {
    this.props.labelsUpdate();
  }

  handleClose = (removedLabel: Label) => {
    
  };

  forMap = (label: Label) => {
    const tagElem = (
      <Tag
        className='label'
        closable
        onClose={(e: any)  => {
          e.preventDefault();
          this.handleClose(label);
        }}
      >
        <TagOutlined/ > &nbsp; {label.name}
      </Tag>
    );
    return (
      <span key={label.name} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  render() {
    const tagChild = this.props.labels.map(this.forMap);
    return (
      <div className='labels'>
          <AddLabel />
          <Divider />
          <div>
            <TweenOneGroup
              enter={{
                scale: 0.8,
                opacity: 0,
                type: 'from',
                duration: 100,
              }}
              leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
              appear={false}
            >
              {tagChild}
            </TweenOneGroup>
          </div>
      </div>
    );
  }
};

const mapStateToProps = (state: IState) => ({
  labels: state.label.labels
});

export default connect(mapStateToProps, { labelsUpdate })(LablesPage);