<template>
    <div class="p-10">

        <div class="flex justify-end p-5">
            <router-link to="/enquiry" tag="button">
                <Button class="mr-2" >New Enquiry</Button>
            </router-link>
            <Button @click="session.logout.submit()">Logout</Button>
        </div>
    
    
        <div class="flex justify-start pl-10">
            <h4>Recent Enquiries</h4>
        </div>
        <div class="pl-10 pr-10">
            <EasyDataTable :headers="headers" :items="items" alternating @click-row="edit_enquiry">
                <template #loading>
                    <img src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif"
                        style="width: 100px; height: 80px;" />
                </template>
                <template #item-operation="item">
                    <div class="operation-wrapper">
                        <ion-icon class="text-3xl" name="create-outline"></ion-icon>
                    </div>
                </template>
            </EasyDataTable>
    
        </div>
    </div>


</template>

<script setup>
import { ref, computed, toRaw } from 'vue'
import { Dialog } from 'frappe-ui'
import { session } from '../data/session'
import {
    createResource,
    Autocomplete,
    Select,
    TextInput,
    Button,
    Switch,
    ErrorMessage,
    createDocumentResource
} from 'frappe-ui'
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
    console.log(row)
}


const showDialog = ref(false)
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    /* border: 1px solid black !important */
}

input[type=number] {
    -moz-appearance: textfield;
    text-align: right;
}

input {
    border: 1px solid rgb(84, 84, 84) !important;
    border-radius: 0 !important;
    background-color: white !important;
    color: rgb(69, 69, 69) !important;
}

button {
    border: 1px solid rgb(84, 84, 84) !important;
    border-radius: 0 !important;
    background-color: white !important;
    color: rgb(69, 69, 69) !important;
}

select {
    border: 1px solid rgb(84, 84, 84) !important;
    border-radius: 0 !important;
    background-color: white !important;
    color: rgb(69, 69, 69) !important;
}

textarea {
    /* border: 0.5px solid rgb(145, 145, 145) !important; */
    border-radius: 0 !important;
    background-color: white !important;
    color: rgb(69, 69, 69) !important;
}
</style>