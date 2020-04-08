import React from 'react';
import { Upload, Popover } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';

import './note-editor.style.less';

const FileUploader = () => {
  const { Dragger } = Upload;

  const Uploader = (
    <Dragger>
      <p>
        <InboxOutlined />
      </p>
      <p>Click or drag file to this area to upload</p>
    </Dragger>
  );
  return (
    <Popover content={Uploader} placement="bottom" trigger="click">
      <button type="button" className="file-upload-button">
        <UploadOutlined />
      </button>
    </Popover>
  );
};

export default FileUploader;
