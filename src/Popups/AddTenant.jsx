import React, { useEffect } from 'react'
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, Button, MenuItem } from '@mui/material';
import TextInput from '../common/TextInput';
import { useState } from 'react';
import FileUploadButton from '../common/FileUploadButton';
import ActionButton from '../common/ActionButton';
import { regulatorDropdown, FirmTypeDropdown, FirmInformationDropdown } from './data';
import { getFirmStructureDetails } from './services/services';
import { getRegulatoryComplianceDetails } from './services/services';
import { getFirmTypeDetails } from './services/services';
import { get } from 'jquery';
import { regulatorOptions } from './enum';
import { postTenantUser } from './services/services';

const AddTenant = (props) => {

  const { open, onClose } = props;
  /*  const [open,setOpen] = useState(true); */

  const initialDetails = {
    firmName: '',
    firmType: '',
    firmLogo: '',
    firmID: '',
    firmRegistrationNumber: '',
    regulatoryBody: '',
    firmDescription: '',
    address: '',
    websiteURL: '',
    firmJurisdiction: '',
    firmStructure: '',
    otherregulatoryBody: ''
  };

  const [loading, setLoading] = useState(false);

  const [firmDetails, setFirmDetails] = useState(initialDetails);

  //onCancel
  const onCancel = () => {
    setErrors({});
    onClose();
  };

  //Validations
  const [errors, setErrors] = useState({});

  const MandatoryFieldErrors = () => {
    const fieldsToKeep = ['firmName', 'firmType', 'firmLogo', 'regulatoryBody', 'firmDescription', 'firmStructure'];
    const trimmedValues = { ...firmDetails };

    const filteredFields = fieldsToKeep.map((field) => {
      if (trimmedValues.hasOwnProperty(field)) {
        return { field, value: trimmedValues[field] };
      }
      return null;
    }).filter(Boolean);

    const Mandatory = filteredFields.map(({ field, value }) => ({
      field,
      value: value === "" ? null : value,
    }));

    console.log(Mandatory);
    const EmptyFields = Mandatory.filter(entry => entry.value === "" || entry.value === null).map(entry => entry.field);
    const error = `This field is required.`;
    // debugger
    EmptyFields.length > 0 && EmptyFields.map((item) => {
      // debugger         
      setErrors(prevErrors => ({ ...prevErrors, [item]: error }));
    })
  };

  const validateField = (field, value) => {
    const validationRules = {
      firmName: (value) => {
        const isValid = /^[A-Za-z]+$/.test(value);
        const isLengthValid = value.length >= 1 && value.length <= 50;
        return {
          isValid: isValid && isLengthValid,
          error: isValid && isLengthValid ? null : "Please enter a valid firm name (1-50 characters without spaces)."
        };
      },
      firmType: (value) => {
        const isNotEmpty = value !== "";
        return {
          isValid: isNotEmpty,
          error: isNotEmpty ? null : "Please select a firm type"
        };
      },
      firmID: (value) => {
        value = value.trim();
        const isValid = /^[A-Za-z0-9]+$/.test(value);
        const isLengthValid = value.length >= 1 && value.length <= 20;
        return {
          isValid: isValid && isLengthValid,
          error: isValid && isLengthValid ? null : "Please enter a valid firm ID (1-20 characters).",
        };
      },
      //For Regulator Body When Clicked others
      /* regulatoryBody: (value) => {
        const isNotEmpty = value.trim() !== "";
        return {
          isValid: isNotEmpty,
          error: isNotEmpty ? null : "Please select a firm type"
        };
      }, */
      regulatoryBody: (value) => {
        const isNotEmpty = value !== "";
        return {
          isValid: isNotEmpty,
          error: isNotEmpty ? null : "Please select a firm type"
        };
      },
      firmDescription: (value) => {
        value = value.trim();
        const isValid = value.length >= 1 && value.length <= 200;
        return {
          isValid: isValid,
          error: isValid ? null : "Please complete firm description (1-200 characters).",
        };
      },
      firmStructure: (value) => {
        const isNotEmpty = value !== "";
        return {
          isValid: isNotEmpty,
          error: isNotEmpty ? null : "Please select a firm structure"
        };
      },
    };
    return validationRules[field] ? validationRules[field](value) : { isValid: true, error: null };
  };

  const handleChange = (field, value) => {
    const validationResult = validateField(field, value);
    if (!validationResult.isValid) {
      setErrors(prevErrors => ({ ...prevErrors, [field]: validationResult.error }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, [field]: null }));
      setFirmDetails({
        ...firmDetails,
        [field]: value
      });
    }
  }

  const handleFileUpload = (name, file) => {
    if (file) {
      const formData = new FormData();
      formData.append(name, file, file.name);
      handleChange(name, file);
    }
  }

  const [firmStructureDropdown, setFirmStructureDropdown] = useState([]);

  const getFirmStructure = async () => {
    //write axios get call here
    const response = await getFirmStructureDetails();
    debugger
    if (!response.error) {
      setFirmStructureDropdown(response.data);
    }
    else {
      console.log('Error in fetching Firm Structure');
    }
  }

  const [regulatorDropdown, setRegulatorDropdown] = useState([]);
  const [otherOptionID, setOtherOptionID] = useState("");

  const getRegulatoryCompliance = async () => {
    //write axios get call here
    const response = await getRegulatoryComplianceDetails();
    if (!response.error) {
      setRegulatorDropdown(response.data);
      const otherOption = response.data.find(item => item.listItemValue === regulatorOptions.OTHER_OPTION);
      setOtherOptionID(otherOption.listItemID);
    }
    else {
      console.log('Error in fetching Regulatory Compliance');
    }
  }

  const [FirmTypeDropdown, setFirmTypeDropdown] = useState([]);

  const getFirmType = async () => {
    //write axios get call here
    const response = await getFirmTypeDetails();
    if (!response.error) {
      setFirmTypeDropdown(response.data);
    }
    else {
      console.log('Error in fetching Firm Type');
    }
  }

  useEffect(() => {
    getFirmStructure();
    getRegulatoryCompliance();
    getFirmType();
  }, []);

  const handleSubmit = () => {
     
    setLoading(true);
    const requestBody =
      {
        "firmId": 0,
        "firmName": firmDetails.firmName,
        "firmTypeId": firmDetails.firmType,
        "firmLogo": "",
        "registrationNumber": "",
        "regulatoryComplianceStatusId": firmDetails.regulatoryBody,
        "firmDescription": firmDetails.firmDescription,
        "website": firmDetails.websiteURL,
        "jurisdiction": firmDetails.firmJurisdiction,
        "firmStructureId": firmDetails.firmStructure,
        "firmAddress": firmDetails.address,
        "tenantGUID": "",
        "regulatoryComplianceOtherStatus": firmDetails.otherregulatoryBody,
      }

      const includedFields = ['firmName', 'firmType', 'regulatoryBody', 'firmDescription', 'firmStructure'];

      const Mandatoryerrors = Object.entries(requestBody).some(([key, value]) =>
        includedFields.includes(key) && (value === null || value === '' || value === 0)
      );
  

    const errorsArray = Object.values(errors);
    const hasErrors = errorsArray.some(error => error !== null);

    
    if (Mandatoryerrors || hasErrors) {
      console.error("Error updating profile:", errors);
      MandatoryFieldErrors();
      /*  toast.warning("Please fill Mandatory Values", {
         position: toast.POSITION.BOTTOM_RIGHT,
         theme: "colored",
       }); */
    } else {
      const formData = new FormData();
      formData.append('tenant', JSON.stringify(requestBody) );
      formData.append('firmFile', firmDetails.firmLogo);
      const apiResponse = postTenantUser(formData);
      if (apiResponse.error) {
        console.log('Error in posting Tenant User');
      }
      else {
        console.log('Tenant User posted successfully');
      }
      setLoading(false);
      onClose();
    }
  }



  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        Add Tenant
      </DialogTitle>
      <DialogContent>
        <div className='margin-top-15'>
          <FileUploadButton
            name="firmLogo"
            label='ICON'
            onChange={(name, value) => handleFileUpload(name, value)}
            isImage={true}
            defaultFile={firmDetails.firmLogo}
            fromWhiteLabeling={true}
            isSize={true} />
        </div>
        <div className='margin-top-15'>
          <TextInput
            type="text"
            name="firmName"
            label="Firm Name"
            value={firmDetails.firmName}
            required={true}
            onChange={(name, value) => handleChange(name, value)}
            errormessage={errors.firmName || undefined}
          />
        </div>
        <div className='margin-top-15'>
          <TextInput
            type="select"
            name="firmType"
            label="Firm Type"
            options={FirmTypeDropdown
              ? FirmTypeDropdown?.map(option => ({ label: option?.listItemValue, value: option?.listItemID }))
              : []
            }
            value={firmDetails.firmType}
            required={true}
            onChange={(name, value) => handleChange(name, value)}
            errormessage={errors.firmType || undefined}
          />
        </div>
        <div className='margin-top-15'>
          <TextInput
            type="select"
            name="regulatoryBody"
            label="Regulatory Body"
            options={regulatorDropdown
              ? regulatorDropdown?.map(option => ({ label: option?.listItemValue, value: option?.listItemID }))
              : []
            }
            value={firmDetails.regulatoryBody}
            required={true}
            onChange={(name, value) => handleChange(name, value)}
            errormessage={errors.regulatoryBody || undefined}
          />
        </div>
        {
          firmDetails.regulatoryBody === otherOptionID && <div className='margin-top-15'>
            <TextInput
              type="text"
              name="otherregulatoryBody"
              label="Other Option"
              value={firmDetails.otherregulatoryBody}
              required={true}
              onChange={(name, value) => handleChange(name, value)}
              errormessage={errors.otherregulatoryBody || undefined}
            />
          </div>
        }
        <div className='margin-top-15'>
          <TextInput
            type="text"
            name="firmDescription"
            label="Firm Description"
            value={firmDetails.firmDescription}
            required={true}
            onChange={(name, value) => handleChange(name, value)}
            errormessage={errors.firmDescription || undefined}
          />
        </div>
        <div className='margin-top-15'>
          <TextInput
            type="text"
            name="address"
            label="Address"
            value={firmDetails.address}
            onChange={(name, value) => handleChange(name, value)}
          />
        </div>
        <div className='margin-top-15'>
          <TextInput
            type="text"
            name="websiteURL"
            label="Website URL"
            value={firmDetails.websiteURL}
            onChange={(name, value) => handleChange(name, value)}
          />
        </div>
        <div className='margin-top-15'>
          <TextInput
            type="text"
            name="firmJurisdiction"
            label="Firm Jurisdiction"
            value={firmDetails.firmJurisdiction}
            onChange={(name, value) => handleChange(name, value)}
          />
        </div>
        <div className='margin-top-15'>
          <TextInput
            type="select"
            name="firmStructure"
            label="Firm Structure"
            options={firmStructureDropdown
              ? firmStructureDropdown?.map(option => ({ label: option?.listItemValue, value: option?.listItemID }))
              : []
            }
            value={firmDetails.firmStructure}
            required={true}
            onChange={(name, value) => handleChange(name, value)}
            errormessage={errors.firmStructure || undefined}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <ActionButton variant="outlined" className="btn-primary" onClick={onCancel} label="Cancel" />
        <ActionButton variant="contained" className="btn-primary" onClick={handleSubmit} label="Submit" />
      </DialogActions>
    </Dialog>
  )
}

export default AddTenant