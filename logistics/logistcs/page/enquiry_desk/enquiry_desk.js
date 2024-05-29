frappe.pages["enquiry-desk"].on_page_load = function (wrapper) {
	frappe.ui.make_app_page({
		parent: wrapper,
		title: __("Enquiry"),
		single_column: true,
		card_layout: true
	});

	frappe.enquiry = new EnquiryDesk(wrapper)
	$(wrapper).bind("show", function () {
		frappe.enquiry.show();
	});

	frappe.require("enquiry_desk.bundle.js")

};


class EnquiryDesk {
	constructor(wrapper) {
		this.wrapper = $(wrapper);
		this.container = this.wrapper.find(".layout-main-section");
		this.container.append($('<div class="enquiry-desk-container"></div>'));
	}

	show() {
		if (!this.view || this.view.$route.name == "enquiry_list") return;
		this.view.$router.replace({ name: "enquiry_list" });
	}
		
};
