import CircularProgress from '@mui/joy/CircularProgress';
import './spinner.css';

const Spinner = () => {
    return(
        <div className='loadingWrapper'>
            <CircularProgress/>
        </div>
    )
}

export default Spinner;