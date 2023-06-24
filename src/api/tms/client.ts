import axios from 'axios'
import responseInterceptor from '../responseInterceptor';
import requestInterceptor from '../requestInterceptor';

const tmsClient = axios.create({
    baseURL: "/tms/api",
    timeout: 3000,
});

tmsClient.interceptors.request.use(
    requestInterceptor.onFulfilled,
    requestInterceptor.onRejected,
)


tmsClient.interceptors.response.use(
    responseInterceptor.onFulfilled, 
    responseInterceptor.onRejected
)

export default tmsClient