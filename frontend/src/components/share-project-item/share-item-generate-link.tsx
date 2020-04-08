import React from 'react';
import { AutoComplete, Button, Form, Input, Result, message } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
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
  sharedlink: string;
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
      <Form form={form}>
        <Form.Item
          name="expiration"
          label="Expire in "
          rules={[
            { pattern: /^[0-9]*$/, message: 'Invalid Expiration in Days' },
          ]}
        >
          <AutoComplete options={options}>
            <Input suffix="Days" />
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
            Submit
          </Button>
        </Form.Item>
        <div className="share-info">
          <Result icon={<LinkOutlined />} title={`Generate Shareable LINK`}>
            {props.sharedlink && (
              <div
                className="shared-link"
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'baseline',
                }}
              >
                <span>{`${window.location.origin.toString()}/public/items/${props.sharedlink}`}</span>
                <CopyToClipboard
                  text={`${window.location.origin.toString()}/public/items/${props.sharedlink}`}
                  onCopy={() => message.success('Link Copied to Clipboard')}
                >
                  <Button type="default" size="small">
                    Copy To Clipboard
                  </Button>
                </CopyToClipboard>
              </div>
            )}
          </Result>
        </div>
      </Form>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  sharedlink: state.task.sharedLink,
});

export default connect(mapStateToProps, {
  shareTask,
  shareNote,
})(ShareProjectItemGenerateLink);
