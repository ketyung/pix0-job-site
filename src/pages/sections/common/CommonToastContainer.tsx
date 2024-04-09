import {ToastContainer} from 'react-toastify';
import { useThemeContext } from "pix0-core-ui";
import 'react-toastify/dist/ReactToastify.css';

export default function CommonToastContainer () {
    const {theme} = useThemeContext();

    return  <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{minWidth:"360px"}}
        theme={theme.mode}/>
}