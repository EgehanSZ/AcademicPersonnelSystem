import React, { useState, useEffect, useParams } from "react";
import { ProList } from "@ant-design/pro-components";
import { Button, Space, Tag, Form, Input, Select, message } from "antd";
import { getListings, updateListing, deleteListing } from "../../services/listingApi";
import '../../assets/styles/theme.css';
import '../Listings/listings.css';
import '../../app.css';


const { Option } = Select;

export const EditListing = () => {
  const [kategoriFiltre, setKategoriFiltre] = useState("all");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [form] = Form.useForm();
  const token = localStorage.getItem('token');



  useEffect(() => {
    async function loadListings() {
      if (loading) return;
      setLoading(true);
      const data = await getListings();
      setListings(data);
      setLoading(false);
    }
    loadListings();
  }, []);

  const handleEdit = (item) => {
    setSelectedListing(item);
    form.setFieldsValue({
      baslik: item.baslik,
      aciklama: item.aciklama,
      fakulte: item.fakulte,
      bolum: item.bolum,
      kategori: item.kategori,
      bitisTarihi: item.bitisTarihi?.slice(0, 10),
    });
  };

  const handleFormFinish = async (values) => {
    try {
      await updateListing(selectedListing._id, values);
      message.success("İlan güncellendi.");
      setSelectedListing(null);
      const updatedListings = await getListings();
      setListings(updatedListings);
    } catch (err) {
      message.error("Güncelleme başarısız.");
    }
  };

  const filtrelenmisIlanlar =
    kategoriFiltre === "all"
      ? listings
      : listings.filter((ilan) => ilan.kategori === kategoriFiltre);

  return (
    <div style={{ padding: "16px" }}>
      {selectedListing ? (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2>İlanı Düzenle</h2>
          <Form form={form} layout="vertical" onFinish={handleFormFinish}>
            <Form.Item label="Başlık" name="baslik" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Açıklama" name="aciklama" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item label="Fakülte" name="fakulte" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Bölüm" name="bolum" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Kategori" name="kategori" rules={[{ required: true }]}>
              <Select>
                <Option value="Dr. Öğr. Üyesi">Dr. Öğr. Üyesi</Option>
                <Option value="Doçent">Doçent</Option>
                <Option value="Profesör">Profesör</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Son Başvuru Tarihi" name="bitisTarihi" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Güncelle
                </Button>
                <Button onClick={() => setSelectedListing(null)}>Vazgeç</Button>
                <Button
                  danger
                  onClick={async () => {
                    try {
                      const response = await deleteListing(selectedListing._id, token);

                      if (response.message === 'İlan başarıyla silindi') {
                        message.success(response.message);
                        setSelectedListing(null);
                        const updatedListings = await getListings();
                        setListings(updatedListings);
                      } else {
                        message.error(response.message || "Silme başarısız.");
                      }

                    } catch (err) {
                      message.error("Silme işlemi başarısız: " + err.message);
                    }
                  }}
                >
                  Sil
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <ProList
          rowKey="_id"
          headerTitle="Akademik Personel İlanları"
          toolBarRender={() => [
            <Button key="all" onClick={() => setKategoriFiltre("all")}>Tüm İlanlar</Button>,
            <Button key="doktor" onClick={() => setKategoriFiltre("Dr. Öğr. Üyesi")}>Dr. Öğr. Üyesi</Button>,
            <Button key="docent" onClick={() => setKategoriFiltre("Doçent")}>Doçent</Button>,
            <Button key="profesor" onClick={() => setKategoriFiltre("Profesör")}>Profesör</Button>,
          ]}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} arası gösteriliyor. Toplam ${total} ilan`
          }}
          metas={{
            title: { dataIndex: "baslik" },
            description: { dataIndex: "aciklama" },
            subTitle: {
              render: (_, row) => (
                <Space wrap>
                  <Tag color="blue">{`${row.fakulte} - ${row.bolum}`}</Tag>
                  <Tag color="green">{row.kategori}</Tag>
                </Space>
              ),
            },
            actions: {
              render: (_, row) => [
                <Button
                  type="link"
                  key="düzenle"
                  onClick={() => handleEdit(row)}
                >
                  Düzenle
                </Button>
              ],
            },
            extra: {
              render: (_, row) => (
                <div style={{ fontWeight: "bold" }}>
                  Son Başvuru:{" "}
                  {new Date(row.bitisTarihi).toLocaleDateString("tr-TR")}
                </div>
              ),
            },
          }}
          dataSource={filtrelenmisIlanlar}
          loading={loading}
          style={{ maxWidth: "100%" }}
        />
      )}
    </div>
  );
};
