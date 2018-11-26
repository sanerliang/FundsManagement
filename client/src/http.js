import axios from 'axios';
import { Message, Loading } from 'element-ui';
import router from './router';

let loading;
function startLoading() {
    loading = Loading.service({
        lock: true,
        text: "拼命加载中...",
        background: 'rgba(0,0,0,0.7)'
    });
}
function endLoading() {
    loading.close();
}

// Request interception 
axios.interceptors.request.use(config => {
    // Loading Animation
    startLoading();

    if (localStorage.getItem("eleToken")) {
        // set request header
        config.headers.Authorization = localStorage.getItem("eleToken");
    }

    return config; 
}, err => {
    return Promise.reject(err);
})

// Response interception 
axios.interceptors.response.use(response => {
    // End Loading Animation
    endLoading();
    return response;
}, err => {
    // Error Message
    endLoading();
    Message.error(err.response.data);

    // Get error status code
    const { status } = error.response;
    if (status == 401) {
        localStorage.removeItem("eleToken");
        Message.error("Token失效，请重新登陆！");

        // Jump to login
        router.push('/login');
    }

    return Promise.reject(err);
})

export default axios;