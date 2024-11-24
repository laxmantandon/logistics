// Copyright (c) 2024, Eactive Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Costing', {

	refresh: function(frm) {

		frm.add_custom_button("Customer", function() {
			frappe.call("create_customer_from_costing", {
				customer_name: frm.doc.organization_name
			}).then(resp => {
				if (!resp.exc) {
					frappe.msgprint(resp.message.description)
				}
			})
		}, "Create");

		frm.add_custom_button('Create Quotation', function() {
            
            let quotation = frappe.model.get_new_doc('Quotation');
            

            quotation.custom_against_costing = frm.doc.name
            quotation.custom_against_enquiry = frm.doc.enquiry
            quotation.naming_series = 'SAL-QTN-.YYYY.-'
            quotation.transaction_date = frappe.datetime.get_today()
			quotation.order_type = 'Sales'
			quotation.quotation_to = 'Customer'
            quotation.party_name = frm.doc.organization_name
         
            //Now we are fetching values from child tables and appending it :
            
            frm.doc.items.forEach(function(d) {
                let child = frappe.model.add_child(quotation, "Quotation Item" ,"items");
                child.item_code = d.item;
                child.qty = d.quantity;
                child.rate = d.selling_rate;
            });
                        
            frappe.set_route('form', 'Quotation', quotation.name);
        }, "Create");

	},

	enquiry: function(frm) {
		frappe.db.get_doc("Enquiry", frm.doc.enquiry).then(d => {

			frm.clear_table("airports");
			frm.clear_table("ports");

			if (d.mode_of_transport === 'Air') {

				d.airports.forEach(r => {
					var row = cur_frm.fields_dict.airports.grid.add_new_row();
					frappe.model.set_value(row.doctype, row.name, "airport_of_loading", r.airport_of_loading);
					frappe.model.set_value(row.doctype, row.name, "airport_of_discharge", r.airport_of_discharge);
				});
				cur_frm.set_df_property("airports", "read_only", 1)
			}

			if (d.mode_of_transport !== 'Air') {
				
				d.ports.forEach(r => {
					console.log(r)
					var row = cur_frm.fields_dict.ports.grid.add_new_row();
					frappe.model.set_value(row.doctype, row.name, "port_of_loading", r.port_of_loading);
					frappe.model.set_value(row.doctype, row.name, "port_of_discharge", r.port_of_discharge);
				});
				cur_frm.set_df_property("ports", "read_only", 1)
			}
		});
		
	}
});

