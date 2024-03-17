import axios from "axios";
import Configurations from "../../Configurations";
import resolve from "../../common/resolve";

export async function getFirmStructureDetails() {
    return await resolve(axios.get(`${Configurations.apiBaseUri}/v1/MasterData/GetListItemsByType?listType=FirmStructure`)
        .then(res => res.data));
}

export async function getRegulatoryComplianceDetails() {
    return await resolve(axios.get(`${Configurations.apiBaseUri}/v1/MasterData/GetListItemsByType?listType=RegulatoryComplianceStatus`)
        .then(res => res.data));
}

export async function getFirmTypeDetails() {
    return await resolve(axios.get(`${Configurations.apiBaseUri}/v1/MasterData/GetListItemsByType?listType=FirmType`)
        .then(res => res.data));
}

export function postTenantUser(data) {
    try {
        const response = axios.post(`${Configurations.apiBaseUri}/v1/Tenant/CreateTenantDetails`, data);
        return response;
    }
    catch (error) {
        console.error('Error Creating Banking Information:', error);
        throw error;
    }
}