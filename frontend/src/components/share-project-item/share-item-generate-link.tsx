import React from 'react';
import { AutoComplete, Button, Form, Input, Result, message } from 'antd';
import { LinkOutlined, CopyOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { shareTask } from '../../features/tasks/actions';
import { shareNote } from '../../features/notes/actions';
import { ProjectType } from '../../features/project/constants';
import CopyToClipboard from 'react-copy-to-clipboard';
import './share-item-modal.styles.less';
import { IState } from '../../store';

type ProjectItemProps = {
  type: ProjectType;
  projectItemId: number;
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
  const [form] = Form.useForm();

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
      props.projectItemId,
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
          <Button
            type="primary"
            htmlType="submit"
            onClick={() =>
              form
                .validateFields()
                .then((values) => {
                  shareProjectItem(values);
                })
                .catch((info) => console.log(info))
            }
          >
            Generate
          </Button>
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
                style={{ marginRight: '0.5em' }}
              >{`${window.location.origin.toString()}/public/items/${sharedLink}`}</span>
              <CopyToClipboard
                text={`${window.location.origin.toString()}/public/items/${sharedLink}`}
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
});

export default connect(mapStateToProps, {
  shareTask,
  shareNote,
})(ShareProjectItemGenerateLink);
