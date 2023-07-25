/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import React, { useState, useEffect } from "react";

import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";

import { Navbar, Button, Dropdown, DropdownButton } from "react-bootstrap";

import { loginRequest, b2cPolicies, deployment } from "./authConfig";
import './ui.css';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ActionButton from '@mui/material/Button';
import { grey } from '@mui/material/colors';
import Spinner from './spinner';


const NavigationBar = () => {

    /**
     * useMsal is hook that returns the PublicClientApplication instance, 
     * an array of all accounts currently signed in and an inProgress value 
     * that tells you what msal is currently doing. For more, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
     */
    const { instance, accounts } = useMsal();
    const [showUserInfo, setInfoRender] = useState(false);
    const [showLoader, setLoader] = useState(true);

    const handleUserInfoRender = () =>{
        setInfoRender(!showUserInfo);
    }

    const handleSignout = () =>{
        setLoader(true);
        instance.logoutRedirect({ postLogoutRedirectUri: "/" })
    }

    useEffect(()=>{
        if(accounts && accounts.length && accounts[0].idTokenClaims){
            setLoader(false);
        } else{
            setLoader(true);
        }
    }, [accounts[0]])

    return (
        <>
            <AuthenticatedTemplate>
            {showLoader && <div className="spinnerWrapper"><Spinner/></div>}
                <div className="navbarBrandHeaderWrapper">
                    <div className="navbarBrandHeader">
                        <img  alt="" src="/group-330.svg" />
                        <div className="headerBrandName">Alternative Investment Platform</div>
                    </div>
                    <div onClick={handleUserInfoRender} className="userInfoWrapper">
                        <div className="iconWrapper"><AccountCircleOutlinedIcon fontSize="large" sx={{color: grey[500]}}/></div>
                        <div className="iconWrapper"><KeyboardArrowDownOutlinedIcon fontSize="small" sx={{color: grey[500]}} /></div>
                    </div>
                    { showUserInfo && <div className="infoCont">
                        {accounts && accounts.length && accounts[0].name && <div>{accounts[0].name}</div>}
                        <div className="signedInEmail">{accounts && accounts.length && accounts[0].idTokenClaims.signInName}</div>
                        <hr/>
                        <div>
                            <ActionButton 
                                startIcon={<ManageAccountsOutlinedIcon/>}
                                sx={{color: grey[600], fontSize: '12px', fontWeight: '600'}}>MANAGE ACCOUNT</ActionButton></div>
                        <div>
                            <ActionButton 
                                onClick={() => handleSignout()}
                                startIcon={<LogoutOutlinedIcon />}
                                sx={{color: grey[600], fontSize: '12px', fontWeight: '600'}}>LOG OUT</ActionButton></div>
                    </div>}
                </div>
                {/* <div className="ml-auto dropdownposition">
                    <div>Please select a tenant below</div>
                    <SwitchTenant/>
                </div>                  
                <div className="ml-auto">
                    <Button variant="warning" className="ml-auto" onClick={() => instance.logoutRedirect({ postLogoutRedirectUri: "/" })}>Sign out</Button>                       */}
                    {/*<DropdownButton variant="warning" className="ml-auto" drop="left" title="Sign Out">
                        <Dropdown.Item as="button" onClick={() => instance.logoutPopup({ postLogoutRedirectUri: "/", mainWindowRedirectUri: "/" })}>Sign out using Popup</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => instance.logoutRedirect({ postLogoutRedirectUri: "/" })}>Sign out using Redirect</Dropdown.Item>
                    </DropdownButton>*/}
                {/* </div> */}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <div className="ml-auto">
                    <Button variant="warning" className="ml-auto" drop="left" onClick={() => 
                        instance.loginRedirect({ 
                            authority:b2cPolicies.authorities.newTenant.authority,
                            scopes: loginRequest.scopes                           
                        }).catch((error) => console.log(error))
                    }>Create new tenant</Button>
                </div>   
                <div className="ml-auto">                         
                    <Button variant="warning" className="ml-auto" onClick={() => 
                        instance.loginRedirect({
                            scopes: loginRequest.scopes
                            }).catch((error) => console.log(error))
                        }>Sign in</Button>  
                </div>   
                {/*              
                <DropdownButton variant="secondary" className="ml-auto" drop="left" title="Sign In">
                    <Dropdown.Item as="button" onClick={() => instance.loginPopup(loginRequest)}>Sign in using Popup</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={() => instance.loginRedirect(loginRequest)}>Sign in using Redirect</Dropdown.Item>
                </DropdownButton>
                */}
            </UnauthenticatedTemplate>
        </>
    );
};

export const PageLayout = (props) => {
    return (
        <>
        <AuthenticatedTemplate>
            <Navbar bg="light" variant="light">
                <NavigationBar />
            </Navbar>
            <div className="usermManagementContent">
                <h4 className="managementTitle"><center>AIP Tenant Management</center></h4>
                {props.children}
            </div>
            </AuthenticatedTemplate>
            {/*<AuthenticatedTemplate>
                <footer>
                    <center> 
                        <a href="https://github.com/mrochon/b2csamples/tree/master/Policies/MultiTenant" target="_blank"> Source</a>
                    </center>
                </footer> 
            </AuthenticatedTemplate>*/}
            <UnauthenticatedTemplate>
            <Navbar bg="primary" variant="dark">
                <a className="navbar-brand" href="/">AIP Tenant Management</a>
                <NavigationBar />
            </Navbar>
            <br />
            <h5><center>Welcome to the AIP Tenant Management</center></h5>
            <br />
            <br />
            <br />
            {props.children}
            <br />
            </UnauthenticatedTemplate>
        </>
    );
};

export const SwitchTenant = () => {
    const { accounts, instance } = useMsal();  

    const listTenants = accounts[0].idTokenClaims.allTenants.filter(currTenant).map((tenant, ix) =>
        <Dropdown.Item as="button" key={ix} onClick={() => 
                instance.loginRedirect({ 
                    authority:b2cPolicies.authorities.signIn.authority,
                    scopes: ["openid", "profile", `https://${deployment.b2cTenantName}.onmicrosoft.com/mtrest/User.Invite`, `https://${deployment.b2cTenantName}.onmicrosoft.com/mtrest/User.ReadAll`],                    
                    account: accounts[0],
                    extraQueryParameters: { tenant: tenant }
                })
            }>{tenant}</Dropdown.Item>
    );
    function currTenant(tenant) {
        return (tenant != accounts[0].idTokenClaims.appTenantName.toUpperCase());
    }
    if(accounts[0].idTokenClaims.allTenants.length > 1) {
        var title = `${accounts[0].idTokenClaims.appTenantName}`
        return (
                <DropdownButton variant="warning"  className="ml-auto" 
                drop="right" title={title}>{listTenants}</DropdownButton>
    )} else return null;
};




