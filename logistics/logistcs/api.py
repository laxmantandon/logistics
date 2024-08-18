import frappe, json

@frappe.whitelist(allow_guest=True)
def get_masters_data():
    incoterms = frappe.db.sql("""
        SELECT name as value, CONCAT(name, '-', title) as label from tabIncoterm
    """, as_dict=True)

    airports = frappe.db.sql("""
        SELECT name as value, name as label from `tabAOL and AOD` 
    """, as_dict=True)

    domestic_airports = frappe.db.sql("""
        SELECT name as value, name as label from `tabAOL and AOD` WHERE is_domestic = 1 
    """, as_dict=True)

    ports = frappe.db.sql("""
        SELECT name as value, name as label from `tabPOL and POD` 
    """, as_dict=True)

    packing_types = frappe.db.sql("""
        SELECT name as value, name as label from `tabPacking Type`
    """, as_dict=True)
    
    container_types = frappe.db.sql("""
        SELECT name as value, name as label from `tabContainer Type`
    """, as_dict=True)

    service_requests = frappe.db.sql("""
        SELECT service_code as value, name as label from `tabService Request`
    """, as_dict=True)
    
    types_of_clearance = frappe.db.sql("""
        SELECT name as value, name as label from `tabType of Clearance`
    """, as_dict=True)

    container_freight_stations = frappe.db.sql("""
        SELECT name as value, name as label from `tabContainer Freight Station` 
    """, as_dict=True)

    currencies = frappe.db.sql("""
        SELECT name as value, name as label from `tabCurrency` WHERE enabled = 1
    """, as_dict=True)

    return {
        "incoterms": incoterms,
        "airports":airports,
        "ports":ports,
        "packing_types": packing_types,
        "container_types": container_types,
        "nature_of_shipments": [
            {"label": "Import", "value": "Import"},
            {"label": "Export", "value": "Export"}
        ],
        "mode_of_transports": [
            {"label": "Air", "value": "Air"},
            {"label": "Sea FCL", "value": "Sea FCL"},
            {"label": "Sea LCL", "value": "Sea LCL"}
        ],
        "shipper_categories": [
            {"label": "Manufacturer", "value": "Manufacturer"},
            {"label": "Trader", "value": "Trader"},
            {"label": "Merchandiser", "value": "Merchandiser"}
        ],
        "service_requests": service_requests,
        "types_of_clearance": types_of_clearance,
        "domestic_airports": domestic_airports,
        "container_freight_stations": container_freight_stations,
        "currencies": currencies
    }

@frappe.whitelist()
def get_port_of_loading(port):
   ports = frappe.db.sql(f"""
        SELECT name as value, name as label from `tabPOL and POD` WHERE name like '%{port}%' LIMIT 10
    """, as_dict=True)


@frappe.whitelist()
def get_enquiry_list():

    enquiries = frappe.db.sql("""
    SELECT
        name, service_request, nature_of_shipment, mode_of_transport, posting_date, posting_time
    FROM tabEnquiry WHERE owner = %s
    ORDER BY posting_date desc, posting_time desc
    """, (frappe.session.user), as_dict=True)

    headers = [
        { "title": "Ref #", "value": "name" },
        { "title": "Service Request", "value": "service_request" },
        { "title": "Nature of Shipment", "value": "nature_of_shipment" },
        { "title": "Mode of Transport", "value": "mode_of_transport" },
        { "title": "Date", "value": "posting_date" },
        { "title": "Time", "value": "posting_time" },
        { "title": "Actions", "value": "actions" }
    ]

    return {
        "headers": headers,
        "items": enquiries
    }