frappe.ui.form.on('Costing Item', {
	// refresh: function(frm) {

	// }


	exchange_rate(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn)
		frappe.model.set_value(row.doctype, row.name, "base_rate", row.rate * row.exchange_rate)

		frappe.model.set_value(row.doctype, row.name, "base_amount", row.quantity * row.rate * row.exchange_rate)
		frappe.model.set_value(row.doctype, row.name, "amount", row.quantity * row.rate)
		
		if (row.margin_type == "Flat") {
			frappe.model.set_value(row.doctype, row.name, "base_selling_rate", (row.rate + row.margin_rate) * row.exchange_rate)
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + row.margin_rate)
		} else {
			frappe.model.set_value(row.doctype, row.name, "base_selling_rate", (row.rate + ((row.rate * row.margin_rate) / 100)) * row.exchange_rate )
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + ((row.rate * row.margin_rate) / 100) )
		}
		frappe.model.set_value(row.doctype, row.name, "base_selling_amount", (row.selling_rate * row.quantity) * row.exchange_rate)
		frappe.model.set_value(row.doctype, row.name, "selling_amount", row.selling_rate * row.quantity)
	},

	currency(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn)

		frappe.model.set_value(row.doctype, row.name, "base_rate", row.rate * row.exchange_rate)

		frappe.model.set_value(row.doctype, row.name, "base_amount", row.quantity * row.rate * row.exchange_rate)
		frappe.model.set_value(row.doctype, row.name, "amount", row.quantity * row.rate)
		
		if (row.margin_type == "Flat") {
			frappe.model.set_value(row.doctype, row.name, "base_selling_rate", (row.rate + row.margin_rate) * row.exchange_rate)
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + row.margin_rate)
		} else {
			frappe.model.set_value(row.doctype, row.name, "base_selling_rate", (row.rate + ((row.rate * row.margin_rate) / 100)) * row.exchange_rate )
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + ((row.rate * row.margin_rate) / 100) )
		}
		frappe.model.set_value(row.doctype, row.name, "base_selling_amount", (row.selling_rate * row.quantity) * row.exchange_rate)
		frappe.model.set_value(row.doctype, row.name, "selling_amount", row.selling_rate * row.quantity)
	},

	quantity(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn)
		frappe.model.set_value(row.doctype, row.name, "base_rate", row.rate * row.exchange_rate)


		frappe.model.set_value(row.doctype, row.name, "base_amount", row.quantity * row.rate * row.exchange_rate)
		frappe.model.set_value(row.doctype, row.name, "amount", row.quantity * row.rate)
		
		if (row.margin_type == "Flat") {
			frappe.model.set_value(row.doctype, row.name, "base_selling_rate", (row.rate + row.margin_rate) * row.exchange_rate)
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + row.margin_rate)
		} else {
			frappe.model.set_value(row.doctype, row.name, "base_selling_rate", (row.rate + ((row.rate * row.margin_rate) / 100)) * row.exchange_rate )
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + ((row.rate * row.margin_rate) / 100) )
		}
		frappe.model.set_value(row.doctype, row.name, "base_selling_amount", (row.selling_rate * row.quantity) * row.exchange_rate)
		frappe.model.set_value(row.doctype, row.name, "selling_amount", row.selling_rate * row.quantity)
	},
	
	rate(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn)
		frappe.model.set_value(row.doctype, row.name, "base_rate", row.rate * row.exchange_rate)

		frappe.model.set_value(row.doctype, row.name, "base_amount", row.quantity * row.rate * row.exchange_rate)
		frappe.model.set_value(row.doctype, row.name, "amount", row.quantity * row.rate)

		if (row.margin_type == "Flat") {
			frappe.model.set_value(row.doctype, row.name, "base_selling_rate", (row.rate + row.margin_rate) * row.exchange_rate)
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + row.margin_rate)
		} else {			
			frappe.model.set_value(row.doctype, row.name, "base_selling_rate", (row.rate + ((row.rate * row.margin_rate) / 100)) * row.exchange_rate )
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + ((row.rate * row.margin_rate) / 100) )
		}
		frappe.model.set_value(row.doctype, row.name, "base_selling_amount", (row.selling_rate * row.quantity) * row.exchange_rate)
		frappe.model.set_value(row.doctype, row.name, "selling_amount", row.selling_rate * row.quantity)
	},

	margin_type(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn)
		if (row.margin_type == "Flat") {
			frappe.model.set_value(row.doctype, row.name, "base_selling_rate", (row.rate + row.margin_rate) * row.exchange_rate)
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + row.margin_rate)
		} else {			
			frappe.model.set_value(row.doctype, row.name, "base_selling_rate", (row.rate + ((row.rate * row.margin_rate) / 100)) * row.exchange_rate )
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + ((row.rate * row.margin_rate) / 100) )
		}
		frappe.model.set_value(row.doctype, row.name, "base_selling_amount", (row.selling_rate * row.quantity) * row.exchange_rate)
		frappe.model.set_value(row.doctype, row.name, "selling_amount", row.selling_rate * row.quantity)
	},
	
	margin_rate(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn)
		if (row.margin_type == "Flat") {
			frappe.model.set_value(row.doctype, row.name, "base_selling_rate", (row.rate + row.margin_rate) * row.exchange_rate)
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + row.margin_rate)
		} else {			
			frappe.model.set_value(row.doctype, row.name, "base_selling_rate", (row.rate + ((row.rate * row.margin_rate) / 100)) * row.exchange_rate )
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + ((row.rate * row.margin_rate) / 100) )
		}
		frappe.model.set_value(row.doctype, row.name, "base_selling_amount", (row.selling_rate * row.quantity) * row.exchange_rate)
		frappe.model.set_value(row.doctype, row.name, "selling_amount", row.selling_rate * row.quantity)
	}
});
