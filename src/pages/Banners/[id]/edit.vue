<template>
    <v-container>
        <h2>Edit Banner</h2>
        <v-form @submit.prevent="submitForm">
            <v-row>
                <v-col cols="12" md="6">
                    <v-file-input label="Banner Image" v-model="form.image" accept="image/*" />
                    <v-img v-if="form.image_url" :src="form.image_url" max-width="150" height="80" class="mt-2" />
                </v-col>

                <v-col cols="12" md="6">
                    <v-select label="Type" v-model="form.type" :items="['display', 'redirect']" required />
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field label="Link URL" v-model="form.link_url" :disabled="form.type === 'display'" />
                </v-col>

                <v-col cols="12" md="6">
                    <v-switch label="Status" v-model="form.status" :true-value="1" :false-value="0" />
                </v-col>
            </v-row>

            <v-btn color="primary" type="submit">Update</v-btn>
            <v-btn text @click="$router.push('/banners')">Cancel</v-btn>
        </v-form>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBannerStore } from '@/stores/bannerStore'
import bannerService from '@/services/bannerService'

export default defineComponent({
    setup() {
        const route = useRoute()
        const bannerStore = useBannerStore()
        const form = ref({
            id: 0,
            image: null as File | null,
            image_url: '',
            type: 'display',
            link_url: '',
            status: 1
        })

        onMounted(async () => {
            const id = Number(route.params.id)
            const banner = await bannerService.getById(id)
            form.value = { ...banner, image: null }
        })

        const submitForm = async () => {
            const formData = new FormData()
            if (form.value.image) formData.append('image', form.value.image)
            formData.append('type', form.value.type)
            formData.append('link_url', form.value.link_url || '')
            formData.append('status', String(form.value.status))

            await bannerStore.updateBanner(form.value.id, formData)
            alert('Banner updated successfully!')
            window.location.href = '/banners'
        }

        return { form, submitForm }
    }
})
</script>
