import api from "./api.js";

const baseURL = "/api/product-customization";
const storageURL = import.meta.env.VITE_API_BASE_URL_STORAGE;

function normalizeProduct(product: any) {
  return {
    ...product,
    image_url: product.image_url ? storageURL + product.image_url : null,
  };
}

// Converts backend response to grouped array structure

function normalizeGrouped(responseData: any) {
  return {
    menu: Array.isArray(responseData.menu) ? responseData.menu.map(normalizeProduct) : [],
    add_on: Array.isArray(responseData.add_on) ? responseData.add_on.map(normalizeProduct) : [],
    modify: Array.isArray(responseData.modify) ? responseData.modify.map(normalizeProduct) : [],
  };
}


export default {
  async getAll() {
  const response = await api.get(baseURL);

  // Access the "data" key from your JSON
  const rows = Array.isArray(response.data.data) ? response.data.data : [];

  // Normalize product URLs
  return rows.map(row => ({
    ...row,
    product: row.product
      ? {
          ...row.product,
          image_url: row.product.image_url
            ? storageURL + row.product.image_url
            : null,
        }
      : null,
    customization: row.customization || { add_on: [], modify: [] },
  }));
},


  async getById(id: number) {
      try {
        const response = await api.get(`${baseURL}/${id}`)
        const data = response.data

        if (!data) return null

        // Normalize main product
        const mainProduct = data.product ? normalizeProduct(data.product) : null

        // Normalize add-on and modify lists
        const addOnList = Array.isArray(data.customization?.add_on)
          ? data.customization.add_on.map(normalizeProduct)
          : []

        const modifyList = Array.isArray(data.customization?.modify)
          ? data.customization.modify.map(normalizeProduct)
          : []

        return {
          success: true,
          main_product: mainProduct?.id || null,
          product: mainProduct,
          data: {
            add_on: addOnList,
            modify: modifyList
          },
          status: data.status ?? '1'
        }
      } catch (err) {
        console.error('Failed to fetch customization:', err)
        return { success: false }
      }
    },

  async create(payload: any) {
    const response = await api.post(baseURL, payload);
    return normalizeGrouped(response.data);
  },

  async update(id: number, payload: any) {
    const response = await api.put(`${baseURL}/${id}`, payload);
    return normalizeGrouped(response.data);
  },

    async delete(productId: number) {
  // DELETE using URL parameter instead of sending in request body
  return api.delete(`${baseURL}/${productId}`);
},


  
  async optionsByProduct(productId: number) {
  const response = await api.get(`${baseURL}/${productId}/options`);
  
  // Pass `data` key from backend
  return normalizeGrouped(response.data.data); 
}

};
