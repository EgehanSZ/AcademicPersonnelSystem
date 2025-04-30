import React, { useState } from 'react';
import { Form, Button, Steps, message } from 'antd';
import { createUser, uploadProfilePhoto } from '../../services/userApi';
import { PersonalInfoStep } from '../../components/SignUp/PersonalInfoStep';
import { AcademicInfostep } from '../../components/SignUp/AcademicInfoStep';
import { AddPhotoStep } from '../../components/SignUp/AddPhotoStep';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';


export const ApplicantSignUp = () => {
  const { Step } = Steps;
  const [form] = Form.useForm(); // Form kontrolünü burada alıyoruz
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({}); // Form verilerini burada saklıyoruz

  const stepFieldNames = [
    ['ad', 'soyad', 'email', 'sifre', 'kullaniciId', 'dogumTarihi', 'telefon', 'adres'],
    ['universite', 'fakulte', 'bolum', 'mezuniyetYili', 'derece'],
    ['resimUrl'],
  ];

  const steps = [
    {
      title: 'Kişisel Bilgiler',
      content: <PersonalInfoStep />,
    },
    {
      title: 'Akademik Bilgiler',
      content: <AcademicInfostep />,
    },
    {
      title: 'Fotoğraf Yükleme',
      content: <AddPhotoStep />,
    },
  ];

  const next = async () => {
    try {
      await form.validateFields(stepFieldNames[current]); // Sadece geçerli adımın formunu doğrulama
      setCurrent(current + 1); // Bir sonraki adıma geçiş
    } catch (error) {
      message.error('Lütfen tüm alanları doğru şekilde doldurduğunuzdan emin olun.');
    }
  };

  const prev = () => setCurrent((prev) => prev - 1);

  const onFinish = async (values) => {

    console.log('Form Values:', values); // Verileri konsola yazdır
    const applicantData = {
      ad: values.ad,
      soyad: values.soyad,
      email: values.email,
      sifre: values.sifre,
      kullaniciId: values.kullaniciId,
      dogumTarihi: dayjs(values.dogumTarihi).format('YYYY-MM-DD'),
      telefon: values.telefon,
      adres: values.adres,
      universite: values.universite,
      fakulte: values.fakulte,
      bolum: values.bolum,
      mezuniyetYili: values.mezuniyetYili,
      derece: values.derece,
    };
    try {
      const response = await createUser(applicantData);
      if (response.status === 201) {
        const formData = new FormData();
        const file = values.resimUrl[0].originFileObj;
        console.log('File:', file);
        formData.append('resimUrl', file);
        formData.append('kullaniciId', values.kullaniciId);
        await uploadProfilePhoto(formData)
        message.success('Kullanıcı Oluşturuldu');
        setTimeout(() => {
          navigate('/login');
        }, 2000); 
        
      } else if (response.status === 400) {
        message.error('Bu Kullanıcı Zaten Kayıtlı');
        form.resetFields();
      }
      else if (response.status === 401) {
        message.error('TCKimlik No Doğrulanamadı');
        form.resetFields();
      } else {
        message.error('Sunucu Hatası');
      }
    } catch (error) {
      message.error('Sunucuya bağlanırken bir hata oluştu');
    }
    
  };
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <Steps current={current} style={{ marginBottom: 20 }}>
        {steps.map((item, index) => (
          <Step key={index} title={item.title} />
        ))}
      </Steps>

      <Form form={form} onFinish={onFinish } layout="vertical">
        {steps.map((step, index) => (
          <div key={index} style={{ display: current === index ? 'block' : 'none' }}>
            {step.content}
          </div>
        ))}

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
              <Button type="primary" htmlType="submit"
              
              
              >Tamamla</Button>
            </Form.Item>
          )}
        </div>
      </Form>
    </div>
  );
};


