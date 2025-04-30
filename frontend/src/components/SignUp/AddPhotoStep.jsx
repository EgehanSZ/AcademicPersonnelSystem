import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { Form } from 'antd';
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
        return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Resim boyutu 2MB\'tan küçük olmalı!');
        return false;
    }
    return true;
};

export const AddPhotoStep = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    const handleChange = (info) => {
        const file = info.file.originFileObj;
        if (!file) return;

        setLoading(true);

        // Görsel önizleme için
        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result);
            setLoading(false);
        };
        reader.readAsDataURL(file);
    };

    const uploadButton = (
        <Button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Yükle</div>
        </Button>
    );

    return (
        <Form.Item
            name="resimUrl"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
                return e && e.fileList ? e.fileList : [];
            }}
            rules={[{ required: true, message: 'Lütfen bir resim yükleyin!' }]}>
            <Upload
                name="resimUrl"
                listType="picture-circle"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                customRequest={({ onSuccess }) => { setTimeout(() => onSuccess("ok"), 0); }}
            >
                {imageUrl ? (
                    <div style={{ width: '100px', height: '100px', overflow: 'hidden', borderRadius: '50%' }}>
                        <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                ) : (
                    uploadButton
                )}
            </Upload>
        </Form.Item>
    );
};