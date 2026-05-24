import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {
    TechnicianUncheckedCreateInput,
    TechnicianUncheckedUpdateInput,
    TechnicianUpdateInput
} from "../generated/prisma/models/Technician";
import {toTechnicianResponse} from "../models/technicianResp.model";

@Injectable()
export class TechniciansService {
    constructor(private readonly prisma: PrismaService) {}

    async createTech(tech: TechnicianUncheckedCreateInput){
       //----> Insert the new technician into the database.
       const newTech = await this.prisma.technician.create({data: tech, include: {user: true}});

       //----> Send back response.
       return toTechnicianResponse(newTech);
    }

    async deleteTechById(id: string){
        //----> Check for existence of technician.
        await this.getOneTech(id);

        //----> Delete the technician.
        const deletedTech = await this.prisma.technician.delete({where: {id}, include: {user: true}});

        //----> Send back response.
        return toTechnicianResponse(deletedTech);
    }

    async editTechById(id: string, tech: TechnicianUncheckedUpdateInput){
        //----> Check for existence of technician.
        await this.getOneTech(id);

        //----> Edit the technician.
        const editedTech = await this.prisma.technician.update({where: {id}, data: tech, include: {user: true}});

        //----> Send back response.
        return toTechnicianResponse(editedTech);
    }

    async getTechId(id: string){
        //----> Fetch the technician with the giving id.
        const technician = await this.getOneTech(id);

        //----> Send back response.
        return toTechnicianResponse(technician);
    }

    async getAllTechs(){
        //----> Fetch all technicians.
        const technicians = await this.prisma.technician.findMany({include: {user: true}});

        //----> Send back response.
        return technicians?.map(tech => toTechnicianResponse(tech));
    }

    async getTechByUserId(userId: string){
        //----> Fetch tech with the giving user-id.
        const technician = await this.prisma.technician.findUnique({where: {userId}, include: {user: true}});

        //----> Check for null technician.
        if (!technician){
            throw new NotFoundException("Technician not found in db!");
        }

        //----> Send back response.
        return toTechnicianResponse(technician);
    }

    async getTechsBySpecialty(specialty: string){
        //----> Fetch tech with the giving specialty.
        const technicians = await this.prisma.technician.findMany({where: {specialty}, include: {user: true}});

        //----> Send back response.
        return technicians?.map(tech => toTechnicianResponse(tech));
    }

    private async getOneTech(id: string){
        //----> Fetch the technician with the giving id.
        const technician = await this.prisma.technician.findUnique({where: {id}, include: {user: true}});

        //----> Check for null technician.
        if (!technician) {
            throw new NotFoundException("Technician not found in db!");
        }

        //----> Send back response.
        return technician;
    }
}
