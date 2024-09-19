frappe.ui.form.on('Quotation', {
	quotation_to(frm) {
        if (frm.doc.custom_against_costing) {

            frappe.db.get_value("Costing", frm.doc.custom_against_costing, "organization_name").then(resp => {
                cur_frm.set_value("party_name", resp.message.organization_name)
            })
        }
	}
})