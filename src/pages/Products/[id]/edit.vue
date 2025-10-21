<template>
    <v-container>
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-4">
            <h2>Edit Product</h2>
            <v-btn color="grey" @click="router.push('/Products')">Back</v-btn>
        </div>

        <v-form>
            <!-- Product Info -->
            <v-text-field v-model="product.name" label="Product Name" required />
            <v-text-field v-model="product.name_kh" label="Product Name Khmer" required />
            <v-textarea v-model="product.description" label="Description" />
            <v-text-field v-model.number="product.price" label="Price" type="number" min="0" required />
            <v-text-field v-model.number="product.final_price" label="Final Price" type="number" min="0" />
            <v-text-field v-model.number="product.rate" label="Rate" type="number" min="0" max="5" step="0.1" />

            <!-- Category Selector -->
            <div class="my-4">
                <div class="mb-2 font-weight-bold">Select Category:</div>
                <div class="d-flex flex-wrap">
                    <div v-for="cat in categories" :key="cat.id" class="d-flex flex-column align-center ma-2">
                        <v-btn fab small class="pa-0" :style="{
                            width: '80px',
                            height: '80px',
                            overflow: 'hidden',
                            border: product.category_id.includes(cat.id) ? '3px solid #4caf50' : '1px solid #ccc'
                        }" elevation="2" @click="selectCategory(cat.id)">
                            <v-img v-if="cat.image_url" :src="cat.image_url" height="75" width="75"
                                class="rounded-circle" cover />
                            <v-icon v-else>mdi-image-off</v-icon>
                        </v-btn>
                        <div class="mt-1 text-center" style="max-width: 80px; font-size: 12px; word-break: break-word;">
                            {{ cat.name_english }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Type Selector -->
            <v-select v-model="product.type" :items="['menu', 'add_on', 'modify']" label="Type" required />

            <!-- Product Image Upload -->
            <div class="my-4">
                <div v-if="preview" class="mb-2">
                    <v-img :src="preview" max-width="300" />
                </div>
                <v-file-input v-model="imageFile" label="Upload Product Image" accept="image/*" />
            </div>

            <!-- Save Button -->
            <v-btn color="primary" class="mt-4" @click="updateProduct">Update Product</v-btn>
        </v-form>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useProductStore } from "@/stores/productStore.js"
import { useCategoryStore } from "@/stores/categoryStore.js"
import type { Product } from "@/types/product.js"

const router = useRouter()
const route = useRoute()
const productStore = useProductStore()
const categoryStore = useCategoryStore()

const productId = Number(route.params.id)
const product = ref<Product>({
    id: 0,
    name: "",
    name_kh: "",
    description: "",
    price: 0,
    final_price: 0,
    rate: 0.0,
    category_id: [],
    type: "menu",
    parent_id: null,
    image_url: "",
})

const imageFile = ref<File | null>(null)
const categories = ref<any[]>([])
const preview = ref<string | null>(null)

// Fetch categories and product
onMounted(async () => {
    await categoryStore.fetchCategories();
    categories.value = categoryStore.categories

    const fetchedProduct = await productStore.getProductById(productId);
    if (fetchedProduct) {
      fetchedProduct.category_id = fetchedProduct.categories.map(rr => rr.id);
      product.value = fetchedProduct;
      preview.value = fetchedProduct.image_url || null
    }
})

// Select category
const selectCategory = (categoryId: number) => {
  const checkingCategory = product.value.category_id.filter(val => val == categoryId);
  if (checkingCategory.length > 0) {
    product.value.category_id = product.value.category_id.filter(val => val != categoryId);
  }
  else {
    product.value.category_id.push(categoryId);
  }
};

// Update product
const updateProduct = async () => {
    if (!product.value.name || !product.value.name_kh || !product.value.price || product.value.category_id.length === 0) {
        alert("Please fill in all required fields!")
        return
    }

    try {
        const formData = new FormData()
        formData.append("_method", "PUT") // important for Laravel
        formData.append("name", product.value.name);
        formData.append("name_kh", product.value.name_kh);
        formData.append("description", product.value.description || "")
        formData.append("price", product.value.price.toString())
        formData.append("final_price", (product.value.final_price ?? 0).toString())
        formData.append("rate", (product.value.rate ?? 0).toString())
        formData.append("type", product.value.type || "menu")

        if (imageFile.value) formData.append("image", imageFile.value);

        // Append category_ids as an array
        if (Array.isArray(product.value.category_id)) {
            product.value.category_id.forEach(id => {
                formData.append("category_id[]", id.toString());
            });
        } else {
            console.error("category_id is not an array:", product.value.category_id);
        }


        await productStore.updateProducts(productId, formData)
        alert("Product updated successfully!")
        router.push("/Products")
    } catch (err) {
        console.error("Product update failed", err)
        alert("Failed to update product!")
    }
}

</script>

<style scoped>
/* Selected category button highlight */
.v-btn.green {
    color: white !important;
}
</style>
