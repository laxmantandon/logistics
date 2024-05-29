<template>
    <div class="flex justify-end p-5">
        <router-link to="/" tag="button"><Button class="mr-2">Enquiry List</Button></router-link>
        <Button :loading="session.logout.loading" @click="session.logout.submit()">Logout</Button>
    </div>
    <div class="flex flex-col items-center justify-center pt-5">
        <!-- <div v-if="selected_enquiry_modes == false && show_company_info == false">
            <div class="flex flex-col items-center">
                <div><img class="h-16 w-20" src="/files/bliss_logo.jpg"></div>
                <div>
                    <h4 v-if="enquiry_type" class="text-2xl text-center">Title 2 ?</h4>
                    <h4 v-if="!enquiry_type" class="text-2xl text-center">Title 1 ?</h4>
                </div>
                <div class="flex flex-row">
                    <div class="items-center m-2 border-2 border-gray-400 p-10 w-40 text-center hover:border-gray-700 rounded"
                        @click="select_enquiry_type(item.name)"
                        v-for="(item, index) in enquiry_type ? enquiry_modes : enquiry_types">
                        <div>
                            <ion-icon class="text-3xl" :name="item.icon"></ion-icon>
                        </div>
                        {{ item.name }}
                    </div>
                </div>

            </div>
        </div> -->




        <div class="mb-10 ">

            <div class="p-2 bg-gray-900 text-white"><b>Service Requirement</b></div>

            <div class="border border-gray-400">
                <div class="flex">
                    <div class="p-2 w-1/2 ">
                        <label class="block text-xs text-gray-900 pb-1">Service Request</label>
                        <Autocomplete :options=masters.data.service_requests v-model="shipment.service_request"
                            placeholder="Service Request" @blur="validate_input($event, 'service_request', 'text')" />
                    </div>
                </div>
            </div>

            <div class="m-1">&nbsp;</div>


            <div class="p-2 bg-gray-900 text-white"><b>Nature of Shipment</b></div>

            <div class="border border-gray-400">
                <div class="flex">
                    <div class="p-2 w-full ">
                        <label class="block text-xs text-gray-900 pb-1">Nature of Shipment</label>
                        <Autocomplete :options=masters.data.nature_of_shipments v-model="shipment.nature_of_shipment"
                            placeholder="Nature of Shipment"
                            @blur="validate_input($event, 'nature_of_shipment', 'text')" />
                    </div>
                    <div class="p-2 w-full ">
                        <label class="block text-xs text-gray-900 pb-1">Mode of Transport</label>
                        <Autocomplete :options=masters.data.mode_of_transports v-model="shipment.mode_of_transport"
                            placeholder="Mode of Transport"
                            @blur="validate_input($event, 'mode_of_transport', 'text')" />
                    </div>
                </div>
            </div>

            <div class="m-1">&nbsp;</div>

            <div class="p-2 bg-gray-900 text-white"><b>Shipping Info</b></div>

            <div class="border border-gray-400">
                <div class="flex" v-if="shipment.service_request.value !== '3'">
                    <div class="p-2 w-full">
                        <label class="block text-xs text-gray-900 pb-1">Place of Receipt</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="Place of Receipt" :disabled="false" label="Place of Receipt"
                            v-model="shipment.place_of_receipt"
                            @blur="validate_input($event, 'place_of_receipt', 'text')" />
                        <!-- <ErrorMessage class="pt-0.5" v-if="v$.place_of_receipt.$error" message="Please enter correct value"/> -->
                    </div>

                    <div class="p-2 w-full">
                        <label class="block text-xs text-gray-900 pb-1">Incoterms</label>
                        <Autocomplete :options=masters.data.incoterms v-model="shipment.incoterm"
                            placeholder="Incoterms" @blur="validate_input($event, 'incoterm', 'text')" />
                        <!-- <ErrorMessage class="pt-0.5" v-if="v$.incoterm.$error" message="Please enter correct value"/> -->
                    </div>
                    <div class="p-2 w-40">&nbsp;</div>
                </div>

                <div v-if="shipment.mode_of_transport.value.includes('Sea') && (shipment.service_request.value == '1' || shipment.service_request.value == '2')">
                    <div class="flex flex-row" v-for="(item, index) in shipment.ports">
                        <div class="p-2 w-full">
                            <label v-if="index == 0" class="block text-xs text-gray-900 pb-1">Port of Loading</label>
                            <Autocomplete :options=masters.data.ports v-model="item.port_of_loading"
                                placeholder="Port of Loading" />
                        </div>
                        <div class="p-2 w-full">
                            <label v-if="index == 0" class="block text-xs text-gray-900 pb-1">Port of Discharge</label>
                            <Autocomplete :options=masters.data.ports v-model="item.port_of_discharge"
                                placeholder="Port of Discharge" />
                        </div>
                        <div class="p-2 w-40">
                            <label v-if="index == 0" class="block text-xs text-gray-900 pb-1">&nbsp;</label>
                            <Button class="mr-2" @click="append_ports_array()" :variant="'solid'" theme="gray" size="sm"
                                label="Button" :loading="false" :loadingText="null" :disabled="false" :link="null">
                                +
                            </Button>
                            <Button style="border: 1px solid red !important; color: red !important" v-if="index > 0"
                                @click="remove_ports_array(index)" :variant="'solid'" theme="red" size="sm"
                                label="Button" :loading="false" :loadingText="null" :disabled="false" :link="null">
                                -
                            </Button>

                        </div>
                    </div>
                </div>


                <div
                    v-if="shipment.mode_of_transport.value == 'Air' && (shipment.service_request.value == '1' || shipment.service_request.value == '2')">
                    <div class="flex flex-row" v-for="(item, index) in shipment.airports">
                        <div class="p-2 w-full">
                            <label v-if="index == 0" class="block text-xs text-gray-900 pb-1">Airport of Loading</label>
                            <Autocomplete :options=masters.data.airports v-model="item.port_of_loading"
                                placeholder="Airport of Loading" />
                        </div>
                        <div class="p-2 w-full">
                            <label v-if="index == 0" class="block text-xs text-gray-900 pb-1">Airport of
                                Discharge</label>
                            <Autocomplete :options=masters.data.airports v-model="item.port_of_discharge"
                                placeholder="Airport of Discharge" />
                        </div>
                        <div class="p-2 w-40">
                            <label v-if="index == 0" class="block text-xs text-gray-900 pb-1">&nbsp;</label>
                            <Button class="mr-2" @click="append_airports_array()" :variant="'solid'" theme="gray"
                                size="sm" label="Button" :loading="false" :loadingText="null" :disabled="false"
                                :link="null">
                                +
                            </Button>
                            <Button style="border: 1px solid red !important; color: red !important" v-if="index > 0"
                                @click="remove_airports_array(index)" :variant="'solid'" theme="red" size="sm"
                                label="Button" :loading="false" :loadingText="null" :disabled="false" :link="null">
                                -
                            </Button>

                        </div>
                    </div>
                </div>

                <!-- <div class="flex border-t">
                    <div class="p-2 w-1/4"
                        v-if="shipment.incoterm.value.includes('EXW') || shipment.incoterm.value.includes('CIF')">
                        <label class="block text-xs text-gray-900 pb-1">Shipper Location</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="Shipper Location" :disabled="false" label="Shipper Location"
                            v-model="shipment.shipper_location" />
                    </div>

                    <div class="p-2 w-1/4"
                        v-if="shipment.incoterm.value.includes('DDU') || shipment.incoterm.value.includes('DDP')">
                        <label class="block text-xs text-gray-900 pb-1">Consignee Location</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="Consignee Location" :disabled="false" label="Consignee Location"
                            v-model="shipment.consignee_location" />
                    </div>

                </div> -->
                <div class="flex" v-if="shipment.incoterm.value.includes('DDU') || shipment.incoterm.value.includes('DDP') || shipment.incoterm.value.includes('DAP') || shipment.incoterm.value.includes('DPU') || shipment.incoterm.value.includes('CIF') || shipment.incoterm.value.includes('EXW')">    
                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">Pickup Location</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="Shipper" :disabled="false" label="Shipper Location"
                            v-model="shipment.pickup_location" />
                    </div>
                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">Pickup Zip Code</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="Zip Code" :disabled="false" label="Zip Code"
                            v-model="shipment.pickup_zipcode" />
                    </div>
                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">Pickup Address</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="Full Address" :disabled="false" label="Pickup Address"
                            v-model="shipment.pickup_address" />
                    </div>
                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">Pickup Contact</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="Contact" :disabled="false" label="Pickup Contact"
                            v-model="shipment.pickup_contact" />
                    </div>

                </div>
                <div class="flex border-t" v-if="shipment.nature_of_shipment.value =='Export'">
                    <div class="p-2 w-1/4"
                        v-if="(shipment.service_request.value == '3' && shipment.mode_of_transport.value.includes('Air'))">
                        <label v-if="index == 0" class="block text-xs text-gray-900 pb-1">Delivery Airport</label>
                        <Autocomplete :options=masters.data.domestic_airports v-model="shipment.delivery_airport"
                            placeholder="Delivery Airport" />
                    </div>
                    <div class="p-2 w-1/4"
                        v-if="(shipment.service_request.value == '3' && shipment.mode_of_transport.value.includes('Sea'))">
                        <label v-if="index == 0" class="block text-xs text-gray-900 pb-1">Delivery CFS</label>
                        <Autocomplete :options=masters.data.container_freight_stations v-model="shipment.delivery_cfs"
                            placeholder="Delivery CFS" />
                    </div>
                </div>


                <div class="flex border-t" v-if="shipment.nature_of_shipment.value =='Import'">
                    <div class="p-2 w-1/4"
                        v-if="shipment.mode_of_transport.value.includes('Air')">
                        <label class="block text-xs text-gray-900 pb-1">Pickup Airport</label>
                        <Autocomplete :options=masters.data.domestic_airports v-model="shipment.pickup_airport"
                            placeholder="Pickup Airport" />
                    </div>
                    <div class="p-2 w-1/4"
                        v-if="shipment.mode_of_transport.value.includes('Sea')">
                        <label class="block text-xs text-gray-900 pb-1">Pickup CFS</label>
                        <Autocomplete :options=masters.data.container_freight_stations v-model="shipment.pickup_cfs"
                            placeholder="Pickup CFS" />
                    </div>
                </div>

                
                <div class="flex" v-if="shipment.incoterm.value.includes('DDU') || shipment.incoterm.value.includes('DDP') || shipment.incoterm.value.includes('DAP') || shipment.incoterm.value.includes('DPU')">
                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">Delivery Location</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="Consignee" :disabled="false" label="Delivery Location"
                            v-model="shipment.delivery_location" />
                    </div>
                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">Delivery Zip Code</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="Zip Code" :disabled="false" label="Delivery Zip Code"
                            v-model="shipment.delivery_zipcode" />
                    </div>
                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">Delivery Address</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="Full Address" :disabled="false" label="Delivery Address"
                            v-model="shipment.delivery_address" />
                    </div>
                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">Delivery Contact</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="Contact" :disabled="false" label="Delivery Contact"
                            v-model="shipment.delivery_contact" />
                    </div>
                </div>


                <div class="flex" v-if="shipment.incoterm.value.includes('DDU') || shipment.incoterm.value.includes('DDP')">
                    <div class="p-2 w-32">
                        <label class="block text-xs text-gray-900 pb-1">Currency</label>
                        <Select :options="masters.data.currencies" v-model="shipment.invoice_currency"
                            placeholder="Currency"></Select>
                        <!-- <ErrorMessage class="pt-1.5" v-if="v$.invoice_value.$error" message="Invalid Input"/> -->
                    </div>
                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">Invoice Value</label>
                        <TextInput class="border-gray-800" :type="'number'" size="sm" variant="subtle"
                            placeholder="0.00" :disabled="false" label="Invoice Value" v-model="shipment.invoice_value"
                            @blur="validate_input($event, 'invoice_value', 'number')" />
                        <!-- <ErrorMessage class="pt-1.5" v-if="v$.invoice_value.$error" message="Invalid Input"/> -->
                    </div>

                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">HS Code</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="HS Code" :disabled="false" label="HS Code" v-model="shipment.hs_code"
                            @blur="validate_input($event, 'hs_code', 'text')" />
                        <ErrorMessage class="pt-1.5" v-if="v$.hs_code.$error" message="Invalid Input" />
                    </div>
                </div>

                <div class="flex" v-if="shipment.service_request.value == '2'">

                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">{{shipment.nature_of_shipment.value == 'Export'
                            ? 'Shipper Category': 'Consignee Category'}}</label>
                        <Autocomplete :options=masters.data.shipper_categories v-model="shipment.shipper_category"
                            placeholder="" @blur="validate_input($event, 'shipper_category', 'text')" />
                        <!-- <ErrorMessage class="pt-0.5" v-if="v$.incoterm.$error" message="Please enter correct value"/> -->
                    </div>
                    <div class="p-2 w-1/4" v-if="shipment.nature_of_shipment.value == 'Export'">
                        <label class="block text-xs text-gray-900 pb-1">AD Code</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="AD Code" :disabled="false" label="AD Code" v-model="shipment.ad_code"
                            @blur="validate_input($event, 'ad_code', 'text')" />
                        <!-- <ErrorMessage class="pt-0.5" v-if="v$.place_of_receipt.$error" message="Please enter correct value"/> -->
                    </div>
                    <div class="p-2 w-1/4" v-if="shipment.nature_of_shipment.value == 'Import'">
                        <label class="block text-xs text-gray-900 pb-1">Type of Clearance</label>
                        <Autocomplete :options=masters.data.types_of_clearance v-model="shipment.type_of_clearance"
                            placeholder="" @blur="validate_input($event, 'type_of_clearance', 'text')" />
                        <!-- <ErrorMessage class="pt-0.5" v-if="v$.place_of_receipt.$error" message="Please enter correct value"/> -->
                    </div>
                    <div class="p-2 w-1/4" v-if="shipment.nature_of_shipment.value == 'Import'">
                        <label
                            class="block text-xs text-gray-900 pb-1">{{get_carrier_caption(shipment.mode_of_transport.value)}}</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle" placeholder=""
                            :disabled="false" label="Carrier Name" v-model="shipment.carrier_name"
                            @blur="validate_input($event, 'carrier_name', 'text')" />
                        <!-- <ErrorMessage class="pt-0.5" v-if="v$.place_of_receipt.$error" message="Please enter correct value"/> -->
                    </div>
                    <div class="p-2 w-40">&nbsp;</div>
                </div>
                <div class="flex"
                    v-if="shipment.service_request.value == '2' && shipment.nature_of_shipment.value == 'Import'">

                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">Carrier Departure Date</label>
                        <TextInput class="border-gray-800" :type="'date'" size="sm" variant="subtle" placeholder=""
                            :disabled="false" label="Carrier Departures Date" v-model="shipment.carrier_departure_date"
                            @blur="validate_input($event, 'carrier_departure_date', 'date')" />
                        <!-- <ErrorMessage class="pt-0.5" v-if="v$.incoterm.$error" message="Please enter correct value"/> -->
                    </div>
                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">Carrier Arrival Date</label>
                        <TextInput class="border-gray-800" :type="'date'" size="sm" variant="subtle" placeholder=""
                            :disabled="false" label="Carrier Arrival Date" v-model="shipment.carrier_arrival_date"
                            @blur="validate_input($event, 'carrier_arrival_date', 'date')" />
                        <!-- <ErrorMessage class="pt-0.5" v-if="v$.incoterm.$error" message="Please enter correct value"/> -->
                    </div>

                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">Delivery Type</label>
                        <Select :options=deliery_type_list v-model="shipment.delivery_type"
                            placeholder="Delivery Type"></Select>
                        <!-- <ErrorMessage class="pt-0.5" v-if="v$.incoterm.$error" message="Please enter correct value"/> -->
                    </div>

                    <div class="p-2 w-40">&nbsp;</div>
                </div>


                <div class="flex" v-if="shipment.service_request.value == '2'">

                    <!-- <div class="p-2 w-full">
                        <label class="block text-xs text-gray-900 pb-1">Invoice/Packing List</label>
                        <FileUploader :fileTypes="['image/*']" :validateFile="(fileObject) => {}"
                            @success="(file) => {}">
                            <template
                                #default="{ file, uploading, progress, uploaded, message, error, total, success, openFileSelector }">
                                <Button>
                                    Attach {{ progress }}%
                                </Button>
                            </template>
                        </FileUploader>
                        <ErrorMessage class="pt-0.5" v-if="v$.incoterm.$error" message="Please enter correct value"/>
                    </div>
                    <div class="p-2 w-full ">
                        <label class="block text-xs text-gray-900 pb-1">{{ shipment.nature_of_shipment.value ==
                            'Import'? 'BL Copy' : 'Old Shipping Bill Copy'}}</label>
                        <FileUploader :fileTypes="['image/*']" :validateFile="(fileObject) => {}"
                            @success="(file) => {}">
                            <template
                                #default="{ file, uploading, progress, uploaded, message, error, total, success, openFileSelector }">
                                <Button>
                                    Attach {{ progress }}%
                                </Button>
                            </template>
                        </FileUploader>
                        <ErrorMessage class="pt-0.5" v-if="v$.place_of_receipt.$error" message="Please enter correct value"/> 
                    </div>-->
                    <div class="p-2 w-40">&nbsp;</div>
                </div>
            </div>

            <div class="m-1">&nbsp;</div>
            <div v-for="(item, index) in line_items" class="flex flex-col mb-5 border border-gray-400">
                <div class="flex flex-row p-2 justify-between border-b bg-gray-900 text-white">
                    <div>
                        <label class="block text-white pb-1 items-start" style="color: white !important"><b>Cargo
                                Details - {{ index + 1 }}</b></label>
                    </div>
                </div>


                <div class="flex flex-row">
                    <div class="p-2 w-1/2">
                        <label class="block text-xs text-gray-900 pb-1">Commodity</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="Commodity" :disabled="false" label="Commodity" v-model="item.commodity" />
                    </div>
                    <div class="p-2 w-1/2">
                        <label class="block text-xs text-gray-900 pb-1">Cargo Type</label>
                        <Select :options=cargo_type_list v-model="item.cargo_type" placeholder="Cargo Type"></Select>
                    </div>
                </div>
                <div v-if="item.cargo_type == 'DG'" v-for="(item, dg_index) in item.cargo_dg_array" class="flex">
                    <div class="p-2 w-full">
                        <label class="block text-xs text-gray-900 pb-1">IMO Classification</label>
                        <TextInput class="border-gray-800" type="text" size="sm" variant="subtle"
                            placeholder="IMO Classification" :disabled="false" label="IMO Classification"
                            v-model="item.imo_classification" />
                    </div>
                    <div class="p-2 w-full">
                        <label class="block text-xs text-gray-900 pb-1">UN Number</label>
                        <TextInput class="border-gray-800" type="text" size="sm" variant="subtle"
                            placeholder="UN Number" :disabled="false" label="UN Number" v-model="item.un_number" />
                    </div>
                    <div class="p-2 w-full">
                        <label class="block text-xs text-gray-900 pb-1">&nbsp;</label>
                        <Button class="mr-2" @click="append_cargo_dg_array(index)" :variant="'solid'" theme="gray"
                            size="sm" label="Button" :loading="false" :loadingText="null" :disabled="false"
                            :link="null">
                            +
                        </Button>
                        <Button style="border: 1px solid red !important; color: red !important" v-if="dg_index > 0"
                            @click="remove_cargo_dg_array(index, dg_index)" :variant="'solid'" theme="red" size="sm"
                            label="Button" :loading="false" :loadingText="null" :disabled="false" :link="null">
                            -
                        </Button>

                    </div>
                </div>
                <div v-if="item.cargo_type == 'Reefer'">
                    <div class="p-2 w-1/2">
                        <label class="block text-xs text-gray-900 pb-1">Coolant Type</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="Coolant Type" :disabled="false" label="Coolant Type"
                            v-model="item.coolant_type" />
                    </div>
                </div>

                <div class="flex flex-row">

                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">No of Packages</label>
                        <TextInput class="border-gray-800" :type="'number'" size="sm" variant="subtle"
                            placeholder="0.00" :disabled="false" label="No of Packages" v-model="item.no_of_packages"
                            @change="calculate_volume()" />
                    </div>
                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">Packing Type</label>
                        <Autocomplete :options=masters.data.packing_types v-model="item.packing_type"
                            placeholder="Packing Type" />
                    </div>
                </div>


                <div class="flex flex-row">

                    <div class="p-2 w-1/4" v-if="shipment.mode_of_transport.value.includes('Sea')">
                        <label class="block text-xs text-gray-900 pb-1">No of Containers</label>
                        <TextInput class="border-gray-800" :type="'number'" size="sm" variant="subtle" placeholder="0"
                            :disabled="false" label="No of Containers" v-model="item.no_of_containers"
                            @change="calculate_volume()" />
                    </div>

                    <div class="p-2 w-1/4" v-if="shipment.mode_of_transport.value === 'Sea FCL'">
                        <label class="block text-xs text-gray-900 pb-1">Container Type</label>
                        <Autocomplete :options=masters.data.container_types v-model="item.container_type"
                            placeholder="Container Type" />
                    </div>
                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">Gross Weight</label>
                        <TextInput class="border-gray-800" :type="'number'" size="sm" variant="subtle"
                            placeholder="0.00" :disabled="false" label="Gross Weight" v-model="item.gross_weight"
                            @change="calculate_volume()" />
                    </div>
                    <div class="p-2 w-1/4">
                        <label class="block text-xs text-gray-900 pb-1">Net Weight</label>
                        <TextInput class="border-gray-800" :type="'number'" size="sm" variant="subtle"
                            placeholder="0.00" :disabled="false" label="Net Weight" v-model="item.net_weight"
                            @change="calculate_volume()" />
                    </div>

                </div>
                <div class="flex flex-row">

                    <div class="p-2 w-1/2">
                        <label class="block text-xs text-gray-900 pb-1">Dimensions In</label>
                        <Select :options=dimensions_in_list v-model="item.dimensions_in" @change="calculate_volume()"
                            placeholder="Dimensions In" ></Select>
                    </div>
                    <div class="p-2 w-40">
                        <label class="block text-xs text-gray-900 pb-1">Length</label>
                        <TextInput class="border-gray-800" :type="'number'" size="sm" variant="subtle"
                            placeholder="0.00" :disabled="false" label="Length" v-model="item.length"
                            @change="calculate_volume()" />
                    </div>
                    <div class="p-2 w-40">
                        <label class="block text-xs text-gray-900 pb-1">Breadth</label>
                        <TextInput class="border-gray-800" :type="'number'" size="sm" variant="subtle"
                            placeholder="0.00" :disabled="false" label="Breadth" v-model="item.breadth"
                            @change="calculate_volume()" />
                    </div>
                    <div class="p-2 w-40">
                        <label class="block text-xs text-gray-900 pb-1">Height</label>
                        <TextInput class="border-gray-800" :type="'number'" size="sm" variant="subtle"
                            placeholder="0.00" :disabled="false" label="Height" v-model="item.height"
                            @change="calculate_volume()" />
                    </div>
                    <div class="p-2 w-40">
                        <label class="block text-xs text-gray-900 pb-1">Volume</label>
                        <TextInput class="border-gray-800" :type="'number'" size="sm" variant="subtle"
                            placeholder="0.00" :disabled="true" label="Volume" v-model="item.volume" />
                    </div>

                </div>
                <div class="flex flex-row p-2 border-t justify-between">
                    <div class="w-1/2">
                        <label class="block text-xs text-gray-900 pb-1">Remarks</label>
                        <TextInput class="border-gray-800" :type="'textarea'" size="sm" variant="subtle"
                            placeholder="Remarks" :disabled="false" label="Remarks" v-model="item.remarks" />
                    </div>
                    <div>
                        <Button style="border: 1px solid red !important; color: red !important" class="mr-2"
                            v-if="index > 0" @click="remove_items_array(index)" :variant="'solid'" theme="red" size="sm"
                            label="Button" :loading="false" :loadingText="null" :disabled="false" :link="null">
                            Remove
                        </Button>
                        <Button @click="append_items_array()" :variant="'solid'" theme="gray" size="sm" label="Button"
                            :loading="false" :loadingText="null" :disabled="false" :link="null">
                            Add More
                        </Button>
                    </div>
                </div>
            </div>
        </div>


        <div>
            <div class="p-2 bg-gray-900 text-white w-full"><b>Company Info</b></div>

            <div class="border border-gray-400">
                <div class="flex">
                    <div class="p-2 w-full">
                        <label class="block text-xs text-gray-900 pb-1">Organization Name</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="Organization Name" :disabled="false" label="Organization Name"
                            v-model="company_info.organization_name" />
                    </div>
                    <div class="p-2">
                        <label class="block text-xs text-gray-900 pb-1">Full Name</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="Full Name" :disabled="false" label="Full Name"
                            v-model="company_info.full_name" />
                    </div>
                    <div class="p-2">
                        <label class="block text-xs text-gray-900 pb-1">Job Title</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle"
                            placeholder="Job Title" :disabled="false" label="Job Title"
                            v-model="company_info.job_title" />
                    </div>
                </div>
                <div class="flex">

                    <div class="p-2 ">
                        <label class="block text-xs text-gray-900 pb-1">Mobile No</label>
                        <TextInput class="border-gray-800" :type="'phone'" size="sm" variant="subtle"
                            placeholder="Mobile No" :disabled="false" label="Mobile No"
                            v-model="company_info.mobile_no" />
                    </div>
                    <div class="p-2 ">
                        <label class="block text-xs text-gray-900 pb-1">Whatsapp No</label>
                        <TextInput class="border-gray-800" :type="'phone'" size="sm" variant="subtle"
                            placeholder="Whatsapp No" :disabled="false" label="Whatsapp No"
                            v-model="company_info.whatsapp_no" />
                    </div>
                    <div class="p-2">
                        <label class="block text-xs text-gray-900 pb-1">Email</label>
                        <TextInput class="border-gray-800" :type="'email'" size="sm" variant="subtle"
                            placeholder="Email" :disabled="false" label="Email" v-model="company_info.email" />
                    </div>
                </div>
                <div class="flex">
                    <div class="p-2">
                        <label class="block text-xs text-gray-900 pb-1">City</label>
                        <TextInput class="border-gray-800" :type="'text'" size="sm" variant="subtle" placeholder="City"
                            :disabled="false" label="City" v-model="company_info.city" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Part -->
        <div class="flex p-2 fixed bottom-0 left-0 right-0 border-t border-t-gray-600 justify-center bg-white">
            <div class="mr-10">
                <Button :variant="'subtle'" theme="gray" size="sm" label="Button" :loading="false" :loadingText="null"
                    :disabled="false" :link="null" @click="reset_form()">
                    Reset
                </Button>
            </div>
            <div>
                <Button :variant="'solid'" theme="gray" size="sm" label="Button" :loading="enquiry.loading" loadingText="Creating Enquiry"
                    :disabled="false" :link="null" @click="enquiry.fetch()">
                    Submit
                </Button>
            </div>
        </div>
    </div>
    <div>
        <!-- <Button @click="get_enquiry('1cb9e438f8')">get_enquiry</Button> -->
        <pre>{{shipment}}</pre>
        <pre>{{line_items}}</pre>
        &nbsp;
        <br><br><br>
    </div>
