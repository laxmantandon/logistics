<template>
    <div class="mt-5 pl-10 pr-1">
        <v-row v-if="items.length > 0">
            <v-col>
                <v-data-table
                    density="compact"
                    :itemsPerPage="10"
                    :headers=headers 
                    :items="items"
                    :totalItems="items.length">
                
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon class="mr-5" icon="mdi-pencil" small @click="edit_enquiry(item)"></v-icon>
                        <v-icon icon="mdi-content-copy" small @click="duplicateItem(item)"></v-icon>
                    </template>                
                
                </v-data-table>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col>
                No Enquiries Found
            </v-col>
        </v-row>
    </div>

</template>

<script setup>
import { ref, computed, toRaw } from 'vue'
import { session } from '../data/session'
import { createResource } from 'frappe-ui'
import { useRouter, useRoute } from 'vue-router'

const headers = ref([])
const items = ref([])

const router = useRouter()
const route = useRoute()

const enquiry_list = createResource({
    url: 'logistics.logistcs.api.get_enquiry_list',
    auto: true,
    onSuccess(data) {
        headers.value = data.headers
        items.value = data.items
    },
})

function edit_enquiry(row) {
    router.push(`/enquiry/${row.name}`)
}

function duplicateItem(row) {
    router.push(`/enquiry/duplicate/${row.name}`)
}

</script>

<style>

</style>