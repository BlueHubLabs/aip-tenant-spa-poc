import React, { useState } from "react";

import axios from 'axios';
import AIPDataGrid from './AIPDataGrid';
import { DataGrid } from "@mui/x-data-grid";
import jsonData from './tenant.json';
import { useMsal } from "@azure/msal-react";
import { Button, ToggleButton } from "react-bootstrap";
import { b2cPolicies, deployment } from "./authConfig";
import { useEffect } from "react";
import ActionButton from '@mui/material/Button';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import './tenant.css';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import TextInput from './TextInput'

export const Tenant = () => {
  // const apiURL = "https://localhost:8080" //Local
  // const apiURL = "https://aipbackend.azurewebsites.net" //Dev
  const apiURL = "https://aipdemoapi.azurewebsites.net" //QA
  const { instance, accounts } = useMsal();
  const [loading, setLoading] = useState(true);


  const [membersData, setMembers] = useState([]);
  const [selectedTenantGUID, setSelectedTenantGUID] = useState("5ab53943-aada-4db9-9f1f-616ed567396a");

  /* This portion is for Adding tenant user */
  /*
  
  Process : 
  1) Constants 
  2) Events
  3) Service Calls
  
  */
  const [tenantDialogOpen, setTenantDialogOpen] = useState(false);
  const [tenantName, setTenantName] = useState('');
  const [tenantDescription, setTenantDescription] = useState('');
  const [tenantData, setTenantData] = useState([]);

  const openTenantDialog = () => {
    setTenantDialogOpen(true);
  }

  const closeTenantDialog= () => {
    setTenantDialogOpen(false);
  };
  
  const handleTenantNameChange = (event) => {
    setTenantName(event.target.value);
  };
  const handleTenantDescriptionChange = (event) => {
    setTenantDescription(event.target.value);
  };
  
  const saveTenantDetails = async () => {
    try {

      const url = `${apiURL}/v1/Tenant/CreateTenantDetails`;

      const requestBody = {
        displayName: tenantName,
        mailNickname: tenantName,
        description: tenantDescription,
        mailEnabled: false,
        securityEnabled: true
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      else {
        const json = await response.json();
        console.log(json);
        debugger
        fetchAllTenants();
      }
      closeTenantDialog();
    } catch (error) {
      console.error('Error fetching data:', error);
      closeTenantDialog();
    }
  };

  const fetchAllTenants = async () => {
    try {
      const url = `${apiURL}/v1/Tenant/GetTenantDetails`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        const json = await response.json();
        setTenantData(json);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(()=>{
    fetchAllTenants();
  },[]);
  /* This portion is for Adding tenant user */


  useEffect(() => {
    if (accounts && accounts.length && accounts[0].idTokenClaims) {

      console.log("selected tenant value : ");
      console.log(accounts[0].idTokenClaims.appTenantId);
      setSelectedTenantGUID(accounts[0].idTokenClaims.appTenantId);

      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [accounts[0].idTokenClaims]);

  // const handleUsersTabClick = async () => {
  //     // ...
  //   };


  const [isLoading, setIsLoading] = useState(true);

  const handleSwitchTenant = (tenant) => {
    (true);
    instance.loginRedirect({
      authority: b2cPolicies.authorities.signIn.authority,
      scopes: ["openid", "profile", `https://${deployment.b2cTenantName}.onmicrosoft.com/mtrest/User.Invite`, `https://${deployment.b2cTenantName}.onmicrosoft.com/mtrest/User.ReadAll`],
      account: accounts[0],
      extraQueryParameters: { tenant: tenant }
    }).then(() => getMemberAccessToken());

    // fetchTenantUserData();
  }

  const fetchRoleData = async (tenantid) => {
    try {
      const response = await fetch(`${apiURL}/v1/UserRole/GetTenantRoles?tenantID=${tenantid}&isSystemRole=1`);
      debugger
      if (!response.ok) {
        setuserrolesdropdown([]);
        throw new Error('Network response was not ok');
      }
      else {
        const json = await response.json();
        console.log(json);
        setuserrolesdropdown(json);
        debugger
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }

  };

  useEffect(() => {
    const fetchTenantUserData = async () => {
      try {
        const response = await fetch(`${apiURL}/v1/UserRole/GetTenantUserDetails?tenantID=${tenantData[0]?.id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        else {
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

    fetchTenantUserData();
  }, []);

  
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

  useEffect(() => {
    getMemberAccessToken();
    getMemberAccessToken();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userRoleId, setUserRoleId] = useState(0);


  // const [isTenantAdmin, setIsTenantAdmin] = useState('');
  const [userEmailAddress, setUserEmailAddress] = useState('');
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };


  const handleUserFirstNameChange = (event) => {
    setUserFirstName(event.target.value);
  };
  const handleUserLastNameChange = (event) => {
    setUserLastName(event.target.value);
  };
  const handleUserEmailAddressChange = (event) => {
    setUserEmailAddress(event.target.value);
  };

  const onChangeDropdown = (selectedValue) => {
    setUserRoleId(selectedValue); // Update the state with the selected value
  };

  const saveNewUser = async () => {
    const roleName = userrolesdropdown.find((item) => item.roleId === userRoleId)?.roleName;
    console.log(roleName)
    const selectedRolesData = {
      userId: 0, // Replace with the actual user ID
      userFirstName: userFirstName,
      userLastName: userLastName,
      userFullName: `${userFirstName} ${userLastName}`,
      userEmailAddress: userEmailAddress,
      phoneNumber: 1234512345,
      dateOfBirth: "",
      briefDescription: "",
      tenantGUID: selectedtenant, 
      userRoleID : userRoleId,
      userRoleName : roleName,
      userRoles: [
        {
          "userId": 0,
          "roleId": userRoleId,
          "roleName": roleName,
          "isPrimary": true
        }
      ],
    };
    const formData = new FormData();
    formData.append('tenantUserData', JSON.stringify(selectedRolesData));
    // console.log(tenantUserData);
      fetch(`${apiURL}/v1/User/CreateTenantUser?tenantID=${selectedtenant}`, {
        method: 'POST',
        body: formData,
      })
      .then((response) => {
        console.log('Data sent to the API successfully:', response.data);
        /* //debugger */
        handleShowusers(selectedtenant);
      })
      .catch((error) => {
        if (error.response.status === 422) {
          console.log("User Already Exists. (or) Unable to create the User");
        }
        // Handle any error actions here
      });
    closeDialog();
  };

  const [userrolesdropdown,setuserrolesdropdown] = useState();

  const [UsersRowsData,setUsersRowsData] = useState([]);

  const [selectedtenant,setSelectedTenant] = useState("");

  const handleShowusers = async(tenantid) =>{
    setSelectedTenant(tenantid);
    fetchRoleData(tenantid);
    try {
      const response = await fetch(`${apiURL}/v1/UserRole/GetTenantUserDetails?tenantID=${tenantid}`);
      if (!response.ok) {
        setUsersRowsData([]);
        throw new Error('Network response was not ok');
      }
      else {
        const json = await response.json();
        console.log(json);
        const users = json?.map(user => ({
                      "id": user.userId,
                      "USERNAME": user.userFullName,
                      "ROLENAME": user.userRoleName,
                      "EMAILADDRESS": user.userEmailAddress,})) 
        setUsersRowsData(users);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <div className="tenantsParentWrapper">
        <div className="tenantsInfoWrapperParent">
          <div className="tenantsInfoWrapper">
            <div className="tenantListCont">
            <div className="divContentHeaderHolder space-between">
               <h2 style={{ fontSize: "20px", margin: " 5px" }}>Tenants</h2>
                <ActionButton
                  variant="outlined"
                  startIcon={<ControlPointOutlinedIcon />}
                  sx={{
                    color: '#0A1A27',
                    border: '1px solid #0A1A27',
                  }}
                  onClick={openTenantDialog}>
                  ADD TENANT
                </ActionButton>
              </div>
              {!loading &&
                <div className="tenantsWrapper">{
                  tenantData?.map(tenant => (
                  <div
                    className={selectedtenant === tenant?.id ? "selectedtenant" : "tenantsWrapper item"}
                    onClick={() => handleShowusers(tenant?.id)}>{tenant?.displayName}</div>
                ))}
                </div>}
                <Dialog open={tenantDialogOpen} onClose={closeTenantDialog} fullWidth>
                    <DialogTitle>
                      Add Tenant
                    </DialogTitle>
                    <DialogContent>
                        <div className="fieldsconatiner">
                          <div className="childitem">
                            <TextField
                              label="Tenant Name"
                              fullWidth
                              variant="outlined"
                              value={tenantName}
                              onChange={handleTenantNameChange} />
                          </div>
                          <div className="childitem">
                            <TextField
                              label="Tenant Description"
                              fullWidth
                              variant="outlined"
                              value={tenantDescription}
                              onChange={handleTenantDescriptionChange} />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={closeTenantDialog} 
                        style={{ backgroundColor: 'white', color: 'gray' }}>
                        Cancel
                      </Button>
                      <Button onClick={saveTenantDetails} color="primary">
                        Submit
                      </Button>
                    </DialogActions>
                  </Dialog>
            </div>
          </div>

          <div className="tenantsInfoWrapperContent">
                  <div className="divContent" >
                    <div className="divContentHeaderHolder">
                      {/* <div  style={{ marginRight: '10px', marginLeft:'Auto' }}> */}
                      <h2 style={{ fontSize: "20px", margin: " 5px" }}>Users</h2>
                      <div style={{ marginRight: '10px', marginLeft: 'Auto' }}>
                        <div>
                          <ActionButton
                            variant="outlined"
                            startIcon={<ControlPointOutlinedIcon />}
                            sx={{
                              color: '#0A1A27',
                              border: '1px solid #0A1A27',
                            }}
                            onClick={openDialog}
                            disabled={selectedtenant !== ""? false  : true}
                          >
                            ADD USERS
                          </ActionButton>
                        </div>
                      </div>
                    </div>
                    <div>
                       <AIPDataGrid onRowsSelectionHandler={() => {}} columns={jsonData.UsersColumns} rows={UsersRowsData} />
                    </div>

                  </div>
              {/* Add User Popup */}
              <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth>
                <DialogTitle>Add Users</DialogTitle>
                <DialogContent>
                  <div className="fieldsconatiner">
                    <div className="childitem">
                      <TextField
                        label="User First Name"
                        variant="outlined"
                        halfWidth
                        value={userFirstName}
                        onChange={handleUserFirstNameChange}
                      />
                      <TextField
                        label="User Last Name"
                        variant="outlined"
                        halfWidth
                        value={userLastName}
                        onChange={handleUserLastNameChange}
                      />
                    </div>
                    <div className="childitem">
                      <TextField
                        label="User Email Address"
                        variant="outlined"
                        fullWidth
                        value={userEmailAddress}
                        onChange={handleUserEmailAddressChange}
                      />
                    </div>
                      <div className="childitem">
                      <TextInput
                          variant="outlined"
                          fullWidth
                          type="select"
                          label="Role"
                          options={userrolesdropdown?.map(option => ({ label: option.roleName, value: option.roleId }))}
                          onChange={onChangeDropdown}
                          selectedValue={userRoleId}
                        />
                    </div>
                      <div className="childitem">
                        <label for="checkbox" class="checkbox-label">
                          <input type="checkbox" id="checkbox" name="checkbox_name" value="checkbox_value" class="checkbox-input" />
                          <span class="checkbox-text">Is Tenant Admin</span>
                        </label>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeDialog} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={saveNewUser} color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
          </div> 

        </div>
    </div>
  );
};

