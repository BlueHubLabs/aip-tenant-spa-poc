/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import React, { useState } from "react";

import axios from 'axios';

import { useMsal } from "@azure/msal-react";

import { ButtonGroup, Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap";

import { b2cPolicies, deployment } from "./authConfig";
import { useEffect } from "react";
import ActionButton from '@mui/material/Button';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import './tenant.css';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Spinner from "./spinner";

const membersData = [
    {
        userName: 'User1',
        role: 'Fund Manager',
        invited: true
    },
    {
        userName: 'User2',
        role: 'Fund Manager',
        invited: true
    },
    {
        userName: 'User3',
        role: 'Fund Manager',
        invited: false
    },
    {
        userName: 'User4',
        role: 'Fund Manager',
        invited: true
    }
]

export const Tenant = () => {
    const { instance, accounts } = useMsal();
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        if(accounts && accounts.length && accounts[0].idTokenClaims){
            setLoading(false);
        } else{
            setLoading(true);
        }
    }, [accounts[0].idTokenClaims]);

    const handleSwitchTenant = (tenant) =>{
        setLoading(true);
        instance.loginRedirect({ 
            authority:b2cPolicies.authorities.signIn.authority,
            scopes: ["openid", "profile", `https://${deployment.b2cTenantName}.onmicrosoft.com/mtrest/User.Invite`, `https://${deployment.b2cTenantName}.onmicrosoft.com/mtrest/User.ReadAll`],                    
            account: accounts[0],
            extraQueryParameters: { tenant: tenant }
        })
    }
    
    return (
        <> 
            <div className="addActionsWrapper">
                <ActionButton
                    variant="outlined"
                    startIcon={<ControlPointOutlinedIcon />}
                    sx={{
                        margin: '0px 10px',
                        color: '#0A1A27',
                        border: '1px solid #0A1A27'
                    }}
                    >ADD TENANT</ActionButton>
                <ActionButton
                    variant="outlined"
                    startIcon={<ControlPointOutlinedIcon />}
                    sx={{
                        margin: '0px 10px',
                        color: '#0A1A27',
                        border: '1px solid #0A1A27'
                    }}
                    >ADD USER</ActionButton>
            </div>
            <div className="tenantsInfoWrapper">
                <div className="tenantListCont">
                    <div className="headerTitle">TETANT LIST</div>
                    {!loading && <div className="tenantsWrapper">{accounts[0].idTokenClaims.allTenants.map( tenant=>(
                        <div 
                            className="tenantItem"
                            onClick={() => handleSwitchTenant(tenant)}>{tenant}</div>
                    ))}</div>}
                </div>
                <div className="memberTableWrapper">
                <Table>
                    <thead>
                        <tr key="ix">
                            <th style={{paddingLeft: "8px"}}><span>USERNAME</span><ArrowDropDownOutlinedIcon /></th>
                            <th><span>ROLE</span><ArrowDropDownOutlinedIcon /></th>
                            <th><span>INVITED</span><ArrowDropDownOutlinedIcon /></th>
                            <th></th>
                        </tr>
                    </thead>    
                    <tbody>
                        {
                            membersData.map(member=>(
                                <><tr className="memberRowData">
                                    <td style={{paddingLeft: "8px"}}>{member.userName}</td>
                                    <td>{member.role}</td>
                                    <td>{member.invited ? 'YES' : 'NO'}</td>
                                    <td align="right"><ActionButton>RESET PASSWORD</ActionButton></td>
                                </tr>
                                </>
                            ))
                        }
                                                                                                                             
                    </tbody>                                
                </Table>
                </div>
            </div>
            {/* {nowShowing === "claims" ?
                <IdTokenContent />
                : (nowShowing === "members") ?
                    <Members instance={instance} account={accounts[0]} />
                    : (nowShowing === "invitation") ?
                        <InviteMember />
                        :
                        <MyUrl domain_hint={accounts[0].idTokenClaims.idp} login_hint={accounts[0].idTokenClaims.email ?? accounts[0].idTokenClaims.signInName} tenant={accounts[0].idTokenClaims.appTenantName} />
            } */}
            {loading && <div className="spinnerWrapper"><Spinner/></div>}
        </>
    );
}

