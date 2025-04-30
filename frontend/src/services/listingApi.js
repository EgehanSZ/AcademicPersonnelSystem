import axios from "axios";
const URL = 'http://localhost:3000'

export async function getListings() {

    try {
        const response = await axios.get(`${URL}/listings`)

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('No data found')
        }

    } catch (error) {

    }
};

export async function createListing(listingData, token) {
    try {
        const response = await axios.post(`${URL}/listings/create`, listingData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 201) {
            return response;
        }
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası');
        }
    }
}

export async function getListing(listingId) {
    try {
        const response = await axios.get(`${URL}/listings/${listingId}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası');
        }
    }
}
export async function listingApply(listingId, token, file) {
    try {
        const formData = new FormData();
        formData.append('dosya', file);
        const response = await axios.post(`${URL}/listings/${listingId}/apply`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası');
        }

    }
}
export async function getApplications(token) {
    try {
        const response = await axios.get(`${URL}/applications`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası');
        }
    }
}

export async function getApplicationList(id, token) {
    try {
        const response = await axios.get(`${URL}/applications/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Bir hata oluştu.');
        } else {
            throw new Error('Sunucu veya bağlantı hatası.');
        }
    }
}


export async function getApplicationsByJuri(token) {
    try {
        const response = await axios.get(`${URL}/applications/juri`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası');
        }
    }
}

export async function addJuriInListing(listingId, kullaniciId, token) {
    try {
        const response = await axios.put(
            `${URL}/listings/${listingId}/juri`,
            { kullaniciId },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası');
        }
    }
}
export async function updateListing(listingId, listingData, token) {
    try {
        const response = await axios.put(`${URL}/listings/${listingId}`, listingData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası');
        }
    }
}

export async function deleteListing(listingId, token) {
    try {
        const response = await axios.delete(`${URL}/listings/delete/${listingId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası');
        }
    }
}
