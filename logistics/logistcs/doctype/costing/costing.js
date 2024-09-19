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

	}
});

frappe.ui.form.on('Costing Item', {
	// refresh: function(frm) {

	// }

	quantity(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn)
		frappe.model.set_value(row.doctype, row.name, "amount", row.quantity * row.rate)
		
		if (row.margin_type == "Flat") {
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + row.margin_rate)
		} else {
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + ((row.rate * row.margin_rate) / 100) )
		}
		frappe.model.set_value(row.doctype, row.name, "selling_amount", row.selling_rate * row.quantity)
	},
	
	rate(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn)
		
		frappe.model.set_value(row.doctype, row.name, "amount", row.quantity * row.rate)

		if (row.margin_type == "Flat") {
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + row.margin_rate)
		} else {			
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + ((row.rate * row.margin_rate) / 100) )
		}
		frappe.model.set_value(row.doctype, row.name, "selling_amount", row.selling_rate * row.quantity)
	},

	margin_type(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn)
		if (row.margin_type == "Flat") {
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + row.margin_rate)
		} else {			
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + ((row.rate * row.margin_rate) / 100) )
		}
		frappe.model.set_value(row.doctype, row.name, "selling_amount", row.selling_rate * row.quantity)
	},
	
	margin_rate(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn)
		if (row.margin_type == "Flat") {
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + row.margin_rate)
		} else {			
			frappe.model.set_value(row.doctype, row.name, "selling_rate", row.rate + ((row.rate * row.margin_rate) / 100) )
		}
		frappe.model.set_value(row.doctype, row.name, "selling_amount", row.selling_rate * row.quantity)
	}
});