const IdTokenContent = () => {
    const { accounts } = useMsal();
    const [idTokenClaims, setIdTokenClaims] = useState(accounts[0].idTokenClaims);
    return (
        <>
            <IdTokenClaims idTokenClaims={idTokenClaims} />
        </>
    );
};

const IdTokenClaims = (props) => {  
    return (
        <>
            <h5 className="card-title">Some token claims</h5>
            <Table>
                <thead>
                    <tr key="ix">
                        <th>Name</th>
                        <th>Value</th>
                    </tr>
                </thead>    
                <tbody>
                    <tr>
                        <td><strong>Email/sign in name</strong></td>
                        <td>{props.idTokenClaims.email?? props.idTokenClaims.signInName}</td>
                    </tr> 
                    <tr>
                        <td><strong>Object id</strong></td>
                        <td>{props.idTokenClaims.sub}</td>
                    </tr>   
                    <tr>
                        <td><strong>App tenant name</strong></td>
                        <td>{props.idTokenClaims.appTenantName}</td>
                    </tr>      
                    <tr>
                        <td><strong>App tenant id</strong></td>
                        <td>{props.idTokenClaims.appTenantId}</td>
                    </tr>     
                    <tr>
                        <td><strong>Role(s)</strong></td>
                        <td><ul className="plain-list"><ListRoles roles={props.idTokenClaims.roles} /></ul></td>
                    </tr>                                                                                                          
                </tbody>                                
            </Table>      
            </>  
    );
}

const InviteMember = () => {
    const [email, setEmail] = useState("abc@xyz.com");
    const [invitation, setInvitation] = useState(null);
    const [statusMsg, setStatusMsg] = useState("");
    const { instance, accounts } = useMsal();
    const [isAdmin, setIsAdmin] = useState(false);
    return (
        <div>
            <h5 className="card-title">Invitation</h5>
            <div>
                <div><p><i>Enter email address</i></p>
                    <div><input type="text" value={email} onChange={(e) => { setEmail(e.target.value); setInvitation(""); setStatusMsg(""); }} /></div>
                </div>
                <br />
                <ToggleButton
                    id="isTenantAdmin"
                    type="checkbox"
                    variant="primary"
                    checked={isAdmin}
                    value="0"
                    onChange={(e) => { setIsAdmin(e.currentTarget.checked); setInvitation(""); }} >
                    Is co-admin?
                </ToggleButton>
                <br />
                <div><Button onClick={() => {
                    console.log('starting click' + email);
                    console.log("isAdmin?" + isAdmin);
                    setStatusMsg("generating");
                    //setEmail(email);
                    setInvitation("");
                    let request = {
                        authority: `https://${deployment.b2cTenantName}.b2clogin.com/${deployment.b2cTenantId}/${accounts[0].idTokenClaims.acr}`,
                        scopes: ["openid", "profile", `https://${deployment.b2cTenantName}.onmicrosoft.com/mtrest/User.Invite`, `https://${deployment.b2cTenantName}.onmicrosoft.com/mtrest/User.ReadAll`],
                        account: accounts[0],
                        extraQueryParameters: { tenant: accounts[0].idTokenClaims.appTenantName }
                    }
                    let callApi = (accessToken) => {
                        axios.post(
                            `${deployment.restUrl}tenant/oauth2/invite`,
                            { inviteEmail: email, additionalClaims: { isAdmin: isAdmin.toString() } },
                            { headers: { 'Authorization': `Bearer ${accessToken}` } }
                        ).then(response => 
                            { 
                                setInvitation(response.data); 
                                console.log("invite received");
                                    // This code is to send activation link to recipient
                                    axios.post(
                                        `${deployment.aipUrl}/v1/EmailService/SendOAuthEmail`,
                                         { recipientEmail: email, URL: response.data }
                                    ).then(response => {
                                        console.log(`Email sent to - ${email}`);
                                    })
                                    .catch(error => console.log(error));

                                    // This code is to send activation link to recipient
                            })
                            .catch(error => console.log(error));
                    }
                    instance.acquireTokenSilent(request).then(function (accessTokenResponse) {
                        console.log("Email:" + email);
                        callApi(accessTokenResponse.accessToken);

                    }).catch(function (error) {
                        if (error instanceof InteractionRequiredAuthError) {
                            instance.acquireTokenPopup(request).then(function (accessTokenResponse) {
                                callApi(acceaccessTokenResponse.accessTokenssToken);
                            }).catch(function (error) {
                                console.log(error);
                            });
                        }
                        console.log(error);
                    });
                }}>Invite</Button></div>
                {invitation ?
                    <Table bordered="true">
                        <tbody>
                            <p>Copy and send the following link to the invited person.</p>
                            <a href={invitation} target="_blank" rel="noopener">Invitation url</a>
                        </tbody>
                    </Table>
                    : statusMsg ?
                        <p>Generating invitation link, please wait...</p>
                        :
                        <p />
                }
            </div>
        </div>
    );
};

