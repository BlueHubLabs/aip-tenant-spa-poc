import global from './variables';

export default class Configurations{
    static get apiBaseUri(){
        return global.window.variables.apiBaseUri;
    }
    static get apiBaseFrontEndUri(){
        return window.location.origin;
    }
    static get getTenantID(){
        return global.window.variables.tenantID;
    }
    static get getImageLocation(){
        return global.window.variables.imagePath;
    }
}