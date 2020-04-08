import React from 'react';
import { Upload } from 'antd';

const FileUploader = () => {
  const { Dragger } = Upload;
  return (
    <div className="uploader">
      <Dragger></Dragger>
    </div>
  );
};

export default FileUploader;
