import React, {useState} from 'react';
import { AutoComplete, Button, Form, Input, Result, message, Tooltip } from 'antd';
import { LinkOutlined, CopyOutlined, EyeOutlined, UserAddOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { shareTask } from '../../features/tasks/actions';
import { shareNote } from '../../features/notes/actions';
import { ProjectType } from '../../features/project/constants';
import CopyToClipboard from 'react-copy-to-clipboard';
import './share-item-modal.styles.less';
import { IState } from '../../store';
import {Content} from "../../features/myBuJo/interface";

type ProjectItemProps = {
  type: ProjectType;
  projectItemId: number;
  content: Content | undefined;
  sharedTaskLink: string;
  sharedNoteLink: string;
  shareTask: (
    taskId: number,
    generateLink: boolean,
    targetUser?: string,
    targetGroup?: number,
    ttl?: number
  ) => void;
  shareNote: (
    noteId: number,
    generateLink: boolean,
    targetUser?: string,
    targetGroup?: number,
    ttl?: number
  ) => void;
};

const ShareProjectItemGenerateLink: React.FC<ProjectItemProps> = (props) => {
  const {content, projectItemId} = props;
  const [form] = Form.useForm();
  const [readOnlyLink, setReadOnlyLink] = useState(true);

  const shareProjectItemCall: { [key in ProjectType]: Function } = {
    [ProjectType.NOTE]: props.shareNote,
    [ProjectType.TODO]: props.shareTask,
    [ProjectType.LEDGER]: () => {},
  };

  const shareFunction = shareProjectItemCall[props.type];

  const sharedProjectItemLink: { [key in ProjectType]: string } = {
    [ProjectType.NOTE]: props.sharedNoteLink,
    [ProjectType.TODO]: props.sharedTaskLink,
    [ProjectType.LEDGER]: '',
  };

  const sharedLink = sharedProjectItemLink[props.type];

  const shareProjectItem = (values: any) => {
    shareFunction(
      projectItemId,
      true,
      undefined,
      undefined,
      values.expiration
    );
  };

  const result = ['15', '30', '45', '60'];
  const options = result.map((time: string) => {
    return { value: time };
  });

  let generatedLink = `${window.location.origin.toString()}/public/items/${sharedLink}`;
  if (!readOnlyLink) {
    generatedLink = `${window.location.origin.toString()}/collab/?uid=${sharedLink}`;
    if (content && content.id) {
      generatedLink += content.id;
    }
  }

  return (
    <div>
      <Form form={form} layout="inline" style={{ flexWrap: 'nowrap' }}>
        <Form.Item
          name="expiration"
          rules={[
            { pattern: /^[0-9]*$/, message: 'Invalid Expiration in Days' },
          ]}
        >
          <AutoComplete options={options} style={{width: '150px'}}>
            <Input suffix="Days" prefix="Expire in:" />
          </AutoComplete>
        </Form.Item>
        <Form.Item>
          <Tooltip title='View only'>
            <EyeOutlined 
              style={{color: '#00cae9', fontSize: '20px'}} 
              onClick={() =>
                form
                  .validateFields()
                  .then((values) => {
                    setReadOnlyLink(true);
                    shareProjectItem(values);
                  })
                  .catch((info) => console.log(info))
              }
            />
          </Tooltip>
        </Form.Item>
        <Form.Item>
          <Tooltip title='Collaborative editing'>
            <UserAddOutlined
              style={{color: '#00cae9', fontSize: '20px'}} 
              onClick={() =>
                form
                  .validateFields()
                  .then((values) => {
                    setReadOnlyLink(false);
                    shareProjectItem(values);
                  })
                  .catch((info) => console.log(info))
              }
            />
          </Tooltip>
        </Form.Item>
      </Form>
      <div className="share-info">
        <Result icon={<LinkOutlined />} title={`Generate shareable link`}>
          {sharedLink && (
            <div
              className="shared-link"
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'baseline',
              }}
            >
              <span
                style={{ marginRight: '0.5em', cursor: "pointer", color: "blueviolet", textDecoration: "underline" }}
                onClick={() => window.open(generatedLink)}
              >{generatedLink}</span>
              <CopyToClipboard
                text={generatedLink}
                onCopy={() => message.success('Link Copied to Clipboard')}
              >
                <Button
                  type="default"
                  size="small"
                  icon={<CopyOutlined />}
                ></Button>
              </CopyToClipboard>
            </div>
          )}
        </Result>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  sharedTaskLink: state.task.sharedLink,
  sharedNoteLink: state.note.sharedLink,
  content: state.content.content,
});

export default connect(mapStateToProps, {
  shareTask,
  shareNote,
})(ShareProjectItemGenerateLink);
