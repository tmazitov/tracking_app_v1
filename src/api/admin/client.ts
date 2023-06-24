import axios from 'axios'
import responseInterceptor from '../responseInterceptor';
import requestInterceptor from '../requestInterceptor';

const admClient = axios.create({
    baseURL: "/adm/api",
    timeout: 3000,
});

admClient.interceptors.request.use(
    requestInterceptor.onFulfilled,
    requestInterceptor.onRejected,
)


admClient.interceptors.response.use(
    responseInterceptor.onFulfilled, 
    responseInterceptor.onRejected
)

export default admClient