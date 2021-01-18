import React, {useState} from 'react';
import {Button, message, Upload} from 'antd';
import {RcFile} from 'antd/lib/upload';
import {UploadOutlined} from '@ant-design/icons';
import Axios from 'axios';

const INITIAL_STATE = {
  uploading: false,
  prevUrl: '',
  file: (null as unknown) as RcFile,
};

type uploadProps = {};

const AvatarUploader: React.FC<uploadProps> = () => {
  const [state, setAState] = useState(INITIAL_STATE);

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return false;
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('Image must smaller than 1MB!');
      return false;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      let thumbUrl = e.target ? (e.target.result as string) : '';
      setAState({...state, prevUrl: thumbUrl, file: file});
    };
    // prevent auto upload behaviour by return false
    return false;
  };

  const handleUpload = (file: RcFile) => {
    if (!file) {
      message.warn('Please select an image for avatar and then click Upload button');
      return;
    }
    let formData = new FormData();
    formData.append('file', file);
    setAState({...state, uploading: true});
    Axios.post('/api/uploadAvatar', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
        .then((res) => {
          setAState({...state, uploading: false});
        })
        .catch((e) => message.error('Problem while uploading'));
  };

  return (
      <div className="upload-container">
        <Upload
            listType="picture-card"
            showUploadList={false}
            beforeUpload={beforeUpload}
        >
          <img
              src={state.prevUrl.length > 0 ? state.prevUrl : 'https://user-images.githubusercontent.com/122956/103820529-62671e00-5021-11eb-8d36-16dd6e32328f.png'}
              alt="avatar"
              style={{width: '100%'}}
          />

        </Upload>
        <Button
            onClick={() => handleUpload(state.file)}
            loading={state.uploading}
        >
          <UploadOutlined/> Upload&nbsp;
        </Button>
      </div>
  );
};

export default AvatarUploader;
