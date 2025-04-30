import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber } from 'antd';
const { Option } = Select;

export const AcademicInfostep = () => {
  return (
    <>
      <Form.Item
        name="universite"
        label="Üniversite"
        rules={[{ required: true, message: 'Lütfen üniversite adınızı giriniz!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="fakulte"
        label="Fakülte"
        rules={[{ required: true, message: 'Lütfen fakülte adınızı giriniz!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="bolum"
        label="Bölüm"
        rules={[{ required: true, message: 'Lütfen bölüm adınızı giriniz!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="mezuniyetYili"
        label="Mezuniyet Yılı"
        rules={[{ required: true, message: 'Lütfen mezuniyet yılınızı giriniz!' }]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name="derece"
        label="Derece"
        rules={[{ required: true, message: 'Lütfen derece seçiniz!' }]}
      >
        <Select>
          <Option value="lisans">Lisans</Option>
          <Option value="yuksekLisans">Yüksek Lisans</Option>
          <Option value="doktora">Doktora</Option>
        </Select>
      </Form.Item>
    </>
  );
};