@frappe.whitelist()
def submit_enquiry():

    req = frappe.request.json
    # return req

    # # for r in req.get("shipment").get("airports"):
    enquiry = frappe.new_doc("Enquiry")

    enquiry.service_request = req.get("shipment").get("service_request")
    enquiry.nature_of_shipment = req.get("shipment").get("nature_of_shipment")
    enquiry.mode_of_transport = req.get("shipment").get("mode_of_transport")

    if enquiry.mode_of_transport == 'Sea FCL' or enquiry.mode_of_transport == 'Sea LCL':
        for s in req.get("shipment").get("ports"):
            enquiry.append("ports", {"port_of_loading": s.get("port_of_loading"), "port_of_discharge": s.get("port_of_discharge")})

    if enquiry.mode_of_transport == 'Air':
        for s in req.get("shipment").get("airports"):
            enquiry.append("airports", {"airport_of_loading": s.get("port_of_loading"), "airport_of_discharge": s.get("port_of_discharge")})

    enquiry.place_of_receipt = req.get("shipment").get("place_of_receipt")

    enquiry.incoterm = req.get("shipment").get("incoterm")

    enquiry.shipper_location = req.get("shipment").get("shipper_location")
    
    enquiry.consignee_location = req.get("shipment").get("consignee_location")

    enquiry.pickup_location = req.get("shipment").get("pickup_location")

    enquiry.pickup_zipcode = req.get("shipment").get("pickup_zipcode")
    enquiry.pickup_address = req.get("shipment").get("pickup_address")
    enquiry.pickup_contact = req.get("shipment").get("pickup_contact")
    enquiry.pickup_airport = req.get("shipment").get("pickup_airport")
    enquiry.pickup_cfs = req.get("shipment").get("pickup_cfs")

    enquiry.delivery_airport = req.get("shipment").get("delivery_airport")
    enquiry.delivery_cfs = req.get("shipment").get("delivery_cfs")
    enquiry.delivery_location = req.get("shipment").get("delivery_location")
    enquiry.delivery_zipcode = req.get("shipment").get("delivery_zipcode")
    enquiry.delivery_address = req.get("shipment").get("delivery_address")
    enquiry.delivery_contact = req.get("shipment").get("delivery_contact")


    enquiry.invoice_value = req.get("shipment").get("invoice_value")
    enquiry.invoice_currency = req.get("shipment").get("invoice_currency")

    enquiry.hs_code = req.get("shipment").get("hs_code")

    enquiry.shipper_category = req.get("shipment").get("shipper_category") if req.get("shipment").get("shipper_category") else ""
    enquiry.ad_code = req.get("shipment").get("ad_code")
    enquiry.carrier_name = req.get("shipment").get("carrier_name")
    enquiry.delivery_type = req.get("shipment").get("delivery_type")
    enquiry.carrier_departure_date = req.get("shipment").get("carrier_departure_date")
    enquiry.carrier_arrival_date = req.get("shipment").get("carrier_arrival_date")
    enquiry.ad_code = req.get("shipment").get("ad_code")


    for i in req.get("line_items"):
        
        enquiry.append("items", {
            "commodity": i.get("commodity"),
            "cargo_type": i.get("cargo_type"),
            "cargo_dg_array": json.dumps(i.get("cargo_dg_array")),
            "no_of_packages": i.get("no_of_packages"),
            "gross_weight": i.get("gross_weight"),
            "net_weight": i.get("net_weight"),
            "no_of_containers": i.get("no_of_containers"),
            "dimensions_in": i.get("dimensions_in"),
            "length": i.get("length"),
            "breadth": i.get("breadth"),
            "height": i.get("height"),
            "volume": i.get("volume"),
            "remarks": i.get("remarks"),
            "packing_type": i.get("packing_type"),
            "coolant_type": i.get("coolant_type")
            }
        )

    enquiry.organization_name = req.get("company_info").get("organization_name")
    enquiry.contact_name = req.get("company_info").get("contact_name")
    enquiry.full_name = req.get("company_info").get("full_name")
    enquiry.mobile_no = req.get("company_info").get("mobile_no")
    enquiry.email = req.get("company_info").get("email")
    enquiry.whatsapp_no = req.get("company_info").get("whatsapp_no")
    enquiry.city = req.get("company_info").get("city")
    enquiry.job_title = req.get("company_info").get("job_title")

    try:
        enquiry.flags.ignore_permissions = True
        enquiry.save()
        return {
            "status": True,
            "message": enquiry.name,
            }
    except Exception as e:
        return {
            "status": False,
            "message": str(e),
            }
        
@frappe.whitelist()
def get_enquiry(id):
    if frappe.db.exists("Enquiry", id):
        return frappe.get_doc("Enquiry", id)
    else:
        return {
            "status": False,
            "message": "Invalid Enquiry"
        }

@frappe.whitelist(allow_guest=True)
def signup(email, full_name, new_password):
    frappe.utils.validate_email_address(email, True)

    current_user = frappe.session.user
    frappe.set_user("Administrator")

    email = email.strip().lower()

    if not frappe.db.exists("User", email):
        user = frappe.get_doc(
            {
                "doctype": "User",
                "email": email,
                "first_name": full_name,
                "new_password": new_password,
                "send_welcome_email": "0"
            }
        ).insert()

        frappe.set_user(current_user)
        return {
            "status": True,
            "message": "User Created"
        }
    else:
        frappe.set_user(current_user)
        frappe.throw("User already exists, please try loggin in using this email")

