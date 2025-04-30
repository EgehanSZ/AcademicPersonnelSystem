import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Upload, Button, Radio, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import './Jurypanel.css';


const adaylar = [
    {
        id: "1",
        adSoyad: "Ali Veli",
        email: "ali@example.com",
        ilan: "Bilgisayar Müh.",
        belgeler: "/uploads/ali.pdf",
    },
    {
        id: "2",
        adSoyad: "Ayşe Yılmaz",
        email: "ayse@example.com",
        ilan: "Tarih Doçentliği",
        belgeler: "/uploads/ayse.pdf",
    },
    {
        id: "3",
        adSoyad: "Mehmet Can",
        email: "mehmet@example.com",
        ilan: "Hukuk Profesörü",
        belgeler: "/uploads/mehmet.pdf",
    },
];

const JuryDetail = () => {
    const { id } = useParams();
    const aday = adaylar.find((a) => a.id === id);
    const [form] = Form.useForm();
    const [rapor, setRapor] = useState(null);

    const handleSubmit = (values) => {
        console.log("Değerlendirme:", values);
        console.log("Yüklenen Rapor:", rapor);
        message.success("Değerlendirmeniz kaydedildi.");
        form.resetFields();
        setRapor(null);
    };

    if (!aday) return <p>Aday bulunamadı.</p>;

    return (


        <div className="jury-detail-page">
            <div>
                
            </div>
            <div className="jury-card">
                <Card  title={`Aday: ${aday.adSoyad}`} >
                    <div className="juri-info">
                        <p><strong>E-posta:</strong> {aday.email}</p>
                        <p><strong>İlan:</strong> {aday.ilan}</p>
                        <p>
                            <strong>Belgeler:</strong>{" "}
                            <a href={aday.belgeler} target="_blank" rel="noreferrer">
                                PDF Dosyasını Görüntüle
                            </a>
                        </p>
                    </div>
                </Card>
            </div>

            
            <div className="jury-card">
                <Card className="jury-card-title" title="Jüri Değerlendirme Formu" >
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Form.Item
                        name="degerlendirme"
                        label="Değerlendirme Metni"
                        rules={[{ required: true, message: "Bu alan zorunludur." }]}
                    >
                        <Input.TextArea rows={5} placeholder="Görüşlerinizi yazınız..." />
                    </Form.Item>

                    <Form.Item
                        name="karar"
                        label="Nihai Karar"
                        rules={[{ required: true, message: "Bir karar seçmelisiniz." }]}
                    >
                        <Radio.Group>
                            <Radio value="olumlu">Olumlu</Radio>
                            <Radio value="olumsuz">Olumsuz</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="rapor"
                        label="PDF Formatında Kişisel Rapor"
                        rules={[{ required: true, message: "PDF rapor yüklenmelidir." }]}
                    >
                        <Upload
                            beforeUpload={(file) => {
                                setRapor(file);
                                return false;
                            }}
                            accept=".pdf"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>PDF Yükle</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Gönder
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            </div>
            
        </div>
    );
};

export default JuryDetail;
