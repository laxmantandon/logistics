<template>
    <v-form v-model="valid">
        <v-container>
            <v-card v-if="shipment.name" class="mt-2 pl-5 pr-5 mb-2" :title="'ID : ' + shipment.name" variant="outlined">
            </v-card>
            <v-card class="mt-2 pl-5 pr-5 mb-2" title="Service Requirements" variant="outlined" v-if="masters.data.service_requests">
                <v-row>
                    <v-col>
                        <v-autocomplete
                            label="Service Request"
                            density="compact"
                            :items="masters.data.service_requests"
                            v-model="shipment.service_request"
                            item-title="label"
                            item-value="value"
                            variant="outlined"
                            :rules="nameRules"></v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-autocomplete label="Nature of Shipment" density="compact"
                            :items=masters.data.nature_of_shipments v-model="shipment.nature_of_shipment" item-title="label"
                            item-value="value" variant="outlined"
                            :rules="nameRules">
                        </v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-autocomplete label="Mode of Transport" density="compact"
                            :items=masters.data.mode_of_transports v-model="shipment.mode_of_transport" item-title="label"
                            item-value="value" variant="outlined"
                            :rules="nameRules">
                        </v-autocomplete>
                    </v-col>
                </v-row>
            </v-card>

            <v-card class="mt-2 pl-5 pr-5 mb-2" title="Shipping Info" variant="outlined">
                <v-row v-if="shipment.service_request !== '3'">
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Place of Receipt"
                                    v-model="shipment.place_of_receipt"
                                    :rules="nameRules" required></v-text-field>
                    </v-col>
                    <v-col>
                        <v-autocomplete 
                            label="Incoterms" 
                            density="compact" 
                            :items=masters.data.incoterms
                            v-model="shipment.incoterm" 
                            item-title="label" 
                            item-value="value" 
                            variant="outlined"
                            :rules="nameRules"></v-autocomplete>
                    </v-col>
                </v-row>
                <v-row v-if="shipment.mode_of_transport.includes('Sea') && (shipment.service_request == '1' || shipment.service_request == '2')" v-for="(item, index) in shipment.ports">
                    <v-col>
                        <v-autocomplete label="Port of Loading" density="compact"
                                        :items=masters.data.ports v-model="item.port_of_loading" item-title="label"
                                        item-value="value" variant="outlined"
                                        :rules="nameRules">
                                    </v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-autocomplete label="Port of Discharge" density="compact"
                                        :items=masters.data.ports v-model="item.port_of_discharge" item-title="label"
                                        item-value="value" variant="outlined"
                                        :rules="nameRules">
                                    </v-autocomplete>
                    </v-col>
                    <v-col cols="1">
                        
                        <v-btn variant="outlined" @click="append_ports_array()"><v-icon icon="mdi-plus-circle"></v-icon></v-btn>
                    </v-col>
                    <v-col cols="1">
                        <v-btn variant="outlined" @click="remove_ports_array(index)" v-if="index > 0"><v-icon icon="mdi-minus-circle"></v-icon></v-btn>
                    </v-col>
                </v-row>
                <v-row v-if="shipment.mode_of_transport == 'Air' && (shipment.service_request == '1' || shipment.service_request == '2')" v-for="(item, index) in shipment.airports">
                    <v-col>
                        <v-autocomplete label="Airport of Loading" density="compact"
                                        :items=masters.data.airports v-model="item.port_of_loading" item-title="label"
                                        item-value="value" variant="outlined"
                                        :rules="nameRules">
                                    </v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-autocomplete label="Airport of Discharge" density="compact"
                                        :items=masters.data.airports v-model="item.port_of_discharge" item-title="label"
                                        item-value="value" variant="outlined"
                                        :rules="nameRules"
                                        >
                                    </v-autocomplete>
                    </v-col>
                    <v-col cols="1">
                        <v-btn variant="outlined" @click="append_airports_array()"><v-icon icon="mdi-plus-circle"></v-icon></v-btn>
                    </v-col>
                    <v-col cols="1">
                        <v-btn variant="outlined" @click="remove_airports_array(index)" v-if="index > 0"><v-icon icon="mdi-minus-circle"></v-icon></v-btn>
                    </v-col>
                </v-row>

                <v-row v-if="shipment.incoterm.includes('DDU') || shipment.incoterm.includes('DDP') || shipment.incoterm.includes('DAP') || shipment.incoterm.includes('DPU') || shipment.incoterm.includes('CIF') || shipment.incoterm.includes('EXW')">
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Pickup Location"
                                    v-model="shipment.pickup_location" :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Pickup Zip Code"
                                    v-model="shipment.pickup_zipcode"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Pickup Address"
                                    v-model="shipment.pickup_address"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Pickup Contact"
                                    v-model="shipment.pickup_contact"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                </v-row>

                <v-row v-if="shipment.nature_of_shipment =='Export'">
                    <v-col v-if="(shipment.service_request == '3' && shipment.mode_of_transport.includes('Air'))">
                        <v-autocomplete label="Delivery Airport" density="compact"
                                    :items=masters.data.domestic_airports v-model="shipment.delivery_airport" item-title="label"
                                    item-value="value" variant="outlined"
                                    :rules="nameRules">
                                </v-autocomplete>
                    </v-col>
                    <v-col v-if="(shipment.service_request == '3' && shipment.mode_of_transport.includes('Sea'))">
                        <v-autocomplete label="Delivery CFS" density="compact"
                                    :items=masters.data.container_freight_stations v-model="shipment.delivery_cfs"
                                    item-title="label" item-value="value" variant="outlined"
                                    :rules="nameRules">
                                </v-autocomplete>
                    </v-col>
                </v-row>
                <v-row v-if="shipment.nature_of_shipment =='Import'">
                    <v-col cols="4" v-if="shipment.mode_of_transport.includes('Air')">
                        <v-autocomplete label="Pickup Airport" density="compact"
                                    :items=masters.data.domestic_airports v-model="shipment.pickup_airport" item-title="label"
                                    item-value="value" variant="outlined"
                                    :rules="nameRules">
                                </v-autocomplete>
                    </v-col>
                    <v-col v-if="shipment.mode_of_transport.includes('Sea')">
                        <v-autocomplete label="Pickup CFS" density="compact"
                                    :items=masters.data.container_freight_stations v-model="shipment.pickup_cfs"
                                    item-title="label" item-value="value" variant="outlined"
                                    :rules="nameRules">
                                </v-autocomplete>
                    </v-col>
                </v-row>
                <v-row v-if="shipment.incoterm.includes('DDU') || shipment.incoterm.includes('DDP') || shipment.incoterm.includes('DAP') || shipment.incoterm.includes('DPU')">
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Delivery Location"
                                    v-model="shipment.delivery_location"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Delivery Zip Code"
                                    v-model="shipment.delivery_zipcode"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Delivery Address"
                                    v-model="shipment.delivery_address"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Delivery Contact"
                                    v-model="shipment.delivery_contact"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                </v-row>
                <v-row v-if="shipment.incoterm.includes('DDU') || shipment.incoterm.includes('DDP')">
                    <v-col>
                        <v-autocomplete label="Currency" density="compact" :items=masters.data.currencies
                                    v-model="shipment.invoice_currency" item-title="label" item-value="value"
                                    variant="outlined"
                                    :rules="nameRules">
                                </v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Invoice Value"
                                    v-model="shipment.invoice_value"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="HS Code"
                                    v-model="shipment.hs_code"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-autocomplete
                                    :label="shipment.nature_of_shipment == 'Export' ? 'Shipper Category': 'Consignee Category'"
                                    density="compact" :items=masters.data.shipper_categories
                                    v-model="shipment.shipper_category" item-title="label" item-value="value"
                                    variant="outlined"
                                    :rules="nameRules">
                                </v-autocomplete>
                    </v-col>
                    <v-col v-if="shipment.nature_of_shipment == 'Export'">
                        <v-text-field variant="outlined" density="compact" label="AD Code"
                                    v-model="shipment.ad_code"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col v-if="shipment.nature_of_shipment == 'Import'">
                        <v-autocomplete label="Type of Clearance" density="compact"
                                    :items=masters.data.types_of_clearance v-model="shipment.type_of_clearance"
                                    item-title="label" item-value="value" variant="outlined"
                                    :rules="nameRules">
                                </v-autocomplete>
                    </v-col>
                    <v-col v-if="shipment.nature_of_shipment == 'Import'">
                        <v-text-field variant="outlined" density="compact"
                                    :label="get_carrier_caption(shipment.mode_of_transport)"
                                    v-model="shipment.carrier_name"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                </v-row>
                <v-row v-if="shipment.service_request == '2' && shipment.nature_of_shipment == 'Import'">
                    <v-col>
                        <v-date-input variant="outlined" density="compact" label="Carrier Departure Date"
                                    v-model="shipment.carrier_departure_date"
                                    :rules="nameRules"></v-date-input>
                    </v-col>
                    <v-col>
                        <v-date-input variant="outlined" density="compact" label="Carrier Arrival Date"
                                    v-model="shipment.carrier_arrival_date"
                                    :rules="nameRules"></v-date-input>
                    </v-col>
                    <v-col>
                        <v-autocomplete label="Delivery Type" density="compact" :items=deliery_type_list
                                    v-model="shipment.delivery_type" item-title="label" item-value="value" variant="outlined"
                                    :rules="nameRules">
                                </v-autocomplete>
                    </v-col>
                </v-row>
            </v-card>

            <v-card class="mt-2 pl-5 pr-5 mb-2" title="Cargo Details" :subtitle="'# '+ (index+1)" variant="outlined" v-for="(item, index) in line_items">
                <v-row>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Commodity"
                                    v-model="item.commodity"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-autocomplete label="Cargo Type" density="compact" :items=cargo_type_list
                                    v-model="item.cargo_type" item-title="label" item-value="value" variant="outlined"
                                    :rules="nameRules">
                                </v-autocomplete>
                    </v-col>
                </v-row>
                <v-row v-if="item.cargo_type == 'DG'" v-for="(item, dg_index) in item.cargo_dg_array">
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="IMO Classification"
                                    v-model="item.imo_classification"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="UN Number"
                                    v-model="item.un_number"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col cols="1">
                        <v-btn variant="outlined" @click="append_cargo_dg_array(index)"><v-icon icon="mdi-plus-circle"></v-icon></v-btn>
                    </v-col>
                    <v-col cols="1">
                        <v-btn variant="outlined" @click="remove_cargo_dg_array(index, dg_index)" v-if="dg_index > 0"><v-icon icon="mdi-minus-circle"></v-icon></v-btn>
                    </v-col>
                </v-row>
                <v-row v-if="item.cargo_type == 'Reefer'">
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Coolant Type"
                                    v-model="item.coolant_type"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="No of Packages" type="number"
                                    v-model="item.no_of_packages" @change="calculate_volume()"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-autocomplete label="Packing Type" density="compact"
                                    :items=masters.data.packing_types v-model="item.packing_type" item-title="label"
                                    item-value="value" variant="outlined"
                                    :rules="nameRules">
                                </v-autocomplete>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col v-if="shipment.mode_of_transport.includes('Sea FCL')">
                        <v-text-field variant="outlined" density="compact" label="No of Container"
                                    v-model="item.no_of_containers" type="number" @change="calculate_volume()"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col v-if="shipment.mode_of_transport === 'Sea FCL'">
                        <v-autocomplete label="Containter Type" density="compact"
                                    :items=masters.data.container_types v-model="item.container_type" item-title="label"
                                    item-value="value" variant="outlined"
                                    :rules="nameRules">
                                </v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Gross Weight"
                                    v-model="item.gross_weight" type="number" @change="calculate_volume()"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Net Weight" v-model="item.net_weight"
                                    type="number" @change="calculate_volume()"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-autocomplete label="Dimension In" density="compact" :items=dimensions_in_list
                                    v-model="item.dimensions_in" item-title="label" item-value="value"
                                    @change="calculate_volume()" variant="outlined"
                                    :rules="nameRules">
                                </v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Length" v-model="item.length"
                                    type="number" @change="calculate_volume()"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Breadth" v-model="item.breadth"
                                    type="number" @change="calculate_volume()"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Height" v-model="item.height"
                                    type="number" @change="calculate_volume()"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Volume" v-model="item.volume"
                                    type="number" readonly
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field variant="outlined" density="compact" label="Remarks"
                                    v-model="item.remarks"
                                    :rules="nameRules"></v-text-field>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-btn variant="outlined" v-if="index > 0" @click="remove_items_array(index)">Remove</v-btn>
                    <v-btn variant="outlined" @click="append_items_array()">Add More</v-btn>
                </v-card-actions>
            </v-card>

            <v-card class="mt-2 pl-5 pr-5 mb-2" title="Contact Details" variant="outlined">
                <v-row>
                    <v-col>
                        <v-text-field
                            variant="outlined"
                            density="compact"
                            label="Organization Name"
                            v-model="company_info.organization_name"
                            :rules="nameRules" required>
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field
                            variant="outlined"
                            density="compact"
                            label="Contact Name"
                            v-model="company_info.full_name"
                            :rules="nameRules" required>
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field
                            variant="outlined"
                            density="compact"
                            label="Job Title"
                            v-model="company_info.job_title"
                            :rules="nameRules" required>
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field
                            variant="outlined"
                            density="compact"
                            label="Mobile No"
                            v-model="company_info.mobile_no"
                            :rules="nameRules" required>
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field
                            variant="outlined"
                            density="compact"
                            label="Email Id"
                            v-model="company_info.email"
                            :rules="emailRules" required>
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field
                            variant="outlined"
                            density="compact"
                            label="Whatsapp No"
                            v-model="company_info.whatsapp_no"
                            :rules="nameRules" required>
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field
                            variant="outlined"
                            density="compact"
                            label="City Name"
                            v-model="company_info.city"
                            :rules="nameRules" required>
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-card>

            <v-btn v-if="!route.params.id && !route.name == 'EnquiryEdit'" class="mr-2" variant="outlined" @click="reset_form()">Reset</v-btn>
            <v-btn color="primary" :loading="enquiry.loading" @click="enquiry.fetch()" :disabled="!valid">{{route.params.id && route.name == 'EnquiryEdit' ? 'Edit': 'Submit'}}</v-btn>
        </v-container>  
    </v-form>    

    <v-dialog v-model="show_login_error" max-width="500">
        <v-card>
            <v-card-title>{{login_error_title}}</v-card-title>
            <v-card-text>{{ login_error_message }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="show_login_error = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    
    <div>
        <!-- <Button @click="get_enquiry('qvfs4a2ec0')">get_enquiry</Button> -->
        <!-- <pre>{{ valid }}</pre> -->
        <!-- <pre>{{ shipment }}</pre> -->
        <!-- <pre>{{line_items}}</pre> -->
    </div>
</template>

<script setup>
import { ref, computed, toRaw, watch } from 'vue'
import { session } from '../data/session'
import { createResource } from 'frappe-ui'
import { useRouter, useRoute } from 'vue-router'

const valid = ref(false);
const login_error_title = ref('')
const login_error_message = ref('')
const show_login_error = ref(false)


const router = useRouter()
const route = useRoute()

const cargo_type_list = ref([{ "value": "General", "label": "General" }, { "value": "DG", "label": "DG" }, { "value": "Reefer", "label": "Reefer" }])
const deliery_type_list = ref([{ "value": "Cargo Delivery", "label": "Cargo Delivery" }, { "value": "Container Delivery", "label": "Container Delivery" }])

const shipment = ref(
    {
        "name": route.params.id,
        "service_request": "",
        "nature_of_shipment": "",
        "mode_of_transport": "",
        "place_of_receipt": "",
        "incoterm": "",
        "ports": [
            { "port_of_loading": "", "port_of_discharge": "" }
        ],
        "airports": [
            { "port_of_loading": "", "port_of_discharge": "" }
        ],
        "shipper_location": "",
        "consignee_location": "",
        "pickup_location": "",
        "pickup_zipcode": "",
        "pickup_address": "",
        "pickup_contact": "",
        "pickup_airport": "",
        "pickup_cfs": "",
        "delivery_airport": "",
        "delivery_cfs": "",
        "delivery_location": "",
        "delivery_zipcode":"",
        "delivery_address": "",
        "delivery_contact": "",
        "invoice_currency": "",
        "invoice_value": "",
        "hs_code": "",
        "shipper_category": "",
        "ad_code": ""
    }
)


const line_items = ref(
    [
        {
            "commodity": "",
            "cargo_type": "",
            "cargo_dg_array": [{ "imo_classification": "", "un_number": "" }],
            "no_of_packages": "",
            "gross_weight": "",
            "net_weight": "",
            "no_of_containers": "",
            "dimensions_in":"",
            "length": "",
            "breadth": "",
            "height": "",
            "volume": "",
            "remarks": "",
            "packing_type": {"label": "", "value": ""}
        }
    ]
)
const dimensions_in_list = ref([{ "value": "Inches (In)", "label": "Inches (In)" }, { "value": "Centimeters (cm)", "label": "Centimeters (cm)" }, { "value": "Milimeters (mm)", "label": "Milimeters (mm)" }])



const show_company_info = ref(false);
const company_info = ref({
    "organization_name": '',
    "full_name": '',
    "mobile_no": '',
    "email": '',
    "whatsapp_no": '',
    "city": '',
    "job_title": '',
})


/// validation
const nameRules = [
    value => !!value || '* required.'
];

const emailRules = [
    value => !!value || 'E-mail is required.',
    value => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
];



watch(() => route.params.id, get_enquiry, { immediate: true })

function get_enquiry(id) {
    console.log(route.name)
    if (route.name == 'EnquiryDuplicate') {
        shipment.value.name = ""
    } 
    if (id) {
        let enquiry = createResource({
            url: 'logistics.logistcs.api.get_enquiry',
            params: {
                "id": id
            },
            onSuccess(data) {

                if (data.status == false) {
                    login_error_title.value = 'Error'
                    login_error_message.value = 'Could not Find Enquiry'
                    show_login_error.value = true
                } else {

                    shipment.value.service_request = data.service_code
                    shipment.value.nature_of_shipment = data.nature_of_shipment                
                    shipment.value.mode_of_transport = data.mode_of_transport
                    shipment.value.place_of_receipt = data.place_of_receipt                
                    shipment.value.incoterm = data.incoterm

                    shipment.value.ports.splice(0, 1)
                    for(let p of data.ports){
                        shipment.value.ports.push(
                            {
                                "port_of_loading": p.port_of_loading,
                                "port_of_discharge": p.port_of_discharge
                            }
                        )
                    }

                    shipment.value.airports.splice(0, 1)
                    for(let p of data.airports){
                        shipment.value.airports.push(
                            {
                                "port_of_loading":p.airport_of_loading,
                                "port_of_discharge":p.airport_of_discharge
                            }
                        )
                    }

                    // "ports": [
                    //     { "port_of_loading": "", "port_of_discharge": "" }
                    // ],
                    // "airports": [
                    //     { "port_of_loading": "", "port_of_discharge": "" }
                    // ],
                    shipment.value.shipper_location = data.shipper_location
                    shipment.value.consignee_location = data.consignee_location
                    shipment.value.pickup_location = data.pickup_location
                    shipment.value.pickup_zipcode = data.pickup_zipcode
                    shipment.value.pickup_address = data.pickup_address
                    shipment.value.pickup_contact = data.pickup_contact
                    shipment.value.pickup_airport = data.pickup_airport
                    shipment.value.pickup_cfs = data.pickup_cfs
                    shipment.value.delivery_airport = data.delivery_airport
                    shipment.value.delivery_cfs = data.delivery_cfs
                    shipment.value.delivery_location = data.delivery_location
                    shipment.value.delivery_zipcode = data.delivery_zipcode
                    shipment.value.delivery_address = data.delivery_address
                    shipment.value.delivery_contact = data.delivery_contact
                    shipment.value.invoice_value = data.invoice_value
                    shipment.value.invoice_currency = data.invoice_currency
                    shipment.value.hs_code = data.hs_code
                    shipment.value.shipper_category = data.shipper_category
                    shipment.value.ad_code = data.ad_code
                    // shipment.value.service_request.name = data.service_request

                    line_items.value.splice(0,1)
                    for(let i of data.items) {

                        let cargo_dg_array = []

                        if (i.cargo_dg_array) {
                            cargo_dg_array = JSON.parse(i.cargo_dg_array)
                        }
                        // console.log('eeeeee', i)
                        line_items.value.push({
                            "commodity" : i.commodity,
                            "cargo_type" : i.cargo_type,
                            "cargo_dg_array": cargo_dg_array,
                            "no_of_packages" : i.no_of_packages,
                            "gross_weight" : i.gross_weight,
                            "net_weight" : i.net_weight,
                            "no_of_containers" : i.no_of_containers,
                            "dimensions_in" : i.dimensions_in,
                            "length" : i.length,
                            "breadth" : i.breadth,
                            "height" : i.height,
                            "volume" : i.volume,
                            "remarks" : i.remarks,
                            "packing_type": i.packing_type
                        })

                    }



                    company_info.value.organization_name = data.organization_name 
                    company_info.value.full_name = data.full_name 
                    company_info.value.last_name = data.last_name 
                    company_info.value.mobile_no = data.mobile_no 
                    company_info.value.email = data.email 
                    company_info.value.whatsapp_no = data.whatsapp_no 
                    company_info.value.city = data.city 
                    company_info.value.job_title = data.job_title 
                }

            },
            onError(error) {
                console.log('eeeeee', error)
            }
        })
    
        enquiry.fetch()

    }

}


function append_cargo_dg_array(index) {
    this.line_items[index].cargo_dg_array.push({ "imo_classification": "", "un_number": "" })
    // this.line_items["cargo_dg_array"].push()
}

function remove_items_array(index) {
    this.line_items.splice(index, 1)
}

function reset_items_array() {
    line_items.value = [
        {
            "incoterm": "",
            "place_of_receipt": "",
            "port_of_loading": "",
            "port_of_discharge": "",
            "airport_of_loading": "",
            "airport_of_discharge": "",
            "cargo_type": "",
            "cargo_dg_array": [{ "imo_classification": "", "un_number": "" }],
            "coolant_type": "",
            "no_of_packages": "",
            "gross_weight": "",
            "no_of_containers": "",
            "dimensions_in": "",
            "length": "",
            "breadth": "",
            "height": "",
            "volume": "",
            "remarks": ""
        }
    ]
}

function append_items_array() {
    this.line_items.push(
        {
            "incoterm": "",
            "place_of_receipt": "",
            "port_of_loading": "",
            "port_of_discharge": "",
            "airport_of_loading": "",
            "airport_of_discharge": "",
            "cargo_type": "",
            "cargo_dg_array": [{ "imo_classification": "", "un_number": "" }],
            "coolant_type": "",
            "no_of_packages": "",
            "packing_type": "",
            "gross_weight": "",
            "no_of_containers": "",
            "container_type": "",
            "dimensions_in": "",
            "length": "",
            "breadth": "",
            "height": "",
            "volume": "",
            "remarks": ""
        }
    )
}

function remove_cargo_dg_array(index, dg_index) {
    // console.log(index, dg_index)
    this.line_items[index].cargo_dg_array.splice(dg_index, 1)
}

function reset_cargo_dg_array() {
    // line_items.cargo_dg_array.value = [{
    //     "imo_classification": "",
    //     "un_number": ""
    // }]
}


function remove_ports_array(index) {
    this.shipment.ports.splice(index, 1)
}

function append_ports_array() {
    this.shipment.ports.push(
        { "port_of_loading": "", "port_of_discharge": "" }
    )
}
function remove_airports_array(index) {
    this.shipment.airports.splice(index, 1)
}

function append_airports_array() {
    this.shipment.airports.push(
        { "port_of_loading": "", "port_of_discharge": "" }
    )
}


function calculate_volume() {
    console.log('dd')
    this.line_items.forEach((item, index) => {
        // console.log('item', item)
        if (this.shipment.mode_of_transport == 'Air') {
            if (item.dimensions_in == 'Inches (In)') {
                let cal_inches = ((item.length * item.breadth * item.height) / 366) * item.no_of_packages;
                item.volume = parseFloat(cal_inches).toFixed(3)
            }

            if (item.dimensions_in == 'Centimeters (cm)') {
                let cal_cms = ((item.length * item.breadth * item.height) / 6000) * item.no_of_packages;
                item.volume = parseFloat(cal_cms).toFixed(3)
            }
            if (item.dimensions_in == 'Milimeters (mm)') {
                let cal_mm = ((item.length * item.breadth * item.height) / 6000) * item.no_of_packages * 0.1;
                item.volume = parseFloat(cal_mm).toFixed(3)

            }
        } else {
            if (item.dimensions_in == 'Inches (In)') {
                let cal_inches = (((item.length * item.breadth * item.height) * 2.54) / 1000000) * item.no_of_packages;
                item.volume = parseFloat(cal_inches).toFixed(3)
            }
            if (item.dimensions_in == 'Centimeters (cm)') {
                let cal_cms = ((item.length * item.breadth * item.height) / 1000000) * item.no_of_packages;
                item.volume = parseFloat(cal_cms).toFixed(3)
            }
            if (item.dimensions_in == 'Milimeters (mm)') {
                let cal_mm = (((item.length * item.breadth * item.height) * 0.1) / 1000000) * item.no_of_packages;
                item.volume = parseFloat(cal_mm).toFixed(3)
            }

        }
    })
}

function validate_input($event, field_name, field_type) {
    this.v$[field_name].$touch()

    if (field_type == 'number') {
        this.shipment[field_name] = parseFloat($event.target.value).toFixed(3)
    }

    if (field_type == 'int') {
        this.shipment[field_name] = parseInt($event.target.value)
    }
}

function reset_form() {

}


const raw = { 
    "shipment": toRaw(shipment)._rawValue,
    "line_items": toRaw(line_items)._rawValue,
    "company_info": toRaw(company_info)._rawValue
}

let enquiry = createResource({
    url: 'logistics.logistcs.api.submit_enquiry',
    params: raw,
    onSuccess(data) {

        if (data.status == false) {
            login_error_title.value = 'Error'
            login_error_message.value = data.message
            show_login_error.value = true

        } else {
            login_error_title.value = 'Success'
            login_error_message.value = `Enquiry Reference No : ${data.message} Processed`
            show_login_error.value = true
            // router.push('/')
        }
    }

})

function get_carrier_caption(mode_of_transport) {
    // console.log(mode_of_transport)
    if (mode_of_transport === 'Air') {
        return 'Airlines Name'
    }
    if (mode_of_transport === 'Sea FCL') {
        return 'Liner Name'
    }
    if (mode_of_transport === 'Sea LCL') {
        return 'Coloader Name'
    }
    return 'Carrier Name'
}


const masters = createResource({
    url: 'logistics.logistcs.api.get_masters_data',
    auto: true,
})


</script>

<style>

</style>