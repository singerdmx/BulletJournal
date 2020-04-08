import React from 'react';
import { AutoComplete, Button, Form, Input, Result } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { shareTask } from '../../features/tasks/actions';
import { shareNote } from '../../features/notes/actions';
import { ProjectType } from '../../features/project/constants';
import './share-item-modal.styles.less';

type ProjectItemProps = {
  type: ProjectType;
  projectItemId: number;
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
        <div className="share-info">
          <Result icon={<LinkOutlined />} title={`Generate Shareable LINK`} />
        </div>
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
      </Form>
    </div>
  );
};

export default connect(null, {
  shareTask,
  shareNote,
})(ShareProjectItemGenerateLink);
