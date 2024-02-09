import React from 'react';
import TextField from '@mui/material/TextField';
import propTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
const TextInput = (props) => {
    const {
        type,
        onChange,
        variant,
        required,
        multiline,
        defaultValue,
        placeholder,
        rows,
        label,
        options,
        name,
        editable,
        symbol,
        errormessage,
        tabIndex,
        charactersMaxLength,
    } = props;
    const handlePaste = (event) => {
        const maxLength = charactersMaxLength;
        const pastedText = event.clipboardData.getData('text/plain');
        let truncatedText = pastedText.substring(0, maxLength);
        switch (props.type) {
            case 'Onlytext':
                truncatedText = truncatedText.replace(/[^a-zA-Z\s]/g, '');
                break;
            case 'number':
                truncatedText = truncatedText.replace(/[^0-9]/g, ''); // Allow only numbers
                break;
            case 'phoneNumber':
                truncatedText = truncatedText.replace(/[^0-9]/g, ''); // Allow only numbers for phone number
                truncatedText = truncatedText.substring(0, 10); // Limit to 10 characters for phone number
                break;
            case 'numberwithoutsymbol':
                truncatedText = truncatedText.replace(/[^0-9+-]/g, ''); // Allow only numbers, +, and -
                break;
            case 'zipcode':
                truncatedText = truncatedText.replace(/[^0-9]/g, ''); // Allow only numbers for phone number
                truncatedText = truncatedText.substring(0, 5); // Limit to 10 characters for phone number
                break;
            case 'textwithcharlimit':
                truncatedText = truncatedText.replace(/[^a-zA-Z\s]/g, '');
                break;    
            case 'numberwithcharlimit':
                truncatedText = truncatedText.replace(/[^0-9+-]/g, ''); // Allow only numbers, +, and -
                break;
            // Add more cases as needed
            default:
                break;
        }

        document.execCommand('insertText', false, truncatedText);

        event.preventDefault();
    };
    const handleChange = (ev) => {
        const { name, value } = ev.target;
        onChange(name, value);
    };
    const onKeyPressDown = (event, type) => {
        if (type === "Onlytext") {
            const allowedCharacters = /^[a-zA-Z\s]+$/;
            if (!allowedCharacters.test(event.key)) {
                event.preventDefault();
            }
        }
        if (type === "numberwithoutsymbol") {
            if (event.keyCode === 8) {
                return;
            }
            const allowedNumbers = /^[0-9]+$/;
            if (!allowedNumbers.test(event.key) && event.key !== '+' && event.key !== '-') {
                event.preventDefault();
            }
        }
    };

    const charactermaxLimit = (event, type) => {

        // Allow backspace (keyCode 8) and tab (keyCode 9)
        if (event.keyCode === 8 || event.keyCode === 9) {
          return;
        }
      
        if (type === "textwithcharlimit") {
          const allowedCharacters = /^[a-zA-Z\s]+$/;
          if (!allowedCharacters.test(event.key) || event.target.value.length >= charactersMaxLength) {
            event.preventDefault();
          }
        }
      
        if (type === "numberwithcharlimit") {
          const allowedNumbers = /^[0-9]+$/;
          if (
            (!allowedNumbers.test(event.key) && event.key !== '+' && event.key !== '-') ||
            event.target.value.length >= charactersMaxLength
          ) {
            event.preventDefault();
          }
        }

        if (type === "onlycharlimit") {
            if (
              event.target.value.length >= charactersMaxLength
            ) {
              event.preventDefault();
            }
          }
      };
      

    const characterLimit = (event, type) => {
        if (type === "limit") {
            const maxLength = 100;
            if (event.keyCode === 8) {
                return;
            }
            if (event.target.value.length >= maxLength) {
                event.preventDefault();
            }
        }
    };
    const onlyNumber = (event, type) => {
        if (event.keyCode === 8) {
            return;
        }
        if (type === "number" || type === "Dollarformat") {
            if (event.key === "e" || event.key === "E") {
                event.preventDefault();
                return;
            }
            const allowedNumbers = /^[0-9]+$/;
            const inputValue = event.target.value + event.key;

            if (!allowedNumbers.test(event.key) || parseInt(inputValue, 10) <= 0) {
                event.preventDefault();
            }
        }
    
    };
    const phoneNumber = (event, type) => {
        if (type === "phoneNumber") {
            const maxLength = 10;
            if (event.keyCode === 8) {
                return;
            }
            const isNumber = /^[0-9]$/.test(event.key);
            if (!isNumber) {
                event.preventDefault();
            }
            if (event.target.value.length + 1 > maxLength) {
                event.preventDefault();
            }
        }
    };

    const zipCode = (event, type) => {
        if (type === "zipcode") {
            const maxLength = 20;
            if (event.keyCode === 8) {
                return;
            }
            const isNumber = /^[0-9-]$/.test(event.key);
            if (!isNumber) {
                event.preventDefault();
            }
            if (event.target.value.length + 1 > maxLength) {
                event.preventDefault();
            }
        }
    };

    const onlyPercent = (event, type) => {
        if (type === "percentage") {
            if (event.keyCode === 8) {
                return;
            }
            const maxLength = 7;
            const inputValue = event.target.value;
            const isNumber = /^\d+(\.\d{0,4})?$/.test(inputValue + event.key);

            if (!isNumber || inputValue.length + 1 > maxLength) {
                event.preventDefault();
            }
        }
    };
    const renderMenuItems = () => {
        return (
            options &&
            options.length &&
            options.map(({ label, value, isdisabled }) => (
                <MenuItem key={value} value={value} disabled={isdisabled}>
                    {label}
                </MenuItem>
            ))
        );
    };


    return (
        <TextField
            required={required}
            disabled={!editable}
            defaultValue={defaultValue}
            variant={multiline ? 'outlined' : variant}
            type={type}
            placeholder={placeholder}
            multiline={multiline}
            rows={rows}
            size={multiline ? 'large' : "small"}
            fullWidth
            label={label}
            onChange={handleChange}
            onKeyDown={(event) => {
                onKeyPressDown(event, type);
                onlyPercent(event, type);
                characterLimit(event, type);
                phoneNumber(event, type);
                onlyNumber(event, type);
                zipCode(event,type);
                charactermaxLimit(event,type);
            }}
            onPaste={handlePaste}
            name={name} 
            inputProps={
                {
                    tabIndex : tabIndex, 
                    maxLength:charactersMaxLength,
                }}
            InputProps={
                {
                    startAdornment: type === 'number' || type === 'percentage' || type === 'phoneNumber' || type === 'Dollarformat' ? 
                                    <InputAdornment position="start">{symbol}</InputAdornment>
                                    : <></>
                }}
                InputLabelProps={{
                    shrink: true,
                    focused: true,
                }}
            select={type === 'select'}
            symbol={symbol}
            error={!!errormessage}
            helperText={errormessage || ""}
        >
            {type === 'select' && renderMenuItems()}
        </TextField>
    );
};


TextInput.propTypes = {
    type: propTypes.oneOf(['text', 'password', 'number', 'search', 'select', 'Onlytext', 'numberwithoutsymbol', 'percentage', 'limit', 'phoneNumber', 'number1']),
    onChange: propTypes.func.isRequired,
    variant: propTypes.oneOf(['standard', 'filled', 'outlined']),
    required: propTypes.bool,
    multiline: propTypes.bool,
    defaultValue: propTypes.string,
    placeholder: propTypes.string,
    rows: propTypes.number,
    label: propTypes.string,
    options: propTypes.array,
    name: propTypes.string,
    symbol: propTypes.string,
    editable: propTypes.bool,
    errormessage: propTypes.string,
    tabIndex: propTypes.number,
    charactersMaxLength : propTypes.number
};

TextInput.defaultProps = {
    type: 'text',
    variant: 'standard',
    required: false,
    multiline: false,
    defaultValue: '',
    placeholder: '',
    rows: 4,
    label: '',
    options: [],
    name: '',
    symbol: 'text',
    editable: true,
    errormessage: '',
    tabIndex: 0,
    charactersMaxLength : 100 //set based on your preference
};

export default TextInput;