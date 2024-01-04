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
    } = props;

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        
        onChange(value);
    };

    const renderMenuItems = () => {
        return (
            options &&
            options.length &&
            options.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
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
            /* size="small" */
            fullWidth
            label={label}
            onChange={handleChange}
            name={name}
            InputProps={
                type === 'number' ? {
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                } : {}}
            InputLabelProps={{
                shrink: true,
                focused: true,
            }}
            select={type === 'select'}
        >
            {type === 'select' && renderMenuItems()}
        </TextField>
    );
};

TextInput.propTypes = {
    type: propTypes.oneOf(['text', 'password', 'number', 'search', 'select']),
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
    editable: propTypes.bool,
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
    editable: true, // Set a default value for editable
};

export default TextInput;