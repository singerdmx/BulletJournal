import React from 'react';
import { connect } from 'react-redux';
import { IState } from '../store/index';
import { Tag, Collapse, Button, AutoComplete, Tooltip } from 'antd';
import AddLabel from '../components/modals/add-label.component';
import { Label, stringToRGB } from '../features/label/interfaces'
import { labelsUpdate, deleteLabel, addSelectedLabel, removeSelectedLabel } from '../features/label/actions';
import { TagOutlined, SearchOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';

import './pages.style.less';

const { Panel } = Collapse;

type LabelsProps = {
  labels: Label[];
  labelsSelected: Label[];
  labelOptions: Label[];
  labelsUpdate: () => void;
  deleteLabel: (labelId: number, name: string) => void;
  addSelectedLabel: (val: string) => void;
  removeSelectedLabel: (val: string) => void;
}

class LablesPage extends React.Component<LabelsProps> {

  componentDidMount() {
    this.props.labelsUpdate();
  }

  handleClose = (removedLabel: Label) => {
    this.props.removeSelectedLabel(removedLabel.value);
  };

  handleDelete = (removedLabel: Label) => {
    this.props.deleteLabel(removedLabel.id, removedLabel.value);
  };

  handleClickSearch = (e: any) => {
  };

  handleSelectSearch = (val: string) => {
    this.props.addSelectedLabel(val);
  };

  forMap = (label: Label) => {
    const tagElem = (
      <Tag
        className='label'
        closable
        color={stringToRGB(label.value)}
        onClose={(e: any)  => {
          e.preventDefault();
          this.handleClose(label);
        }}
      >
        <TagOutlined/ > &nbsp; {label.value}
      </Tag>
    );
    return (
      <span key={label.value} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  mapLabels = (label: Label) => {
    const tagElem = (
      <Tag
        className='label'
        closable
        color={stringToRGB(label.value)}
        onClose={(e: any)  => {
          e.preventDefault();
          this.handleClose(label);
        }}
      >
        <TagOutlined/ > &nbsp; {label.value}
      </Tag>
    );
    return (
      <span key={label.value} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  render() {
    return (
      <div className='labels'>
          <AddLabel />
          <Tooltip title="search">
            <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={this.handleClickSearch} />
          </Tooltip>
          <AutoComplete
            style={{ width: 200 }}
            options={this.props.labelOptions}
            placeholder="Enter Label"
            allowClear
            onSelect={this.handleSelectSearch}
            filterOption={(inputValue: string, option: any) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          />
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
                  {this.props.labelsSelected.map(this.forMap)}
                </TweenOneGroup>
              </div>
          <Collapse defaultActiveKey={'availableLabels'}>
            <Panel header='' key="availableLabels">
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
                  {this.props.labels.map(this.mapLabels)}
                </TweenOneGroup>
              </div>
            </Panel>
          </Collapse>
      </div>
    );
  }
};

const mapStateToProps = (state: IState) => ({
  labels: state.label.labels,
  labelsSelected: state.label.labelsSelected,
  labelOptions: state.label.labelOptions
});

export default connect(mapStateToProps, { labelsUpdate, deleteLabel, addSelectedLabel, removeSelectedLabel })(LablesPage);