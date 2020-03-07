import React from 'react';
import { Modal, Input, Button, Tooltip } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps} from 'react-router';
import { createLabel } from '../../features/label/actions';
import { IState } from '../../store';
import './modals.styles.less';

type LabelProps = {
    createLabel: (name: string) => void;
};

type ModalState = {
  isShow: boolean;
  labelName: string;
};

class AddLabel extends React.Component<LabelProps & RouteComponentProps, ModalState> {
  state: ModalState = {
    isShow: false,
    labelName: ''
  };

  showModal = () => {
    this.setState({ isShow: true });
  };

  addLabel = () => {
    console.log('addLabel');
    this.props.createLabel(this.state.labelName);
    this.setState({ isShow: false, labelName: '' });
    // this.props.history.push("/labels")
  };

  onCancel = () => {
    this.setState({ isShow: false });
  };
  
  render() {
    return (
      <Tooltip placement="top" title='Create New Label'>
        <div className="add-label" >
            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} onClick={this.showModal}>
              New Label
            </Button>
            <Modal
            title="Create New Label"
            visible={this.state.isShow}
            onCancel={this.onCancel}
            onOk={() => this.addLabel}
            footer={[
                <Button key="cancel" onClick={this.onCancel}>
                Cancel
                </Button>,
                <Button key="create" type="primary" onClick={this.addLabel}>
                Create
                </Button>
            ]}
            >
            <Input
                placeholder="Enter Label Name"
                onChange={e => this.setState({ labelName: e.target.value })}
                onPressEnter={this.addLabel}
                allowClear
            />
            </Modal>
        </div>
      </Tooltip>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  labels: state.label.labels
});

export default connect(mapStateToProps, { createLabel })(withRouter(AddLabel));