</template>

<script setup>
import { ref, computed, toRaw, watch } from 'vue'
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
    createDocumentResource,
    FileUploader,
    FileUploadHandler
} from 'frappe-ui'

import { useVuelidate } from '@vuelidate/core'
import { required, email, numeric } from '@vuelidate/validators'

import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
// const v$ = useVuelidate();

const cargo_type_list = ref([{ "value": "General", "label": "General" }, { "value": "DG", "label": "DG" }, { "value": "Reefer", "label": "Reefer" }])
const deliery_type_list = ref([{ "value": "Cargo Delivery", "label": "Cargo Delivery" }, { "value": "Container Delivery", "label": "Container Delivery" }])

const shipment = ref(
    {
        service_request: {value: "", name: ""},
        "nature_of_shipment": {"value": "", "name": ""},
        "mode_of_transport": {"value": "", "name": ""},
        "place_of_receipt": "",
        "incoterm": {"value": "", "name": ""},
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
        "pickup_airport": {"value": "", "name": ""},
        "pickup_cfs": {"value": "", "name": ""},
        "delivery_airport": {"value": "", "name": ""},
        "delivery_cfs": {"value": "", "name": ""},
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

const shipment_rules= computed(() => {
    return {
        "nature_of_shipment": {required},
        "mode_of_transport": {required},
        "place_of_receipt": {required},
        "incoterm": {required},
        "shipper_location": {required},
        "consignee_location": {required},
        "pickup_location": {required},
        "delivery_location": {required},
        "invoice_value": {required},
        "hs_code": {required}
    }
})

const v$ = useVuelidate(shipment_rules, shipment)

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

watch(() => route.params.id, get_enquiry, { immediate: true })

function get_enquiry(id) {
    // console.log('route ', id)
    if (id) {
        let enquiry = createResource({
            url: 'logistics.logistcs.api.get_enquiry',
            params: {
                "id": id
            },
            onSuccess(data) {
                shipment.value.service_request = {"value": data.service_code, "label": data.service_request}
                shipment.value.nature_of_shipment = {"value": data.nature_of_shipment, "label": data.nature_of_shipment}
                
                shipment.value.mode_of_transport = {"value": data.mode_of_transport, "label": data.mode_of_transport}
                
                shipment.value.place_of_receipt = data.place_of_receipt
                
                shipment.value.incoterm = {"value": data.incoterm, "label": data.incoterm}

                shipment.value.ports.splice(0, 1)
                for(let p of data.ports){
                    shipment.value.ports.push(
                        {
                            "port_of_loading":
                            {
                                "value": p.port_of_loading,
                                "label": p.port_of_loading
                            },
                            "port_of_discharge":
                            {
                                "value": p.port_of_discharge,
                                "label": p.port_of_discharge
                            }
                        }
                    )
                }

                shipment.value.airports.splice(0, 1)
                for(let p of data.airports){
                    shipment.value.airports.push(
                        {
                            "port_of_loading":
                            {
                                "value": p.airport_of_loading,
                                "label": p.airport_of_loading
                            },
                            "port_of_discharge":
                            {
                                "value": p.airport_of_discharge,
                                "label": p.airport_of_discharge
                            }
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
                    console.log('eeeeee', i)
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
                        "packing_type": {"label": i.packing_type, "value": i.packing_type}
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
    console.log(index, dg_index)
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
    this.line_items.forEach((item, index) => {
        console.log('item', item)
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

        if (data.message.status == false) {
            
        } else {

            router.push('/')
        }
    }

})
        // enquiry.fetch()


// async function submit_enquiry() {
//     try {

//         let enquiry = createResource({
//             url: 'logistics.logistcs.api.submit_enquiry',
//             params: raw 
//         })
//         enquiry.fetch()

//         // fetch("http://localhost:8001/api/method/logistics.logistcs.api.submit_enquiry", requestOptions)
//         //     .then((response) => {
//         //         console.log('response', response)
//         //         response.text()
//         //     })
//         //     .then((result) => console.log('result', result))
//         //     .catch((error) => console.error('error', error));
//     } catch (e) {
//         console.log(e)
//     }
// }
    // url: 'logistics.logistcs.api.submit_enquiry',
    // method: 'POST',
    // params: {
    //     shipment: shipment,
    //     line_items: line_items,
    //     company_info: company_info
    // }
// })

// let enquiry = createDocumentResource({
//     'doctype': 'Enquiry',
//     'nature_of_shipment': shipment.nature_of_shipment,
//     'mode_of_transport': shipment.mode_of_transport
// })

function get_carrier_caption(mode_of_transport) {
    console.log(mode_of_transport)
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