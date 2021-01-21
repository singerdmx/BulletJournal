import React, { useState } from 'react';
import {Input, Result, Tooltip} from 'antd';
import {
    CloseCircleOutlined,
    ExportOutlined,
    PlusCircleOutlined,
    SendOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { shareTask } from '../../features/tasks/actions';
import { shareNoteByEmail } from '../../features/notes/actions';
import {
  getProjectItemType,
  ProjectType,
} from '../../features/project/constants';
import { clearUser, updateUser } from '../../features/user/actions';
import './share-item-modal.styles.less';
import './share-item-by-email.styles.less'
import { Content } from '../../features/myBuJo/interface';

type ProjectItemProps = {
  type: ProjectType;
  projectItemId: number;
  shareNoteByEmail: (
    noteId: number,
    contents: Content[],
    emails: string[],
    targetUser?: string,
    targetGroup?: number,
  ) => void;
  contents: Content[];
};

const ShareProjectItemByEmail: React.FC<ProjectItemProps> = (
  props
) => {

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
          <div>
              <Tooltip title='Add more recipients'>
                  <PlusCircleOutlined onClick={() => handleAdd()}/>
              </Tooltip>
          </div>
          <div>
              <Tooltip title='Send email'>
                  <SendOutlined 
                  onClick={()=> {
                    props.shareNoteByEmail(
                      props.projectItemId, 
                      props.contents,
                      inputList
                      );
                  }} />
              </Tooltip>
          </div>
      </div>
      <div className='email-drawer'>
          {inputList.map((input, id) => {
              return (
                  <div className="record-drawer" key={`${id}`}>
                      <div className="input-drawer">
                          <Input
                              type="text"
                              placeholder="Recipient's email address"
                              value={input}
                              onChange={e => handleChange(id, e)}
                          />
                      </div>
                      <div className="remove-drawer">
                          <Tooltip title='Remove this recipient'>
                              <CloseCircleOutlined onClick={() => handleRemove(id)}/>
                          </Tooltip>
                      </div>
                  </div>
              );
          })}
      </div>
      <div className="share-info">
        <Result
          icon={<ExportOutlined />}
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
  contents: state.note.contents
});

export default connect(mapStateToProps, {
  shareNoteByEmail,
})(ShareProjectItemByEmail);
