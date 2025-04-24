import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber } from 'antd';
const { Option } = Select;

export const AcademicInfostep = ({form}) => {
  return (
    <>
      <Form.Item
        name="university"
        label="Üniversite"
        rules={[{ required: true, message: 'Lütfen üniversite adınızı giriniz!' }]}
      >
        <Input /> 
      </Form.Item>

      <Form.Item
        name="faculty"
        label="Fakülte"
        rules={[{ required: true, message: 'Lütfen fakülte adınızı giriniz!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="department"
        label="Bölüm"
        rules={[{ required: true, message: 'Lütfen bölüm adınızı giriniz!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="graduationYear"
        label="Mezuniyet Yılı"
        rules={[{ required: true, message: 'Lütfen mezuniyet yılınızı giriniz!' }]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name="degree"
        label="Derece"
        rules={[{ required: true, message: 'Lütfen derece seçiniz!' }]}
      >
        <Select>
          <Option value="bachelor">Lisans</Option>
          <Option value="master">Yüksek Lisans</Option>
          <Option value="doctorate">Doktora</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="startDate"
        label="Başlangıç Tarihi"
        rules={[{ required: true, message: 'Lütfen başlangıç tarihinizi seçiniz!' }]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        name="endDate"
        label="Bitiş Tarihi"
        rules={[{ required: true, message: 'Lütfen bitiş tarihinizi seçiniz!' }]}
      >
        <DatePicker />
      </Form.Item>
    </>
  );
};
