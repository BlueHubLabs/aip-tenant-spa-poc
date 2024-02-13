/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";

export const deployment = {
    policyPrefix : "V1_",
    b2cTenantName: "aipb2cpoc",
    b2cTenantId: "31e8eecd-9d43-42ef-bdfa-7d40335bdd0e",
    b2cClientId: "0c115d70-7814-4edf-ada2-09c233d30169", // bluemoss 46c6b5f3-bfc0-4ef3-ac5b-198d0b383a42
    restUrl: "https://aip-tenant-api-poc.azurewebsites.net/",
     aipUrl: "https://aipbackend.azurewebsites.net"
    //aipUrl: "https://aipdemoapi.azurewebsites.net"
    // aipUrl:"https://localhost:8080"
}

export const policyNames = {
        signIn: `b2c_1a_${deployment.policyPrefix}signIn`,
        newTenant: `b2c_1a_${deployment.policyPrefix}newTenant`        
}
/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
    authorities: {
        signIn: {
            authority: `https://${deployment.b2cTenantName}.b2clogin.com/${deployment.b2cTenantId}/${policyNames.signIn}`,
        },
        newTenant: {
            authority: `https://${deployment.b2cTenantName}.b2clogin.com/${deployment.b2cTenantId}/${policyNames.newTenant}`,
        }        
    },
    authorityDomain: `${deployment.b2cTenantName}.b2clogin.com`
}

/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
export const msalConfig = {
    auth: {
        clientId: deployment.b2cClientId, // This is the ONLY mandatory field that you need to supply.
        authority: b2cPolicies.authorities.signIn.authority, // Use a sign-up/sign-in user-flow as a default authority
        knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
        redirectUri: "/", // Points to window.location.origin. You must register this URI on Azure Portal/App Registration.
        postLogoutRedirectUri: "/", // Indicates the page to navigate after logout.
        navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
    },
    cache: {
        cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {	
        loggerOptions: {	
            loggerCallback: (level, message, containsPii) => {	
                if (containsPii) {		
                    return;		
                }		
                switch (level) {		
                    case LogLevel.Error:		
                        console.error(message);		
                        return;		
                    case LogLevel.Info:		
                        console.info(message);		
                        return;		
                    case LogLevel.Verbose:		
                        console.debug(message);		
                        return;		
                    case LogLevel.Warning:		
                        console.warn(message);		
                        return;		
                }	
            }	
        }	
    }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: ["openid", "profile", "https://aipb2cpoc.onmicrosoft.com/mtrest/User.Invite", "https://aipb2cpoc.onmicrosoft.com/mtrest/User.ReadAll"]
};

/**
 * An optional silentRequest object can be used to achieve silent SSO
 * between applications by providing a "login_hint" property.
 */
export const silentRequest = {
  scopes: ["openid", "profile", "https://aipb2cpoc.onmicrosoft.com/mtrest/User.Invite", "https://aipb2cpoc.onmicrosoft.com/mtrest/User.ReadAll"]
};
