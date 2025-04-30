import axios from "axios";
const URL = 'http://localhost:3000'

export async function createUser(userData) {
    try {
        const response = await axios.post(`${URL}/user-add`, userData)
        return response
    } catch (error) {
        if (error.response) {
            return error;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası')
        }

    }
}
export async function uploadProfilePhoto(formData) {
    try {
        //TOKEN EKLENECEK!!!
        const response = await axios.post(`${URL}/user-upload/photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return response
    } catch (error) {
        if (error.response) {
            return error;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası')
        }

    }
}
export async function deleteUser(kullaniciId, token) {
    try {
        const response = await axios.delete(`${URL}/user-delete/${kullaniciId}`, { headers: { Authorization: `Bearer ${token}` } })
        return response
    } catch (error) {
        if (error.response) {

        } else {
            throw new Error('Sunucu veya Bağlantı Hatası')
        }

    }
}
export async function getAllUsers() {
    try {
        const response = await axios.get(`${URL}/user-getAll`)
        return response.data
    } catch (error) {
        if (error.response) {
            return error;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası')
        }

    }
}
export async function loginUser(userData) {
    try {
        const response = await axios.post(`${URL}/login`, userData);
        return response;
    } catch (error) {
        if (error.response) {
            return error;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası');
        }
    }
}

export async function changePassword(data, token) {
    try {
        const response = await axios.post(
            `${URL}/change-password`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response;
    } catch (error) {
        if (error.response) {
            return error;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası');
        }
    }
}

export async function getCurrentUser(token) {
    try {
        const response = await axios.get(`${URL}/user-me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error('Kullanıcı bilgisi alınamadı');
    }
}

export async function updateUser(data, token) {
    try {
        const response = await axios.put(`${URL}/user-update`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error('Güncelleme başarısız');
    }
}
export async function updateProfilePhoto(formData, token) {
    try {
        const response = await axios.post(
            `${URL}/user-update/photo`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error('Profil fotoğrafı yüklenemedi');
    }
}
export async function getJuriUsers(token) {
    try {
        const response = await axios.get(`${URL}/user-getJuri`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response;
    } catch (error) {
        console.error('Frontend hata:', error.response?.data || error.message);
        throw new Error('Jüri kullanıcıları alınamadı');
    }
}