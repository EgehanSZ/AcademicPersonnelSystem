// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { Layout, Menu, Tag, Button, message, Space, Form, Input, Select, DatePicker, } from "antd";
import { ProList } from "@ant-design/pro-components";
import { UnorderedListOutlined, AppstoreAddOutlined, SolutionOutlined, } from "@ant-design/icons";
import dayjs from "dayjs";
import { createListing, getListings, getApplications, addJuriInListing } from "../../services/listingApi";
import { getJuriUsers } from '../../services/userApi'
import { useNavigate } from "react-router-dom";
import { EditListing } from "../admin/EditListing";

const { Header, Sider, Content } = Layout;
const { Option } = Select;

export const AdminPanel = () => {
    const [kategoriFiltre, setKategoriFiltre] = useState("all");
    const [selectedMenu, setSelectedMenu] = useState("listings");
    const [listings, setListings] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loadingListings, setLoadingListings] = useState(false);
    const [loadingApplications, setLoadingApplications] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [juryList, setJuryList] = useState([]);
    const [selectedJuries, setSelectedJuries] = useState([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // İlanları yükle
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || selectedMenu !== "listings") return;
        setLoadingListings(true);
        getListings()
            .then((data) => setListings(data))
            .catch((e) => {
                console.error(e);
                message.error("İlanlar yüklenirken hata oluştu.");
            })
            .finally(() => setLoadingListings(false));
    }, [selectedMenu]);

    // Başvuruları yükle
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || selectedMenu !== "applications") return;
        setLoadingApplications(true);
        getApplications(token)
            .then((res) => {
                if (res.status === 200) setApplications(res.data);
                else if (res.status === 403) message.error("Yetkiniz yok.");
                else if (res.status === 404) message.error("Başvuru bulunamadı.");
            })
            .catch((e) => {
                console.error(e);
                message.error("Başvurular yüklenirken hata oluştu.");
            })
            .finally(() => setLoadingApplications(false));
    }, [selectedMenu]);

    useEffect(() => {
        const fetchJuries = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await getJuriUsers(token);
                if (res.status === 200) {
                    setJuryList(res.data);
                }
                else if (res.status === 403) {
                    message.error("Yetkiniz yok.");
                }
                else if (res.status === 404) {
                    message.error("Jüri bulunamadı.");
                } else if (res.status === 500) {
                    message.error("Sunucu hatası.");
                }
                else if (res.status === 400) {
                    message.error("Jüri bulunamadı.");
                }
                else {
                    message.error("Jüri listesi alınamadı.");
                }
            } catch (error) {
                console.error("Jüri verileri alınırken hata:", error);
                message.error("Jüri verileri yüklenirken hata oluştu.");
            }
        };

        if (selectedMenu === "applications") {
            fetchJuries();
        }
    }, [selectedMenu]);

    // Filtreler
    const filtrelenmisIlanlar =
        kategoriFiltre === "all"
            ? listings
            : listings.filter((i) => i.kategori === kategoriFiltre);
    const basvurulanIlanlar =
        kategoriFiltre === "all"
            ? applications
            : applications.filter((i) => i.kategori === kategoriFiltre);

    // İlan Ekle handler
    const onFinish = async (values) => {
        const token = localStorage.getItem("token");
        const listingData = {
            ...values,
            bitisTarihi: dayjs(values.bitisTarihi).format("YYYY-MM-DD"),
        };
        try {
            const res = await createListing(listingData, token);
            if (res.status === 201) {
                message.success("İlan başarıyla oluşturuldu.");
                form.resetFields();
                // listeyi güncelle
                const updated = await getListings();
                setListings(updated);
                setSelectedMenu("listings");
            } else if (res.status === 403) {
                message.error("Yetkiniz yok.");
            } else {
                message.error("İlan oluşturulurken hata oluştu.");
            }
        } catch {
            message.error("Sunucuya bağlanırken hata oluştu.");
        }
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider width={220} style={{ background: "#001529" }}>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedMenu]}
                    onClick={(e) => {
                        setSelectedMenu(e.key);
                        setKategoriFiltre("all");
                    }}
                    items={[
                        { key: "listings", icon: <UnorderedListOutlined />, label: "İlanlar" },
                        { key: "listingAdd", icon: <AppstoreAddOutlined />, label: "İlan Ekle" },
                        {
                            key: "editlisting",
                            icon: <AppstoreAddOutlined />,
                            label: "İlan Düzenle",
                        },
                        { key: "applications", icon: <SolutionOutlined />, label: "Başvurular" },
                    ]}
                />
            </Sider>

            <Layout>
                <Header style={{ background: "#fff", padding: "0 24px" }}>
                    <h2>Admin Yönetim Paneli</h2>
                </Header>
                <Content style={{ margin: 24, background: "#fff", padding: 24 }}>
                    {/* İLANLAR */}
                    {selectedMenu === "listings" && (
                        <div style={{ padding: 16 }}>
                            <ProList
                                rowKey="_id"
                                headerTitle="Akademik Personel İlanları"
                                toolBarRender={() => [
                                    <Button key="all" onClick={() => setKategoriFiltre("all")}>
                                        Tüm İlanlar
                                    </Button>,
                                    <Button key="doktor" onClick={() => setKategoriFiltre("Dr. Öğr. Üyesi")}>
                                        Dr. Öğr. Üyesi
                                    </Button>,
                                    <Button key="docent" onClick={() => setKategoriFiltre("Doçent")}>
                                        Doçent
                                    </Button>,
                                    <Button key="profesor" onClick={() => setKategoriFiltre("Profesör")}>
                                        Profesör
                                    </Button>,
                                ]}
                                pagination={{
                                    pageSize: 10,
                                    showTotal: (total, range) =>
                                        `${range[0]}-${range[1]} arası gösteriliyor. Toplam ${total} ilan`,
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
                                                key="basvurular"
                                                onClick={() => setSelectedMenu("applications")}
                                            >
                                                Başvurular
                                            </Button>,
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
                                loading={loadingListings}
                            />
                        </div>
                    )}

                    {/* İLAN EKLE FORMU – form hep mount halinde, sadece görünürlüğü değişiyor */}
                    <div style={{ display: selectedMenu === "listingAdd" ? "block" : "none" }}>
                        <h3>İlan Formu</h3>
                        <Form
                            layout="vertical"
                            form={form}
                            onFinish={onFinish}
                            style={{ maxWidth: 600 }}
                        >
                            <Form.Item name="baslik" label="Başlık" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="fakulte" label="Fakülte" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="bolum" label="Bölüm" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="kategori" label="Kategori" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="Dr. Öğr. Üyesi">Dr. Öğr. Üyesi</Option>
                                    <Option value="Doçent">Doçent</Option>
                                    <Option value="Profesör">Profesör</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="aciklama" label="Açıklama" rules={[{ required: true }]}>
                                <Input.TextArea rows={7} />
                            </Form.Item>
                            <Form.Item
                                name="bitisTarihi"
                                label="Son Başvuru Tarihi"
                                rules={[{ required: true }]}
                            >
                                <DatePicker />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Kaydet
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>

                    {/* BAŞVURULAR */}
                    {selectedMenu === "applications" && (
                        <div style={{ padding: 16 }}>
                            {selectedMenu === "applications" && (
                                <>
                                    <ProList
                                        rowKey="_id"
                                        headerTitle="Başvurular"
                                        toolBarRender={() => [
                                            <Button key="all" onClick={() => setKategoriFiltre("all")}>Tüm Başvurular</Button>,
                                            <Button key="doktor" onClick={() => setKategoriFiltre("Dr. Öğr. Üyesi")}>Dr. Öğr. Üyesi</Button>,
                                            <Button key="docent" onClick={() => setKategoriFiltre("Doçent")}>Doçent</Button>,
                                            <Button key="profesor" onClick={() => setKategoriFiltre("Profesör")}>Profesör</Button>,
                                        ]}
                                        pagination={{
                                            pageSize: 10,
                                            showTotal: (total, range) => `${range[0]}-${range[1]} arası gösteriliyor. Toplam ${total} başvuru`,
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
                                                    <Button type="link" key="geri" onClick={() => setSelectedMenu("listings")}>Geri</Button>,
                                                    <Button type="link" key="jury" onClick={() => {
                                                        setSelectedApplication(row);
                                                        setSelectedJuries([]);
                                                    }}>Jüri Ata</Button>
                                                ],
                                            },
                                            extra: {
                                                render: (_, row) => (
                                                    <div style={{ fontWeight: "bold" }}>
                                                        Son Başvuru: {new Date(row.bitisTarihi).toLocaleDateString("tr-TR")}
                                                    </div>
                                                ),
                                            },
                                        }}
                                        dataSource={basvurulanIlanlar}
                                        loading={loadingApplications}
                                    />

                                    {selectedApplication && (
                                        <div style={{ marginTop: 24, background: "#fafafa", padding: 16, borderRadius: 8 }}>
                                            <h3>Jüri Ata - {selectedApplication.baslik}</h3>
                                            <Select
                                                mode="multiple"
                                                placeholder="Jüri seçin"
                                                value={selectedJuries}
                                                onChange={setSelectedJuries}
                                                style={{ width: "100%", marginBottom: 16 }}
                                            >
                                                {juryList.map(jury => (
                                                    <Select.Option key={jury.kullaniciId} value={jury.kullaniciId}>
                                                        {jury.ad} {jury.soyad}    TC No: {jury.kullaniciId}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                            <Space>
                                                <Button
                                                    type="primary"
                                                    onClick={async () => {
                                                        const token = localStorage.getItem("token");
                                                        try {
                                                            // Her seçili jüri ID'si için ayrı istek at
                                                            await Promise.all(
                                                                selectedJuries.map((jid) =>
                                                                    addJuriInListing(selectedApplication._id, jid, token)
                                                                )
                                                            );
                                                            message.success("Jüriler başarıyla atandı");
                                                            setSelectedApplication(null);
                                                            setSelectedJuries([]);
                                                        } catch (e) {
                                                            console.error(e);
                                                            message.error("Jüri ataması başarısız");
                                                        }
                                                    }}
                                                >
                                                    Kaydet
                                                </Button>
                                                <Button onClick={() => setSelectedApplication(null)}>İptal</Button>
                                            </Space>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* İLAN DÜZENLE */}
                    {selectedMenu === "editlisting" && (
                        <div>
                            <EditListing />
                        </div>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};
