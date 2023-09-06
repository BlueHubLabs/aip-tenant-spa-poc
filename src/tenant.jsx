import React, { useState } from "react";

import axios from 'axios';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AIPDataGrid from './AIPDataGrid';
import jsonData from './tenant.json';



import { useMsal } from "@azure/msal-react";

import { ButtonGroup, Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap";

import { b2cPolicies, deployment, loginRequest } from "./authConfig";
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

    const [membersData, setMembers] = useState([]);
    const [isInvite, setIsInvite] = useState(false);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    useEffect(()=>{
        if(accounts && accounts.length && accounts[0].idTokenClaims){
            setLoading(false);
        } else{
            setLoading(true);
        }
    }, [accounts[0].idTokenClaims]);

    // const handleUsersTabClick = async () => {
    //     // ...
    //   };

    const [data1, setData1] = useState();
    const [data2, setData2] = useState();
    const [data3, setData3] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
            const response = await fetch("https://aipbackend.azurewebsites.net/v1/UserRole/GetTenantRoles?tenantID=5ab53943-aada-4db9-9f1f-616ed567396a");
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            else{
            const json = await response.json();
            console.log(json);
            setData1(json);
            setIsLoading(false);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
          }
        
      };
  
      fetchData();
    }, []);

    const UserRowsData = data1 ? data1.map(user=> ({

        id: user.roleId,
    
        "ROLENAME": user.roleName,
    
        "DESCRIPTION": user.description,
    
       
     
    
      })) : [];


      useEffect(() => {
        const fetchFeatureData = async () => {
          try {
              const response = await fetch("https://aipbackend.azurewebsites.net/v1/UserRole/GetTenantFeatures?tenantID=5ab53943-aada-4db9-9f1f-616ed567396a");
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              else{
              const json = await response.json();
              console.log(json);
              setData2(json);
              setIsLoading(false);
              }
            } catch (error) {
              console.error('Error fetching data:', error);
              setIsLoading(false);
            }
          
        };
    
        fetchFeatureData();
      }, []);

      const FeatureRowsData = data2 ? data2.map(user=> ({

        // id: user.sortOrder,
    id:user.applicationFeatureId,
        "TITLE": user.title,
    
        
    
       
     
    
      })) : [];

      useEffect(() => {
        const fetchFeatureData = async () => {
          try {
              const response = await fetch("https://aipbackend.azurewebsites.net/v1/UserRole/GetTenantUserDetails?tenantID=5ab53943-aada-4db9-9f1f-616ed567396a");
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              else{
              const json = await response.json();
              console.log(json);
              setData3(json);
              setIsLoading(false);
              }
            } catch (error) {
              console.error('Error fetching data:', error);
              setIsLoading(false);
            }
          
        };
    
        fetchFeatureData();
      }, []);

      const UsersRowsData = data3 ? data3.map(user=> ({

        // id: user.sortOrder,
        id:user.userId,
        "USERNAME": user.userFullName,
        "ROLENAME" : user.userRoleName,
        "EMAILADDRESS": user.userEmailAddress,
    
        
    
       
     
    
      })) : [];
    
     
  
    const handleSwitchTenant = (tenant) =>{
        setLoading(true);
        instance.loginRedirect({ 
            authority:b2cPolicies.authorities.signIn.authority,
            scopes: ["openid", "profile", `https://${deployment.b2cTenantName}.onmicrosoft.com/mtrest/User.Invite`, `https://${deployment.b2cTenantName}.onmicrosoft.com/mtrest/User.ReadAll`],                    
            account: accounts[0],
            extraQueryParameters: { tenant: tenant }
        }).then(()=>getMemberAccessToken());
    }

    const getMembers = (accessToken) => {
        console.log("Starting getMembers");
        axios.get(
            `${deployment.restUrl}tenant/oauth2/members`,
            { headers: { 'Authorization': `Bearer ${accessToken}` } }
        )
            .then(response => {
                console.log(`${response.data} members received`);
                setMembers(response.data)
            })
            .catch(error => console.log(error));
    }

    const getMemberAccessToken = () => {
        let request = {
            authority: `https://${deployment.b2cTenantName}.b2clogin.com/${deployment.b2cTenantId}/${accounts[0].idTokenClaims.acr}`,
            scopes: ["openid", "profile", `https://${deployment.b2cTenantName}.onmicrosoft.com/mtrest/User.Invite`, `https://${deployment.b2cTenantName}.onmicrosoft.com/mtrest/User.ReadAll`],
            account: accounts[0],
            extraQueryParameters: { tenant: accounts[0].idTokenClaims.appTenantName }
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
    }

    useEffect(()=>{
        getMemberAccessToken();
    },[]);
    // const [tab1Content, setTab1Content] = useState(null);
    const [usersTabContent, setUsersTabContent] = useState(null);
    
    const loadUsersTabContent = async () => {
        try {
            const dummyData = "This is the content for the USERS tab.";
            setUsersTabContent(dummyData);
          } catch (error) {
            console.error('Error loading content for USERS tab:', error);
          }
        };

     const handleUsersTabClick = () => {
            loadUsersTabContent();
          };

    // const loadTab1Content = async () => {
    //     try {
    //       // Fetch and set content for Tab 1
    //       const response = await fetch('your-api-endpoint-for-tab1-content');
    //       const data = await response.json();
    //       setTab1Content(data);
    //     } catch (error) {
    //       console.error('Error loading content for Tab 1:', error);
    //     }
    //   };

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
      };

   
    return (
        <> 
          
           
       
            
            
         
            {!isInvite && <>
            {/* <div className="addActionsWrapper"> */}
       
            <div className="tabsContainer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Tabs value={value} onChange={handleTabChange}   >
        {/* Define your tab labels here */}
        
        


        
        <Tab label="USERS" className="tabLabel"  style={{ marginRight: '120px' }}/>
        <Tab label="ROLES" className="tabLabel" style={{ marginRight: '120px' }}/>
        <Tab label="FEATURES" className="tabLabel" style={{ marginRight: '120px' }} />
        <Tab label="ROLE FEATURES" className="tabLabel"  />

      </Tabs>
      
      
     
     
                 {/* <Tab
                    className={`tabItem ${value === 0 ? 'active' : ''}`}
                    label={
                        <div className="tabLabelContainer" onClick={handleUsersTabClick}>
                            
                            <img src="https://www.thesslstore.com/blog/wp-content/uploads/2017/05/circle-with-i-1.png" alt="Icon" className="tabIcon" />
                            <span>USERS</span>
                            
                            </div>
                         
                         }
                         
                        
                    onClick={() => handleChange(null, 0)}
                /> */}
                
                {/* <AIPDataGrid onRowsSelectionHandler={() => { }} columns={jsonData.UserColumns} rows={jsonData.UserRows} /> */}
                {/* <Tab
                    className={`tabItem ${value === 1 ? 'active' : ''}`}
                    label={
                        <div className="tabLabelContainer">
                            <img src="https://www.nicepng.com/png/detail/423-4238489_rep…rrow-chart-business-graph-stock-data-comments.png" alt="Icon" className="tabIcon" />
                            <span>ROLES</span>
                        </div>
                    }
                    onClick={() => handleChange(null, 1)}
                /> */}
                {/* <Tab
                    className={`tabItem ${value === 2 ? 'active' : ''}`}
                    label={
                        <div className="tabLabelContainer">
                            <img src="https://cdn-icons-png.flaticon.com/512/5431/5431304.png" alt="Icon" className="tabIcon" />
                            <span>FEATURES</span>
                        </div>
                    }
                    onClick={() => handleChange(null, 2)}
                /> */}
                 
                 </div>
                 {/* {value === 0 && tab1Content && ( */}
  {/* <div>
    <h2>Tab 1 Content</h2>
    <AIPDataGrid onRowsSelectionHandler={() => { }} columns={jsonData.UserColumns} rows={jsonData.UserRows} />

  </div>
)} */}
                
                 
                {/* <Tab className={`tabItem ${value === 0 ? 'active' : ''}`} label="USERS" onClick={() => handleChange(null, 0)} />
                <Tab className={`tabItem ${value === 1 ? 'active' : ''}`} label="ROLES" onClick={() => handleChange(null, 1)} />
                <Tab className={`tabItem ${value === 2 ? 'active' : ''}`} label="FEATURES" onClick={() => handleChange(null, 2)} /> */}
            
            {/* <div className="tabsContainer">
                <Tabs value={value} onChange={handleChange} centered>
                    <Tab className="tabItem" label="USERS" />
                    <Tab className="tabItem" label="ROLES" />
                    <Tab className="tabItem" label="FEATURES" />
                </Tabs>
            </div> */}
                {/* <ActionButton
                    variant="outlined"
                    startIcon={<ControlPointOutlinedIcon />}
                    sx={{
                        margin: '0px 10px',
                        color: '#0A1A27',
                        border: '1px solid #0A1A27'
                    }}
                    onClick={()=>
                        instance.loginRedirect({ 
                            authority:b2cPolicies.authorities.newTenant.authority,
                            scopes: loginRequest.scopes                           
                        }).catch((error) => console.log(error))}
                    >ADD TENANT</ActionButton> */}
                {/* <ActionButton
                    variant="outlined"
                    startIcon={<ControlPointOutlinedIcon />}
                    sx={{
                        margin: '0px 10px',
                        color: '#0A1A27',
                        border: '1px solid #0A1A27'
                    }}
                    onClick={()=> setIsInvite(true)}
                    >ADD USER</ActionButton> */}
            {/* </div> */}
            <div className="tenantsInfoWrapperParent">
            <div className="tenantsInfoWrapper">
                <div className="tenantListCont">
                    <div className="headerTitle">TENANT LIST</div>
                    {!loading && <div className="tenantsWrapper">{accounts[0].idTokenClaims.allTenants.map( tenant=>(
                        <div 
                            className={`tenantItem ${(accounts[0].idTokenClaims.appTenantName === tenant) && 'selectedTenant'}`}
                            onClick={() => handleSwitchTenant(tenant)}>{tenant}</div>
                    ))}</div>}
                
                </div>
                </div>
                <div className="tenantsInfoWrapperContent">
               

                <div className="memberTableWrapper">
               
                {/* <Tabs value={value} onChange={handleChange} centered>
                <Tab label="Item One" />
                <Tab label="Item Two" />
                <Tab label="Item Three" />
                </Tabs> */}
                {/* <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Users</h2> */}
                {/* <AIPDataGrid onRowsSelectionHandler={() => { }} columns={jsonData.UserColumns} rows={jsonData.UserRows} /> */}
                <Table>
                    {/* <thead>
                        <tr key="ix">
                            <th style={{paddingLeft: "8px"}}><span>USERNAME</span><ArrowDropDownOutlinedIcon /></th>
                            <th><span>ROLE</span><ArrowDropDownOutlinedIcon /></th>
                            <th><span>ROLE ASSIGNED</span><ArrowDropDownOutlinedIcon /></th>
                            <th></th>
                        </tr>
                    </thead>     */}
                   <tbody>
                   {/* <AIPDataGrid onRowsSelectionHandler={() => { }} columns={jsonData.UserColumns} rows={jsonData.UserRows} /> */}
                        {/* {   membersData.length ?
                            membersData.map(member=>(
                                <><tr className="memberRowData">
                                    <td style={{paddingLeft: "8px"}}>{member.name}</td>
                                    <td>{member.roles[0] === "Tenant.admin" ? 'Fund Manager' : 'Investor'}</td>
                                    <td>Yes</td>
                                    <td align="right"><ActionButton>RESET PASSWORD</ActionButton></td>
                                </tr>
                                </>
                                
                            )):
                            
                            // <div>No members to display</div>
                        } */}
                                                                                                                             
                    </tbody>                                
                </Table>
                
                </div>

                <div className="memberTableWrapper">
                {value === 0 && (
        <div>
          {/* Render your table or content for "USERS" tab here */}
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Users</h2>
          <AIPDataGrid onRowsSelectionHandler={() => { }} columns={jsonData.UsersColumns} rows={UsersRowsData} />
          {/* You can render your table component here */}
        </div>
      )}
      {value === 1 && (
        <div>
          {/* Render your table or content for "USERS" tab here */}
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Roles</h2>
          <AIPDataGrid onRowsSelectionHandler={() => { }} columns={jsonData.UserColumns} rows={UserRowsData} />
          {/* You can render your table component here */}
        </div>
      )}
                
         
              
       {value === 2 && (
        <div>
          {/* Render your table or content for "USERS" tab here */}
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Features</h2>
          <AIPDataGrid onRowsSelectionHandler={() => { }} columns={jsonData.FeatureColumns} rows={FeatureRowsData} />
          {/* You can render your table component here */}
        </div>
      )}
                {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ActionButton
                    variant="outlined"
                    startIcon={<ControlPointOutlinedIcon />}
                    sx={{
                        margin: '0px 10px',
                        color: '#0A1A27',
                        border: '1px solid #0A1A27'
                    }}
                    onClick={()=> setIsInvite(true)}
                    >ADD NEW GROUP</ActionButton> </div> */}
              {/* <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Roles</h2> */}
              {/* <Table>
                  <thead>
                      <tr key="ix">
                          <th style={{paddingLeft: "8px"}}><span>ROLE</span><ArrowDropDownOutlinedIcon /></th>
                          <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>FEATURE</span><ArrowDropDownOutlinedIcon /></th>
                          <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>CREATE</span></th>
                          <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>READ</span></th>
                          <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>UPDATE</span></th>
                          <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>DELETE</span></th>
                          <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>ACTION</span></th>
                          <th></th>
                      </tr>
                  </thead>     */}
                 {/* <tbody>
                      {   membersData.length ?
                          membersData.map(member=>(
                              <><tr className="memberRowData">
                                  {/* <td style={{paddingLeft: "8px"}}>{member.name}</td> */}
                                  {/* <td>{member.roles[0] === "Tenant.admin" ? 'Fund Manager' : 'Investor'}</td>
                                  <td>{member.roles[0] === "Tenant.admin" ? '' : 'Service, Fund, Subscription'}</td>
                                  <td>{member.roles[0] === "Tenant.admin" ? '' : <input type="checkbox" />}</td>
                                  <td>{member.roles[0] === "Tenant.admin" ? '' : <input type="checkbox" />}</td>
                                  <td>{member.roles[0] === "Tenant.admin" ? '' : <input type="checkbox" />}</td>
                                  <td>{member.roles[0] === "Tenant.admin" ? '' : <input type="checkbox" />}</td>
                                  <td>{member.roles[0] === "Tenant.admin" ? '' : <a href="/edit">Edit</a>}</td> */}
                                  {/* <td>Yes</td> */}
                                  {/* <td align="right"><ActionButton>ASSIGN ROLES</ActionButton></td>
                              </tr>
                              </>
                          )):<div>No members to display</div>
                      } */}
                                                                                                                           
                  {/* </tbody>                                 *} */}
              {/* </Table> */}
              </div>    
            
            </div> </div></> }
           {/*  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ActionButton
                    variant="outlined"
                    startIcon={<ControlPointOutlinedIcon />}
                    sx={{
                        margin: '0px 10px',
                        color: '#0A1A27',
                        border: '1px solid #0A1A27'
                    }}
                    onClick={()=>
                        instance.loginRedirect({ 
                            authority:b2cPolicies.authorities.newTenant.authority,
                            scopes: loginRequest.scopes                           
                        }).catch((error) => console.log(error))}
                    >ADD NEW GROUP</ActionButton></div> */}
              {/*   <div style={{ display: 'flex', justifyContent: 'flex-end' }}> */}
           
                {/* </div>  */} 
            {isInvite && <InviteMember />}
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
     
};
<div className="memberTableWrapper">
                <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Users</h2>
                <Table>
                    <thead>
                        <tr key="ix">
                            <th style={{paddingLeft: "8px"}}><span>USERNAME</span><ArrowDropDownOutlinedIcon /></th>
                            <th><span>ROLE</span><ArrowDropDownOutlinedIcon /></th>
                            <th><span>INVITED</span><ArrowDropDownOutlinedIcon /></th>
                            <th></th>
                        </tr>
                    </thead>
                </Table>

</div>
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
                    Is fund manager?
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