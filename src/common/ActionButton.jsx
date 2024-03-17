import Button from '@mui/material/Button';
import * as _ from '@mui/icons-material';
import propTypes from 'prop-types';
import './styles.css';
import LoadingButton from '@mui/lab/LoadingButton';
import { Tooltip } from '@mui/material';

const ActionButton = (props) => {

    const {
        href,
        onClick,
        variant,
        disabled,
        label,
        loading,
        startIconName,
        endIconName,
        styleProps,
        toolTip,
    } = props;

    const StartIconTag = _[`${startIconName}`];
    const EndIconTag = _[`${endIconName}`];

    const handleClick = () => {
        onClick();
    };

    return (
        <Tooltip title={toolTip}>
            <span>
                <LoadingButton
                    variant={variant}
                    href={href}
                    size="large"
                    startIcon={startIconName && <StartIconTag />}
                    endIcon={endIconName && <EndIconTag />}
                    loading={loading}
                    onClick={handleClick}
                    disabled={disabled}
                    loadingPosition="start"
                    // fullWidth
                    sx={styleProps}
                >
                    <p className={`actionButtonLabel`}>{label}</p>
                </LoadingButton>
            </span>
        </Tooltip>
    );
}

ActionButton.propTypes = {
    onClick: propTypes.func.isRequired,
    variant: propTypes.oneOf(['text', 'contained', 'outlined']),
    disabled: propTypes.bool,
    loading: propTypes.bool,
    label: propTypes.string,
    href: propTypes.string,
    startIconName: propTypes.string,
    endIconName: propTypes.string,
    styleProps: propTypes.object,
    toolTip: propTypes.string,
}

ActionButton.defaultProps = {
    variant: "contained",
    disabled: false,
    loading: false,
    label: "",
    href: "",
    startIconName: '',
    endIconName: '',
    styleProps: {},
    toolTip: '',
}

export default ActionButton;