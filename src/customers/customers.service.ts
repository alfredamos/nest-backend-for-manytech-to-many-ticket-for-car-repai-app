import {Injectable, NotFoundException} from '@nestjs/common';
import {CustomerUncheckedCreateInput, CustomerUpdateInput} from "../generated/prisma/models/Customer";
import {PrismaService} from "../prisma/prisma.service";
import {toCustomerResponse} from "../models/customerResp.model";
import {CustomerWithUser} from "../models/customerWithUser.model";

@Injectable()
export class CustomersService {
    constructor(private readonly prisma: PrismaService) {}

    async changeCustomerStatus(id: string){
        //----> Fetch the customer with the giving id.
        const customer = await this.getOneCustomer(id);

        //----> Change customer status.
        const active = !customer.active;

        //----> Update the customer status.
        const updatedCustomer = await this.prisma.customer.update({where: {id}, data: {active}, include: {user: true}});

        //----> Send back response.
        return toCustomerResponse(updatedCustomer as CustomerWithUser);
    }

    async createCustomer(customer: CustomerUncheckedCreateInput) {
        //----> Insert the new customer into the database.
        const newCustomer = await this.prisma.customer.create({data: customer, include: {user: true}});

        //----> Send back response.
        return toCustomerResponse(newCustomer as CustomerWithUser);
    }

    async deleteCustomerById(id: string) {
        //----> Check for existence of customer.
        await this.getOneCustomer(id);

        //----> Delete the customer.
        const deletedCustomer = await this.prisma.customer.delete({where: {id}, include: {user: true}});

        //----> Send back response.
        return toCustomerResponse(deletedCustomer as CustomerWithUser);
    }

    async editCustomerById(id: string, customerToEdit: CustomerUpdateInput) {
        //----> Check for existence of customer.
        await this.getOneCustomer(id);

        //----> Edit the customer.
        const editedCustomer = await this.prisma.customer.update({where: {id}, data: customerToEdit, include: {user: true}});

        //----> Send back response.
        return toCustomerResponse(editedCustomer as CustomerWithUser);
    }

    async getCustomerById(id: string) {
        //----> Fetch the customer with the giving id.
        const customer = await this.getOneCustomer(id);

        //----> Send back response.
        return toCustomerResponse(customer as CustomerWithUser);
    }

    async getActiveCustomers() {
        //----> Fetch all active customers.
        const customers = await this.prisma.customer.findMany({where: {active: true}, include: {user: true}});

        //----> Send back response.
        return customers?.map(customer => toCustomerResponse(customer as CustomerWithUser));
    }

    async getAllCustomers() {
        //----> Fetch all customers.
        const customers = await this.prisma.customer.findMany({include: {user: true}});

        //----> Send back response.
        return customers?.map(customer => toCustomerResponse(customer as CustomerWithUser));
    }

    async getCustomersByUserId(userId: string) {
        //----> Fetch the customer with the giving user-id.
        const customer = await this.prisma.customer.findUnique({where: {userId}, include: {user: true}});

        //----> Check for null customer.
        if (!customer){
            throw new NotFoundException("Customer not found in db!");
        }

        //----> Send back response.
        return toCustomerResponse(customer as CustomerWithUser);
    }

    async getInactiveCustomers() {
        //----> Fetch all inactive customers.
        const customers = await this.prisma.customer.findMany({where: {active: false}, include: {user: true}});
    }

    private async getOneCustomer(id: string) {
        //----> Get the customer by id
        const customer = await this.prisma.customer.findUnique({where: {id}, include: {user: true}});

        //----> Check for null customer.
        if (!customer) {
            throw new NotFoundException("Customer not found in db!");
        }

        //----> Return the customer.
        return customer;
    }

}
