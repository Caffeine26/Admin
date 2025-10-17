<template>
    <v-container>
        <h2>Create New Banner</h2>
        <v-form @submit.prevent="submitForm">
            <v-row>
                <v-col cols="12" md="6">
                    <v-file-input label="Banner Image" v-model="form.image" accept="image/*" required />
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

            <v-btn color="primary" @click="submitForm">Create</v-btn>
            <v-btn text @click="$router.push('/Banners')">Cancel</v-btn>
        </v-form>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useBannerStore } from '@/stores/bannerStore'


export default defineComponent({
    setup() {
        const bannerStore = useBannerStore()
        const form = ref({
            image: null as File | null,
            type: 'display',
            link_url: '',
            status: 1
        })

        const submitForm = async () => {
            if (!form.value.image) return alert('Please select an image.')

            const formData = new FormData()
            formData.append('image', form.value.image as File)
            formData.append('type', form.value.type)
            formData.append('link_url', form.value.link_url || '')
            formData.append('status', String(form.value.status))

            await bannerStore.createBanner(formData)
            alert('Banner created successfully!')
            window.location.href = '/Banners'
        }

        return { form, submitForm }
    }
})
</script>