const Members = (props) => {
    console.log("Members: " + props);

    const [members, setMembers] = useState(null);
    const { instance, accounts } = useMsal();
    const account = accounts[0];

    const getMembers = (accessToken) => {
        console.log("Starting getMembers");
        axios.get(
            `${deployment.restUrl}tenant/oauth2/members`,
            { headers: { 'Authorization': `Bearer ${accessToken}` } }
        )
            .then(response => {
                console.log(`${response.data.length} members received`);
                setMembers(response.data)
            })
            .catch(error => console.log(error));
    }

    useEffect(() => {
        let request = {
            authority: `https://${deployment.b2cTenantName}.b2clogin.com/${deployment.b2cTenantId}/${account.idTokenClaims.acr}`,
            scopes: ["openid", "profile", `https://${deployment.b2cTenantName}.onmicrosoft.com/mtrest/User.Invite`, `https://${deployment.b2cTenantName}.onmicrosoft.com/mtrest/User.ReadAll`],
            account: accounts[0],
            extraQueryParameters: { tenant: account.idTokenClaims.appTenantName }
        };
        instance.acquireTokenSilent(request).then(function (accessTokenResponse) {
            getMembers(accessTokenResponse.accessToken);
        }).catch(function (error) {
            if (error instanceof InteractionRequiredAuthError) {
                instance.acquireTokenPopup(request).then(function (accessTokenResponse) {
                    getMembers(accessTokenResponse.accessToken);
                }).catch(function (error) {
                    console.log(error);
                });
            }
            console.log(error);
        });
    }, [])


    return (
        <>
            {members ?
                <div>
                    <h5 className="card-title">{`Tenant: ${account.idTokenClaims.appTenantName} has ${members.length} members`}</h5>
                    <Table>
                        <thead>
                            <tr key="ix">
                                <th>Email</th>
                                <th>Name</th>
                                <th>Roles</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ListMembers members={members} />
                        </tbody>
                    </Table>
                    {members.length < 2 ?
                        <div>
                            <h5>It's lonely here! Please use <strong>New</strong> option above to invite other users</h5>
                            <h5>If this tenant was created with a <i>Work or School</i> account and marked as <i>Allow</i>,</h5>
                            <h5>invitations are not needed for users from the same AAD directory.</h5>
                        </div>
                        :
                        <p />}
                </div>
                :
                <p>Loading, please wait...</p>
            }
        </>

    )
};

const ListRoles = (props) => {
    return (props.roles.map((r, ix) =>
        <li key={ix}>{r}</li>
    ))
}

const ListMembers = (props) => {
    return (props.members.map((m, ix) =>
        <tr key={ix}>
            <td>{m.email}</td>
            <td>{m.name}</td>
            <td><ul className="plain-list" ><ListRoles roles={m.roles} /></ul></td>
        </tr>
    ))
}

const MyUrl = (props) => {

    console.log(props)
    const lh = props.login_hint;
    const url = 'https://aka.ms/mtb2c?domain_hint=' + props.domain_hint + '&login_hint=' + lh + '&tenant=' + props.tenant;
    return (
        <>
            <h5>Use this url to speed up your sign in next time:</h5>
            <p>{url}</p>
        </>
    )
}

