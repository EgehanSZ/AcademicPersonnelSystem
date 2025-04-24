import React, { useState } from 'react';
import { Form, Button, Steps, message } from 'antd';
import { createUser } from '../../services/api';
import { PersonalInfoStep } from '../../components/SignUp/PersonalInfoStep';
import { AcademicInfostep } from '../../components/SignUp/AcademicInfoStep';
import { AddPhotoStep } from '../../components/SignUp/AddPhotoStep';
import dayjs from 'dayjs';
import FormItem from 'antd/es/form/FormItem';



export const ApplicantSignUp = () => {
  const { Step } = Steps;
  const [form] = Form.useForm();  // Form kontrolünü burada alıyoruz
  const [current, setCurrent] = useState(0);
  const steps = [
    {
      title: 'Kişisel Bilgiler',
      content: ({ form }) => <PersonalInfoStep form={form} />,
    },
    {
      title: 'Akademik Bilgiler',
      content: ({ form }) => <AcademicInfostep form={form} />,
    },
    {
      title: 'Fotoğraf Yükleme',
      content: ({ form }) => <AddPhotoStep form={form} />,
    },
  ];
  const next = async () => {
    try {
      // Geçerli adımın formunu doğrulama işlemi
      await form.validateFields(); // Bu satırın başarılı olup olmadığını kontrol et
      setCurrent(current + 1); // Form başarılıysa bir sonraki adıma geçiş yapıyoruz
    } catch (error) {

      message.error('Lütfen tüm alanları doğru şekilde doldurduğunuzdan emin olun.');
    }
  };

  const prev = () => setCurrent((prev) => prev - 1);

  const onFinish = async values => {
    console.log('Form Values:', values.email);
    const applicantData = {
      ad: values.ad,
      soyad: values.soyad,
      email: values.email,
      sifre: values.sifre,
      kullaniciId: values.kullaniciId,
      dogumTarihi: dayjs(values.dogumTarihi).format('YYYY-MM-DD'),
      telefon: values.telefon,
      adres: values.adres,


    }
    const response = await createUser(applicantData);
    if (response.status === 201) {
      message.success('Kullanıcı Oluşturuldu')
    } else if (response.status === 400) {
      message.error('Bu Kullanıcı Zaten Kayıtlı', 5)
      form.resetFields();

    } else if (response.status === 500) {
      message.success('Suncu hatası')
      form.resetFields();

    }
    else {
      message.error('Sunucu Hatası')
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <Steps current={current} style={{ marginBottom: 30 }}>
        {steps.map((item, index) => (
          <Step key={index} title={item.title} />
        ))}
      </Steps>
      <Form form={form}
        onFinish={onFinish}>
        <div>{steps[current].content({ form })}</div>
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
          {current > 0 && (
            <Form.Item>
              <Button onClick={prev}>Geri</Button>
            </Form.Item>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={next}>İleri</Button>
          )}
          {current === steps.length - 1 && (
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Tamamla
              </Button>
            </Form.Item>
          )}
        </div>
      </Form>
    </div>
  );
};
