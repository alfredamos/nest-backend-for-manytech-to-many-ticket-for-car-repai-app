class CustomerCreateModel {
    address: string = "";
    active: boolean = true;
    notes: string = "";
    userId: string = "";
}

export const emptyCustomerCreate: CustomerCreateModel = {
    ...new CustomerCreateModel(),
};