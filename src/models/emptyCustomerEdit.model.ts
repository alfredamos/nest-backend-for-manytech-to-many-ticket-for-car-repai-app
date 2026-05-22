class CustomerEditModel {
    id: string = "";
    address: string = "";
    active: boolean = true;
    notes: string = "";
    userId: string = "";
}

export const emptyCustomerEdit: CustomerEditModel = {
    ...new CustomerEditModel(),
};