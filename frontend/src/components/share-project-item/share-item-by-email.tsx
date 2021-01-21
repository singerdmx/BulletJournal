import React, { useState } from 'react';
import { Button, Input, Result } from 'antd';
import { CloseOutlined, MailOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { shareTask } from '../../features/tasks/actions';
import { shareNote } from '../../features/notes/actions';
import {
  getProjectItemType,
  ProjectType,
} from '../../features/project/constants';
import { clearUser, updateUser } from '../../features/user/actions';
import './share-item-modal.styles.less';
import './share-item-by-email.styles.less'

type ProjectItemProps = {
  type: ProjectType;
  projectItemId: number;
};

const ShareProjectItemByEmail: React.FC<ProjectItemProps> = (
  props
) => {

  const shareProjectItemCall: { [key in ProjectType]: Function } = {
    [ProjectType.NOTE]: () => {},
    [ProjectType.TODO]: () => {},
    [ProjectType.LEDGER]: () => {},
  };

  const shareFunction = shareProjectItemCall[props.type];

  const [inputList, setInputList] = useState([""]);

  const handleAdd = () => {
    const values = [...inputList];
    values.push("");
    setInputList(values);
  }

  const handleChange = (i: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const values = [...inputList];
    values[i] = event.target.value;
    setInputList(values);
  }

  const handleRemove = (i: number) => {
    const values = [...inputList];
    values.splice(i, 1);
    setInputList(values);
  }

  return (
    <div>
      <div className='button-drawer'>
          <div className="add-drawer">
              <Button onClick={() => handleAdd()}>
                  Add More
              </Button></div>
          <div className="send-drawer">
              <Button type="primary" onClick={()=> console.log('send')}>
                  Send Email
              </Button></div>
      </div>
      <div className='email-drawer'>
          {inputList.map((input, id) => {
              return (
                  <div className="record-drawer" key={`${id}`}>
                      <div className="input-drawer">
                          <Input
                              type="text"
                              placeholder=""
                              value={input}
                              onChange={e => handleChange(id, e)}
                          />
                      </div>
                      <div className="remove-drawer">
                          <Button onClick={() => handleRemove(id)}>
                              <CloseOutlined />
                          </Button>
                      </div>
                  </div>
              );
          })}
      </div>
      <div className="share-info">
        <Result
          icon={<MailOutlined />}
          title={`Share ${getProjectItemType(
            props.type
          ).toLocaleLowerCase()} by email`}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  shareTask,
  shareNote,
  updateUser,
  clearUser,
})(ShareProjectItemByEmail);
