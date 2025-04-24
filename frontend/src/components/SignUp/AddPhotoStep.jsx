import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('Sadece JPG/PNG dosyası yükleyebilirsiniz!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Resim boyutu 2MB\'tan küçük olmalı!');
    }
    return isJpgOrPng && isLt2M;
};

export const AddPhotoStep = ({form}) => {
    // const [loading, setLoading] = useState(false);
    // const [imageUrl, setImageUrl] = useState();

    // const handleChange = (info) => {
    //     if (info.file.status === 'uploading') {
    //         setLoading(true);
    //         return;
    //     }
    //     if (info.file.status === 'done') {
    //         getBase64(info.file.originFileObj, (url) => {
    //             setLoading(false);
    //             setImageUrl(url);
    //         });
    //     }
    // };

    // const uploadButton = (
    //     <Button
    //         style={{ border: 0, background: 'none' }}
    //         type="button"
    //     >
    //         {loading ? <LoadingOutlined /> : <PlusOutlined />}
    //         <div style={{ marginTop: 8 }}>Yükle</div>
    //     </Button>
    // );

    // return (
    //     <Upload
    //         name="avatar"
    //         listType="picture-circle"
    //         showUploadList={false}
    //         action="https://mockapi.io/upload"
    //         beforeUpload={beforeUpload}
    //         onChange={handleChange}
    //     >
    //         {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    //     </Upload>
    // );
};
