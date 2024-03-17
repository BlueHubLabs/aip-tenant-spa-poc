import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import UploadIcon from '@mui/icons-material/CloudUploadOutlined';
import './styles.css';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { propTypes } from 'react-bootstrap/esm/Image';

const FileUploadButton = (props) => {
    const {
        onChange,
        disabled,
        label,
        name,
        defaultFile,
        clearFile,
        isImage,
        fromWhiteLabeling,
        pdffileonly,
        PDFWarningMessage,
        errormessage,
        isSize,
        profilePhotoValidation
    } = props;

    const [file, setFile] = useState(null);

    const handleFileChange = (ev) => {
        const { name, files } = ev.target;
    
        if (files?.length > 0) {
            const file = files[0];
            if (isImage) {
                const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

                if (!allowedImageTypes.includes(file.type)) {
                    console.error('Invalid file type. Please upload a JPEG, JPG, or PNG file.');
                    return;
                }
                if (file.size > profilePhotoValidation.maxSize) {
                    console.error(`File size exceeds the maximum allowed (${profilePhotoValidation.maxSize / (1024 * 1024)} MB).`);
                    return;
                  }
            } else
            if (pdffileonly && file?.type !== 'application/pdf') {
                console.error('Invalid file type. Please upload a PDF file.');
                PDFWarningMessage();
                return;
            }
    
            setFile(URL.createObjectURL(file));
            onChange(name, file);
        }
    };
    

    const handleClearFile = () => {
        debugger
        setFile(null);
        onChange(name, null);
    }

    useEffect(() => {
        
        if (clearFile) {
            setFile(null);
        } else if (defaultFile) {
            if (isImage) {
                if (typeof defaultFile === "object") {
                    setFile(URL?.createObjectURL(defaultFile))
                }
                else {
                    setFile(defaultFile)
                }
            }
            else {
                setFile(defaultFile);
            }
        }
    }, [clearFile, defaultFile]);

    const handleWrapperClick = () => {
        !file && document.getElementById(`${name}_fileupload`).click();
    };

    return (
        <div >
        <div
            className={`fileUploadButton ${disabled && 'fileInputDisabled'}`}
            onClick={handleWrapperClick}
        >
            {file
                ? (<div className='previewWrapper'>
                    {
                        isImage
                            ? <img src={file} alt="Preview" className= {isSize ?"addUserProfile" : "file-preview"} />
                            : <div className='upload-preview'>{file?.name}</div>
                    }
                    {(fromWhiteLabeling || (typeof defaultFile === "object")) && <CloseOutlinedIcon
                        onClick={handleClearFile}
                    />}
                </div>
                )
                : (
                    <>
                        <UploadIcon />
                        {
                             isImage ?
                             <input
                                 className='inputfile'
                                 id={`${name}_fileupload`}
                                 type="file"
                                 name={name}
                                 onChange={handleFileChange}
                                 accept=".jpeg, .jpg, .png" 
                                 hidden
                             />
                             :
                            pdffileonly ?
                                <input
                                    className='inputfile'
                                    id={`${name}_fileupload`}
                                    type="file"
                                    name={name}
                                    onChange={handleFileChange}
                                    accept=".pdf"
                                    hidden
                                />
                                :
                                <div>
                                <input
                                    className='inputfile'
                                    id={`${name}_fileupload`}
                                    type="file"
                                    name={name}
                                    onChange={handleFileChange}
                                    aria-errormessage={errormessage}
                                    hidden
                                />
                                
                                </div>
                        }          
                        <label>{label || 'Upload Document'}</label>
                    </>
                )
            }
            
        </div>
        {errormessage && <p className='errorMessage' style={{marginLeft: '20px' }}>{errormessage}</p>}
        </div>
    );
};

FileUploadButton.propTypes = {
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    defaultFile: PropTypes.string,
    clearFile: PropTypes.bool,
    isImage: propTypes.bool,
    fromWhiteLabeling: propTypes.bool,
    pdffileonly: propTypes.bool,
    isSize:propTypes.bool,
    profilePhotoValidation: PropTypes.shape({
        maxSize: PropTypes.number.isRequired,
      }).isRequired,
    };

FileUploadButton.defaultProps = {
    disabled: false,
    label: "upload",
    defaultFile: null,
    clearFile: false,
    isImage: false,
    fromWhiteLabeling: false,
    pdffileonly: false,
    isSize:false,
    profilePhotoValidation: {
        maxSize: 2 * 1024 * 1024, // Default max size is 2 MB
      },
};

export default FileUploadButton;
