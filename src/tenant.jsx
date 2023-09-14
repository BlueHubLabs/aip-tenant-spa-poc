import React, { useState } from "react";

import axios from 'axios';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AIPDataGrid from './AIPDataGrid';
import { DataGrid } from "@mui/x-data-grid";
import jsonData from './tenant.json';
import TreeView from '@mui/lab/TreeView';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Input,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save'; // Import the Save icon
import TreeItem from '@mui/lab/TreeItem';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Checkbox from '@mui/material/Checkbox';
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
import { Padding } from "@mui/icons-material";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import { Autocomplete } from "@mui/material";


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
  const[selectedTenantGUID, setSelectedTenantGUID] = useState("5ab53943-aada-4db9-9f1f-616ed567396a");
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    debugger;
    if (accounts && accounts.length && accounts[0].idTokenClaims) {
      
      console.log("selected tenant value : " );
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


  const [data1, setData1] = useState();
  const [data2, setData2] = useState();
  const [data3, setData3] = useState();
  const [CreateTenantRole, setCreateTenantRole] = useState();
  const [createTenantFeature, setCreateTenantFeature] = useState();
  const [createTenantUser, setCreateTenantUser] = useState();
 
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

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const response = await fetch(`https://aipbackend.azurewebsites.net/v1/UserRole/GetTenantRoles?tenantID=${accounts[0].idTokenClaims.appTenantId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        else {
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

    fetchRoleData();
  }, []);

  const UserRowsData = data1 ? data1.map(user => ({

    id: user.roleId,

    "ROLENAME": user.roleName,

    "DESCRIPTION": user.description,




  })) : [];




  //4th tab declarables 

  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [iconColor, setIconColor] = useState('');
  const [topNavBarLogoHeading, setTopNavBarLogoHeading] = useState('');
  const [topNavBarPrimaryColor, setTopNavBarPrimaryColor] = useState('');
  const [topNavBarIconColor, setTopNavBarIconColor] = useState('');
  const [logoImage, setLogoImage] = useState(null);
  const [headerPrimaryColor, setHeaderPrimaryColor] = useState('');
  const [headerFont, setHeaderFont] = useState('');
  const [backgroundColorRecommendations, setBackgroundColorRecommendations] = useState('');


  const handlePrimaryColorChange = (e) => {
    setPrimaryColor(e.target.value);
  };

  const handleSecondaryColorChange = (e) => {
    setSecondaryColor(e.target.value);
  };

  const handleIconColorChange = (e) => {
    setIconColor(e.target.value);
  };
  const handleLogoHeadingChange = (e) => {
    setTopNavBarLogoHeading(e.target.value);
  };

  const handleTopNavBarPrimaryColorChange = (e) => {
    setTopNavBarPrimaryColor(e.target.value);
  };

  const handleTopNavBarIconColorChange = (e) => {
    setTopNavBarIconColor(e.target.value);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle the uploaded file, for example, you can set it in the state.
      setLogoImage(file);
    }
  };
  const handleHeaderPrimaryColorChange = (e) => {
    setHeaderPrimaryColor(e.target.value);
  };

  const handleHeaderFontChange = (e) => {
    setHeaderFont(e.target.value);
  };
  const handleBackgroundColorRecommendationsChange = (e) => {
    setBackgroundColorRecommendations(e.target.value);
  };

  useEffect(() => {
    const fetchFeatureData = async () => {
      try {
        const response = await fetch(`https://aipbackend.azurewebsites.net/v1/UserRole/GetTenantFeatures?tenantID=${accounts[0].idTokenClaims.appTenantId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        else {
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

  const FeatureRowsData = data2 ? data2.map(user => ({

    // id: user.sortOrder,
    id: user.applicationFeatureId,
    "FEATURENAME": user.title,

  })) : [];

  useEffect(() => {
    const fetchTenantUserData = async () => {
      try {
        const response = await fetch(`https://aipbackend.azurewebsites.net/v1/UserRole/GetTenantUserDetails?tenantID=${accounts[0].idTokenClaims.appTenantId}`);
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

  const UsersRowsData = data3 ? data3.map(user => ({

    // id: user.sortOrder,
    id: user.userId,
    "USERNAME": user.userFullName,
    "ROLENAME": user.userRoleName,
    "EMAILADDRESS": user.userEmailAddress,






  })) : [];

  const [roleFeatures, setRoleFeatures] = useState([]); // Initialize with an empty array

  useEffect(() => {
    const fetchRoleFeatures = async () => {
      try {
        const response = await fetch(`https://aipbackend.azurewebsites.net/v1/UserRole/GetTenantRoleFeatures?tenantID=${accounts[0].idTokenClaims.appTenantId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        } else {
          const json = await response.json();
          console.log(json);
          console.log("rolefeatures");
          setRoleFeatures(json); // Set the state with the fetched data
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchRoleFeatures();
  }, []);

  const columns = [
    { field: 'roleName', headerName: 'Role Name', flex: 1 },
    { field: 'applicationFeatureName', headerName: 'Feature Name', flex: 1 },
    {
      field: 'hasWriteAccess',
      headerName: 'Create',
      flex: 1,
      renderCell: (params) => {
        return (
          <Checkbox
            checked={params.value}

          />
        );
      },
    },
    {
      field: 'hasReadAccess',
      headerName: 'Read',
      flex: 1,
      renderCell: (params) => {
        return (
          <Checkbox
            checked={params.value}

          />
        );
      },
    },
    {
      field: 'hasUpdateAccess',
      headerName: 'Update',
      flex: 1,
      renderCell: (params) => {
        return (
          <Checkbox
            checked={params.value}

          />
        );
      },
    },
    {
      field: 'hasDeleteAccess',
      headerName: 'Delete',
      flex: 1,
      renderCell: (params) => {
        return (
          <Checkbox
            checked={params.value}

          />
        );
      },
    },
  ];

  // Transform the data to match the structure for the TreeView
  const transformedData = roleFeatures.map((item) => ({
    id: item.applicationFeatureRoleAccessId,
    roleName: item.roleName,
    applicationFeatureName: item.applicationFeatureName,
    hasReadAccess: item.hasReadAccess,
    hasWriteAccess: item.hasWriteAccess,
    hasUpdateAccess: item.hasUpdateAccess,
    hasDeleteAccess: item.hasDeleteAccess,
  }));
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Your data source (transformedData) and columns should already be defined.

  // Function to handle changes in the search input
  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter the data based on the search query
    const filteredResults = transformedData.filter((item) => {
      // Implement your filtering logic here
      // For example, you can check if the item's roleName or applicationFeatureName contains the search query
      return (
        item.roleName.toLowerCase().includes(query.toLowerCase())

      );
    });

    setFilteredData(filteredResults);
  };
  const roleNames = Array.from(new Set(transformedData.map((item) => item.roleName)));


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
  }, []);
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



  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [roleName, setRoleName] = useState('');
  const [featureName, setFeatureName] = useState('');
  const [featureDescription, setFeatureDescription] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [description, setDescription] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [emailaddress, setEmailAddress] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userEmailAddress, setUserEmailAddress] = useState('');
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleRoleNameChange = (event) => {
    setRoleName(event.target.value);
  };
  const handleFeatureNameChange = (event) => {
    setFeatureName(event.target.value);
  };
  const handleFeatureDescriptionChange = (event) => {
    setFeatureDescription(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleRoleDescriptionChange = (event) => {
    setRoleDescription(event.target.value);
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
  const createNewUser = () => {
    
    closeDialog();
  };
  
  
  const saveNewRole = async() => {

    try {
      const url = `https://aipbackend.azurewebsites.net/v1/UserRole/CreateTenantRole?roleName=${roleName}&description=${roleDescription}&tenantID=${selectedTenantGUID}`;
      debugger;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      debugger;
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        const json = await response.json();
        console.log(json);
        setData1(json);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
    
    closeDialog();
  };
  

  const saveNewFeature = async () => {

    try {
      const url = `https://aipbackend.azurewebsites.net/v1/UserRole/CreateTenantFeature?FeatureName=${featureName}&description=${featureName}&tenantID=5ab53943-aada-4db9-9f1f-616ed567396a`;
      debugger;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      debugger;
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        const json = await response.json();
        console.log(json);
        setData2(json);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }

    closeDialog();

  };


    
    const saveNewUser = async () => {

      try {
  
        const url = `https://aipbackend.azurewebsites.net/v1/User/CreateTenantUser?tenantID=${selectedTenantGUID}`;
        // Define the data to be sent in the request body
  
        const requestBody = {
          userId: 0,
          firstName: userFirstName,
          lastName: userLastName,
          emailAddress: userEmailAddress,
          password: "",
          userRoleId: 5,
          isActive: true,
          softDelete: false,
          trustedContact: "Alice",
          taxFillingContact: "Bob",
          annualPreTaxIncome: "75000",
          numberOfDependents: 2,
          employerStatus: "Employed",
          employer: "XYZ Corporation",
          occupation: "Software Engineer",
          spouseAnnualPreTaxIncome: "60000",
          spouseHasIIAAccount: "Yes",
          federalTaxBracket: "25",
          householdInvestableAssets: "100000",
          phoneNo: "123-456-7890",
          addressLine1: "123 Main Street",
          addressLine2: "Apt 4B",
          zipCode: "12345",
          createdBy: "AdminUser",
          createdDate: "2023-09-13T09:15:00.371Z",
          updatedBy: "AdminUser",
          updatedDate: "2023-09-13T09:15:00.371Z",
          tenantName: "TenantXYZ",
          tenantURL: "https://tenantxyz.com",
          tenantGUID: selectedTenantGUID,
          fundCount: 5,
          isUserProfileExists: true,
          profileIcon: "user123.png",
        };
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody), // Convert the request body to JSON
        });
  
       debugger;
        if (!response.ok) {
          throw new Error('Network response was not ok');
        } 
        else {
          const json = await response.json();
          console.log(json);
          setData3(json);
          // Handle the response data as needed
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


  return (
    <>
      {!isInvite && <>


        <div className="tenantsInfoWrapperParent">
          <div className="tenantsInfoWrapper">
            <div className="tenantListCont">
              <div>
                <div className="tabsContainer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Tabs>
                    <Tab label="List of Tenants" />
                  </Tabs>
                </div>
              </div>
              {!loading &&
                <div className="tenantsWrapper">{accounts[0].idTokenClaims.allTenants.map(tenant => (
                  <div
                    className={`tenantItem ${(accounts[0].idTokenClaims.appTenantName === tenant) && 'selectedTenant'}`}
                    onClick={() => handleSwitchTenant(tenant)}>{tenant}</div>
                ))}
                </div>}
            </div>
          </div>
          <div className="tenantsInfoWrapperContent">
            <div className="memberTableWrapper">
              {value === 0 && (
                <div >
                  <div className="tabsContainer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Tabs value={value} onChange={handleTabChange}>
                      <Tab label="USERS" className="tabLabel" />
                      <Tab label="ROLES" className="tabLabel" />
                      <Tab label="FEATURES" className="tabLabel" />
                      <Tab label="ROLE FEATURES" className="tabLabel" />
                      <Tab label="Site Settings" className="tabLabel" />
                    </Tabs>
                  </div>
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
                          >
                            ADD USERS
                          </ActionButton>
                          <Dialog open={isDialogOpen} onClose={closeDialog}>
                            <DialogTitle>Add Users</DialogTitle>
                            <DialogContent>
                              <TextField
                                label="User First Name"
                                variant="outlined"
                                halfWidth
                                value={userFirstName}
                                onChange={handleUserFirstNameChange}
                                sx={{
                                  marginBottom: 7,
                                  marginTop: 1,
                                  marginRight: 3,
                                  height: 30

                                }}
                              />
                              <TextField
                                label="User Last Name"
                                variant="outlined"
                                halfWidth
                                value={userLastName}
                                onChange={handleUserLastNameChange}
                                sx={{
                                  marginBottom: 7,
                                  marginTop: 1,
                                  height: 30

                                }}
                              />
                              <TextField
                                label="User Email Address"
                                variant="outlined"
                                fullWidth
                                value={userEmailAddress}
                                onChange={handleUserEmailAddressChange}
                                sx={{
                                  marginBottom: 7,
                                  marginTop: 1,
                                  height: 30

                                }}
                              />
                              <Autocomplete
                                disablePortal
                                fullWidth
                                id="combo-box-demo"
                                options={data1?.map((option) => option.roleName)}
                                renderInput={
                                  (params) => <TextField {...params} label="Role" />
                                }
                                sx={{
                                  marginBottom: 7,
                                  marginTop: 1,
                                  height: 30

                                }}
                              />

                            </DialogContent>
                            <DialogActions>
                              <Button onClick={closeDialog} color="primary">
                                Cancel
                              </Button>
                              <Button  onClick={saveNewUser} color="primary">
                                Submit
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                    <AIPDataGrid onRowsSelectionHandler={() => { }} columns={jsonData.UsersColumns} rows={UsersRowsData} />
                    {/* You can render your table component here */}
                  </div>
                </div>
              )}
              {value === 1 && (
                <div>
                  <div className="tabsContainer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Tabs value={value} onChange={handleTabChange}>
                      <Tab label="USERS" className="tabLabel" />
                      <Tab label="ROLES" className="tabLabel" />
                      <Tab label="FEATURES" className="tabLabel" />
                      <Tab label="ROLE FEATURES" className="tabLabel" />
                      <Tab label="Site Settings" className="tabLabel" />
                    </Tabs>
                  </div>
                  <div className="divContent" >
                    <div className="divContentHeaderHolder" >
                      <h2 style={{ fontSize: "20px", margin: "5px" }}>Roles</h2>
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
                          >
                            ADD ROLES
                          </ActionButton>
                          <Dialog open={isDialogOpen} onClose={closeDialog}>
                            <DialogTitle>Add Role</DialogTitle>
                            <DialogContent>
                              <TextField
                                label="Role Name"
                                variant="outlined"
                                fullWidth
                                value={roleName}
                                onChange={handleRoleNameChange}
                                sx={{
                                  marginBottom: 7,
                                  marginTop: 1,
                                  height: 30
                                }}
                              />
                              <TextField
                                label="Role Description"
                                variant="outlined"
                                fullWidth
                                value={roleDescription}
                                multiline
                                rows={4}
                                onChange={handleRoleDescriptionChange}
                              />
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={closeDialog} color="primary">
                                Cancel
                              </Button>
                              <Button onClick={saveNewRole} color="primary">
                                Submit
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </div>
                      </div></div>


                    <AIPDataGrid onRowsSelectionHandler={() => { }} columns={jsonData.UserColumns} rows={UserRowsData} />
                    {/* rows={UserRowsData} /> */}
                    {/* You can render your table component here */}
                  </div>
                </div>
              )}



              {value === 2 && (
                <div>
                  <div className="tabsContainer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Tabs value={value} onChange={handleTabChange}>
                      <Tab label="USERS" className="tabLabel" />
                      <Tab label="ROLES" className="tabLabel" />
                      <Tab label="FEATURES" className="tabLabel" />
                      <Tab label="ROLE FEATURES" className="tabLabel" />
                      <Tab label="Site Settings" className="tabLabel" />
                    </Tabs>
                  </div>
                  <div className="divContent" >
                    <div className="divContentHeaderHolder">
                      <h2 style={{ fontSize: "20px", margin: "5px" }}>Features</h2>
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
                          >
                            ADD FEATURES
                          </ActionButton>
                          <Dialog open={isDialogOpen} onClose={closeDialog}>
                            <DialogTitle>Add Feature</DialogTitle>
                            <DialogContent>
                              <TextField
                                label="Feature Name"
                                variant="outlined"
                                fullWidth
                                value={featureName}
                                onChange={handleFeatureNameChange}

                              />

                            </DialogContent>
                            <DialogActions>
                              <Button onClick={closeDialog} color="primary">
                                Cancel
                              </Button>
                              <Button onClick={saveNewFeature} color="primary">
                                Submit
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </div>
                      </div></div>
                    <AIPDataGrid onRowsSelectionHandler={() => { }} columns={jsonData.FeatureColumns} rows={FeatureRowsData} />
                    {/* You can render your table component here */}
                  </div>
                </div>
              )}
              {value === 3 && (
                <div>
                  <div className="tabsContainer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Tabs value={value} onChange={handleTabChange}>
                      <Tab label="USERS" className="tabLabel" />
                      <Tab label="ROLES" className="tabLabel" />
                      <Tab label="FEATURES" className="tabLabel" />
                      <Tab label="ROLE FEATURES" className="tabLabel" />
                      <Tab label="Site Settings" className="tabLabel" />
                    </Tabs>
                  </div>
                  <div className="divContent" >
                    <div className="divContentHeaderHolder">
                      <h2 style={{ fontSize: "20px", margin: "5px" }}>Role Features</h2>
                    </div>
                    {value === 3 && (
                      <TreeView
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                      >
                      </TreeView>
                    )}

                    <div style={{ marginTop: '15px' }} >
                      <TextField
                        label="Filter by Role"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        sx={{
                          "& .MuiInputBase-root": {
                            height: 50
                          }
                        }}
                      />
                      <button type="button" class="btn btn-primary float-right saveButtonLeft">Save</button>

                      {value === 3 && (

                        <div style={{ height: 650, width: '94%', marginTop: '15px' }}>

                          <DataGrid
                            rows={filteredData.length > 0 ? filteredData : transformedData}

                            columns={columns}
                            hideFooterPagination
                            hideFooterSelectedRowCount // Set pagination prop to false to hide pagination
                            disableColumnSelector

                          />
                        </div>

                      )}


                    </div>

                  </div>
                </div>
              )}
              {value === 4 && (
                <div>
                  <div className="tabsContainer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Tabs value={value} onChange={handleTabChange}>
                      <Tab label="USERS" className="tabLabel" />
                      <Tab label="ROLES" className="tabLabel" />
                      <Tab label="FEATURES" className="tabLabel" />
                      <Tab label="ROLE FEATURES" className="tabLabel" />
                      <Tab label="Site Settings" className="tabLabel" />
                    </Tabs>
                  </div>
                  <div className="divContent" >
                    <div className="divContentHeaderHolder">
                      <h2 style={{ fontSize: "20px", margin: "5px" }}>Site Settings</h2>
                    </div>


                    <div style={{ marginTop: '15px' }} >


                      {value === 4 && (

                        <div style={{ height: 650, width: '94%', marginTop: '15px' }}>

                          <div style={{ backgroundColor: '#f0f0f0', padding: '20px' }}>
                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Main Navigation</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div>
                                  <TextField
                                    label="Primary Color"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={primaryColor}
                                    onChange={handlePrimaryColorChange}
                                  />
                                  <TextField
                                    label="Secondary Color"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={secondaryColor}
                                    onChange={handleSecondaryColorChange}
                                  />
                                  <TextField
                                    label="Icon Color"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={iconColor}
                                    onChange={handleIconColorChange}
                                  />
                                  <button type="button" class="btn btn-primary float-top saveButtonRight">Save</button>

                                </div>
                              </AccordionDetails>
                            </Accordion>

                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Top Nav Bar</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div>
                                  Logo :
                                  <input
                                    accept="image/png"
                                    style={{ display: 'none' }}
                                    id="logo-upload-input"
                                    type="file"
                                    onChange={handleLogoUpload}
                                  />
                                  <label htmlFor="logo-upload-input">
                                    <IconButton color="primary" component="span">
                                      <CloudUploadIcon />
                                    </IconButton>
                                  </label>
                                  <TextField
                                    label="Primary Color(Recommended Contrast)"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={topNavBarPrimaryColor}
                                    onChange={handleTopNavBarPrimaryColorChange}
                                  />
                                  <TextField
                                    label="Icon Colors"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={topNavBarIconColor}
                                    onChange={handleTopNavBarIconColorChange}
                                  />
                                  <button type="button" class="btn btn-primary float-top saveButtonRight">Save</button>
                                </div>
                              </AccordionDetails>
                            </Accordion>

                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Header</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div>
                                  <TextField
                                    label="Primary Color (Radial Gradient)"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={headerPrimaryColor}
                                    onChange={handleHeaderPrimaryColorChange}
                                  />
                                  <FormControl variant="outlined" fullWidth margin="normal">
                                    <InputLabel htmlFor="header-font">Fonts</InputLabel>
                                    <Select
                                      label="Fonts"
                                      value={headerFont}
                                      onChange={handleHeaderFontChange}
                                      inputProps={{
                                        name: 'headerFont',
                                        id: 'header-font',
                                      }}
                                    >
                                      <MenuItem value="Arial">Arial</MenuItem>
                                      <MenuItem value="Helvetica">Helvetica</MenuItem>
                                      <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                                      {/* Add more font options as needed */}
                                    </Select>
                                  </FormControl>
                                  <button type="button" class="btn btn-primary float-top saveButtonRight">Save</button>
                                </div>
                              </AccordionDetails>
                            </Accordion>
                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Background Color</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div>
                                  <TextField
                                    label="Recommended Light Colors"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={backgroundColorRecommendations}
                                    onChange={handleBackgroundColorRecommendationsChange}
                                  />
                                  <button type="button" class="btn btn-primary float-top saveButtonRight">Save</button>
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        </div>

                      )}


                    </div>

                  </div>
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

          </div> </div></>}
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

      {loading && <div className="spinnerWrapper"><Spinner /></div>}
    </>
  );

};
<div className="memberTableWrapper">
  {/* <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Users</h2> */}
  <Table>
    <thead>
      <tr key="ix">
        <th style={{ paddingLeft: "8px" }}><span>USERNAME</span><ArrowDropDownOutlinedIcon /></th>
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
            <td>{props.idTokenClaims.email ?? props.idTokenClaims.signInName}</td>
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
            ).then(response => {
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