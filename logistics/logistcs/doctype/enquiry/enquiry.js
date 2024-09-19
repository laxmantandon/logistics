// Copyright (c) 2024, Eactive Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Enquiry', {
	refresh: function(frm) {
		if (frm.doc.docstatus == 1) {
			frm.add_custom_button('Costing', function() {
				
				let costing = frappe.model.get_new_doc('Costing');
					
				costing.enquiry = frm.doc.name
				costing.posting_date = frappe.datetime.get_today()
				costing.naming_series = 'C-2425-.####'
			 										
				frappe.set_route('form', 'Costing', costing.name);
			}, "Create");
		}

	}
});
