import React from 'react'
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, Button, MenuItem } from '@mui/material';
import TextInput from '../common/TextInput';
import { useState } from 'react';
import FileUploadButton from '../common/FileUploadButton';
import ActionButton from '../common/ActionButton';
import { regulatorDropdown,FirmTypeDropdown,FirmInformationDropdown } from './data';

const AddTenant = (props) => {

  const {open,onClose} = props;
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
    firmStructure: ''
  };

  const [loading,setLoading] = useState(false);

  const [firmDetails, setFirmDetails] = useState(initialDetails);
  const [isSaveEnabled, setisSaveEnabled] = useState(false);

  //onEditSaveButtonClick
  const onEditSaveButtonClick = () => {
    if(isSaveEnabled){
      handleSave();
      return
    }
     setisSaveEnabled(!isSaveEnabled);
   };

   //onCancel
   const onCancel = () => { 
    setisSaveEnabled(false);
    setErrors({});
   };

   //Validations
 const [errors, setErrors] = useState({});

  const MandatoryFieldErrors = () => {
    const fieldsToKeep =['firmName', 'firmType', 'firmLogo', 'firmID', 'firmRegistrationNumber', 'regulatoryBody', 'firmDescription', 'address', 'websiteURL', 'firmJurisdiction', 'firmStructure'];
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
      firmName: (value, currState) => {
        const isValid = /^[A-Za-z ]+$/.test(value);
        return {
          isValid,
          error: isValid ? null : `Please Enter a valid name with only alphabets`
        };
      },
      phoneNo: (value, currState) => {
        value = value.trim();
        const isValid = /^\d{10}$/.test(value);
        return {
          isValid,
          error: isValid ? null : "Please enter a valid phone number (up to 10 digits)",
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

const handleSave = () => {
  MandatoryFieldErrors();
};

  return (
    <Dialog open={true} onClose={onClose} fullWidth>
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
                    onChange={(name, value) => handleChange(name, value)}
                    errormessage={errors.firmName || undefined}
                />
            </div>
            <div className='margin-top-15'>
                <TextInput
                    type="select"
                    name="firmType"
                    label="Firm Type"
                    options={FirmTypeDropdown?.map(option => ({ label: option?.name, value: option?.value }))}
                    value={firmDetails.firmType}
                    onChange={(name, value) => handleChange(name, value)}
                    errormessage={errors.firmType || undefined}
                />
            </div>
            <div className='margin-top-15'>
                <TextInput
                    type="text"
                    name="firmID"
                    label="Firm ID"
                    value={firmDetails.firmID}
                    onChange={(name, value) => handleChange(name, value)}
                    errormessage={errors.firmID || undefined}
                />
            </div>
            {/* <div className='margin-top-15'>
                <TextInput
                    type="text"
                    name="firmRegistrationNumber"
                    label="Firm Registration Number"
                    value={firmDetails.firmRegistrationNumber}
                    onChange={(name, value) => handleChange(name, value)}
                    errormessage={errors.firmRegistrationNumber || undefined}
                />
            </div> */}
            <div className='margin-top-15'>
                <TextInput
                    type="select"
                    name="regulatoryBody"
                    label="Regulatory Body"
                    options={regulatorDropdown?.map(option => ({ label: option?.name, value: option?.value }))}
                    value={firmDetails.regulatoryBody}
                    onChange={(name, value) => handleChange(name, value)}
                    errormessage={errors.regulatoryBody || undefined}
                />
            </div>
            {
                firmDetails.regulatoryBody === 5 && <div className='margin-top-15'>
                    <TextInput
                        type="text"
                        name="regulatoryBody"
                        label="Other Option"
                        value={firmDetails.firmRegistrationNumber}
                        onChange={(name, value) => handleChange(name, value)}
                        errormessage={errors.firmRegistrationNumber || undefined}
                    />
                </div>
            }
            <div className='margin-top-15'>
                <TextInput
                    type="text"
                    name="firmDescription"
                    label="Firm Description"
                    value={firmDetails.firmDescription}
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
                    errormessage={errors.address || undefined}
                />
            </div>
            <div className='margin-top-15'>
                <TextInput
                    type="text"
                    name="websiteURL"
                    label="Website URL"
                    value={firmDetails.websiteURL}
                    onChange={(name, value) => handleChange(name, value)}
                    errormessage={errors.websiteURL || undefined}
                />
            </div>
            <div className='margin-top-15'>
                <TextInput
                    type="text"
                    name="firmJurisdiction"
                    label="Firm Jurisdiction"
                    value={firmDetails.firmJurisdiction}
                    onChange={(name, value) => handleChange(name, value)}
                    errormessage={errors.firmJurisdiction || undefined}
                />
            </div>
            <div className='margin-top-15'>
                <TextInput
                    type="select"
                    name="firmStructure"
                    label="Firm Structure"
                    options={FirmInformationDropdown?.map(option => ({ label: option?.name, value: option?.value }))}
                    value={firmDetails.firmStructure}
                    onChange={(name, value) => handleChange(name, value)}
                    errormessage={errors.firmStructure || undefined}
                />
            </div>
        </DialogContent>
        <DialogActions>
            <ActionButton variant="outlined" className="btn-primary" onClick={()=>{}} label="Cancel" />
            <ActionButton variant="contained" className="btn-primary" onClick={handleSave} label="Submit" />
        </DialogActions>
    </Dialog>
  )
}

export default AddTenant