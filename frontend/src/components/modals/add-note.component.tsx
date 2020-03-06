import React from 'react';
import { Modal, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps} from 'react-router';
import { createNote } from '../../features/notes/actions';
import { IState } from '../../store';
import './modals.styles.less';

type NoteProps = {
    projectId: number,
    createNote: (projectId: number, name: string) => void;
};

type ModalState = {
  isShow: boolean;
  noteName: string;
};

class AddNote extends React.Component<NoteProps & RouteComponentProps, ModalState> {
  state: ModalState = {
    isShow: false,
    noteName: ''
  };

  showModal = () => {
    this.setState({ isShow: true });
  };

  addNote = () => {
    this.props.createNote(this.props.projectId, this.state.noteName);
    this.setState({ isShow: false });
    this.props.history.push("/notes")
  };

  onCancel = () => {
    this.setState({ isShow: false });
  };
  
  render() {
    return (
      <div className="add-note" title='Create New Note'>
        <PlusOutlined style={{ fontSize: 20, cursor: 'pointer' }} onClick={this.showModal} title='Create New Note' />
        <Modal
          title="Create New Note"
          visible={this.state.isShow}
          onCancel={this.onCancel}
          onOk={() => this.addNote}
          footer={[
            <Button key="cancel" onClick={this.onCancel}>
              Cancel
            </Button>,
            <Button key="create" type="primary" onClick={this.addNote}>
              Create
            </Button>
          ]}
        >
          <Input
            placeholder="Enter Note Name"
            onChange={e => this.setState({ noteName: e.target.value })}
            onPressEnter={this.addNote}
            allowClear
          />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
    projectId: state.project.project.id
  });

export default connect(mapStateToProps, { createNote })(withRouter(AddNote));