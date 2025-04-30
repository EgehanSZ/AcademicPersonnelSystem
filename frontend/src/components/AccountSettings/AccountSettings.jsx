import { Card, Form, Input, Button, Select, Upload, Avatar, message, List, Switch, Space, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import './AccountSettings.css';
import { changePassword, getCurrentUser, updateUser, updateProfilePhoto } from '../../services/userApi';


const { Option } = Select;

export const AccountSettings = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [activeMenu, setActiveMenu] = useState('temel');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [initialUserData, setInitialUserData] = useState({});



  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const user = await getCurrentUser(token);
        setInitialUserData(user);
        form.setFieldsValue({
          ad: user.ad,
          soyad: user.soyad,
          kullaniciId: user.kullaniciId,
          email: user.email,
          dogumTarihi: user.dogumTarihi,
          telefon: user.telefon,
          adres: user.adres,
          universite: user.universite,
          fakulte: user.fakulte,
          bolum: user.bolum,
          mezuniyetYili: user.mezuniyetYili,
          derece: user.derece,
        });
        setAvatarUrl(user.resimUrl);
        setUserId(user.kullaniciId); // kullaniciId'yi bir state'e alıyoruz
      } catch (e) {
        message.error('Kullanıcı bilgisi alınamadı');
      }
    };
    fetchUser();
  }, [form]);


  const handleAvatarChange = (info) => {
    const file = info.file.originFileObj;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };


  const handleFormSubmit = async (values) => {
    const token = localStorage.getItem('token');
    try {
      await updateUser(values, token);
      if (avatarFile) {
        const formData = new FormData();
        formData.append('resimUrl', avatarFile);
        formData.append('kullaniciId', userId);

        const result = await updateProfilePhoto(formData, token);
        setAvatarUrl(result.resimUrl);
        setAvatarFile(null);
        setPreviewAvatar(null);
      }
      message.success('Bilgiler başarıyla güncellendi!');
      setIsEditing(false);
    } catch (e) {
      message.error('Bilgiler güncellenemedi!');
    }
  };


  const token = localStorage.getItem('token'); // veya context'ten alın

  const handlePasswordChange = async (values) => {
    const token = localStorage.getItem('token');
    const response = await changePassword(values, token);

    if (response.status === 200) {
      message.success('Şifre başarıyla güncellendi!');
      passwordForm.resetFields();
    } else {
      message.error(response?.response?.data?.message || 'Şifre güncellenemedi!');
    }
  };

  const handleCancelEdit = () => {
    form.setFieldsValue(initialUserData);
    setIsEditing(false);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'temel':
        return (
          <>
            <div className='account-container'>
              <Card
                title="Temel Bilgiler"
                className='account-content-card'
                extra={
                  !isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>Düzenle</Button>
                  ) : (
                    <Space>
                      <Button type="primary" htmlType="submit" form="basicInfoForm">
                        Kaydet
                      </Button>
                      <Button danger onClick={handleCancelEdit}>
                        İptal
                      </Button>
                    </Space>
                  )
                }
              >
                <Form
                  layout="vertical"
                  form={form}
                  id="basicInfoForm"
                  onFinish={handleFormSubmit}
                  initialValues={{
                    ad: '',
                    soyad: '',
                    dogumTarihi: null,
                    telefon: '',
                    adres: '',
                    universite: '',
                    fakulte: '',
                    bolum: '',
                    mezuniyetYili: '',
                    derece: '',


                  }}
                ><Card title="Profil Fotoğrafı" className="mt-6 " bordered={false}>
                    <div className="flex items-center gap-6">
                      <Spin spinning={loadingAvatar}>
                        <Avatar size={80} src={previewAvatar || avatarUrl} />
                      </Spin>
                      <Upload
                        showUploadList={false}
                        customRequest={({ file, onSuccess }) => {
                          // Yükleme simülasyonu
                          setTimeout(() => {
                            onSuccess('ok');
                          }, 1000);
                        }}
                        onChange={handleAvatarChange}
                        disabled={!isEditing}
                      >
                        <Button icon={<UploadOutlined />} disabled={!isEditing}>Avatar Değiştir</Button>
                      </Upload>
                    </div>
                  </Card>
                  <Form.Item label="E-posta" name="email" rules={[{ required: true, message: 'Lütfen e-posta adresinizi girin.' }]}>
                    <Input placeholder="ornek@mail.com" disabled={!isEditing} />
                  </Form.Item>

                  <Form.Item label="Ad" name="ad" rules={[{ required: true, message: 'Lütfen kullanıcı adınızı girin.' }]}>
                    <Input placeholder="Ad" disabled={!isEditing} />
                  </Form.Item>

                  <Form.Item label="Soyad" name="soyad" rules={[{ required: true, message: 'Lütfen kullanıcı adınızı girin.' }]}>
                    <Input placeholder="Soyad" disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item label="TC No" name="kullaniciId">
                    <Input disabled />
                  </Form.Item>


                  <Form.Item label="Adres" name="adres">
                    <Input placeholder="Sokak, No, Mahalle vb." disabled={!isEditing} />
                  </Form.Item>

                  <Form.Item label="Telefon" style={{ marginBottom: 0 }}>

                    <Form.Item name="telefon" style={{ display: 'inline-block', width: '70%', marginLeft: '8px' }}>
                      <Input placeholder="123 456 78 90" disabled={!isEditing} />
                    </Form.Item>
                  </Form.Item>

                  <Form.Item label="Üniversite" name="universite">
                    <Input placeholder="Üniversite Adı" disabled={!isEditing} />
                  </Form.Item>

                  <Form.Item label="Fakülte" name="fakulte">
                    <Input placeholder="Fakülte Adı" disabled={!isEditing} />
                  </Form.Item>

                  <Form.Item label="Bölüm" name="bolum" >
                    <Input placeholder="Bölüm Adı" disabled={!isEditing} />
                  </Form.Item>

                  <Form.Item label="Mezuniyet Yılı" name="mezuniyetYili">
                    <Input placeholder="2025" type="number" disabled={!isEditing} />
                  </Form.Item>

                  <Form.Item label="Derece" name="derece">
                    <Select placeholder="Derece seçin" disabled={!isEditing}>
                      <Option value="Lisans">Dr.Öğretim Üyesi</Option>
                      <Option value="Yüksek Lisans">Doçent</Option>
                      <Option value="Doktora">Doktor</Option>
                    </Select>
                  </Form.Item>

                </Form>
              </Card>
            </div>
          </>
        );

      case 'guvenlik':
        return (
          <Card title="Güvenlik Ayarları" bordered={false}>
            <Form layout="vertical" form={passwordForm} onFinish={handlePasswordChange}>
              <Form.Item label="Mevcut Şifre" name="currentPassword" rules={[{ required: true, message: 'Lütfen mevcut şifrenizi girin.' }]}>
                <Input.Password placeholder="Mevcut Şifre" />
              </Form.Item>

              <Form.Item label="Yeni Şifre" name="newPassword" rules={[{ required: true, message: 'Lütfen yeni şifrenizi girin.' }]}>
                <Input.Password placeholder="Yeni Şifre" />
              </Form.Item>

              <Form.Item
                label="Yeni Şifre (Tekrar)"
                name="confirmNewPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Lütfen yeni şifrenizi tekrar girin.' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Şifreler eşleşmiyor!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Yeni Şifreyi Tekrar Girin" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Şifreyi Güncelle
                </Button>
              </Form.Item>
            </Form>
          </Card>
        );



      case 'bildirim':
        return (
          <Card title="Bildirim Ayarları" >
            <Form layout="vertical">
              <Form.Item label="Uygulama İçi Bildirimler">
                <Switch defaultChecked />
              </Form.Item>
            </Form>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="account-container">
      {/* Sol Menü */}
      <div className="account-menu">
        <Card>
          <div className="flex flex-col gap-4">
            <Button type={activeMenu === 'temel' ? 'primary' : 'text'} block onClick={() => setActiveMenu('temel')}>Temel Ayarlar</Button>
            <Button type={activeMenu === 'guvenlik' ? 'primary' : 'text'} block onClick={() => setActiveMenu('guvenlik')}>Güvenlik Ayarları</Button>

            <Button type={activeMenu === 'bildirim' ? 'primary' : 'text'} block onClick={() => setActiveMenu('bildirim')}>Mesaj Bildirimi</Button>
          </div>
        </Card>
      </div>

      {/* Sağ İçerik */}
      <div className="w-full lg:w-3/4">
        {renderContent()}
      </div>
    </div>
  );
};
