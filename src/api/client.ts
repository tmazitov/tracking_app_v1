import axios, { AxiosError } from 'axios'
import Auth, { AccessTokenPairAPI } from './auth/auth';
import router from '../router/index'

const client = axios.create({
    baseURL: "/tms/api",
    timeout: 3000,
});

client.interceptors.request.use(
    (request) => {
        let access = AccessTokenPairAPI.getAccess()
        if (access)
            request.headers.Authorization = access

        return request
    },
    (error) => Promise.reject(error)
)

interface FailedRequest {
    reject:Function;
    resolve:Function;
}

let isRefreshing = false;
let updateRefreshing = (value:boolean) => isRefreshing = value 

let failedQueue:Array<FailedRequest> = [];

const processQueue = (error:AxiosError|null, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

client.interceptors.response.use(
    (response) => {
        console.info("response interceptor: OK : ", response.config.url)
        return response
    },
    (error) => {

        const originalRequest = error.config;
        let statusCode = error.response.status

        if (statusCode === 401 && !originalRequest._retry) {

            console.log("response interceptor: 401 : ", error.config.url);

            if (isRefreshing) {
                console.log("is refreshing");
                return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                    .then((accessToken) => {
                        originalRequest.headers.Authorization = accessToken
                        return axios(originalRequest);

                    })
                    .catch((err) => {
                        console.log("promise reject");
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refresh = AccessTokenPairAPI.getRefresh()
            return new Promise(function(resolve, reject) {
                axios
                    .post("/aaa/api/refresh", { refresh },{
                        headers: {
                            "Authorization" : AccessTokenPairAPI.getAccess()
                        }
                    })
                    .then((response) => {
                        let access = response.data['access']
                        let refresh = response.data['refresh']
						AccessTokenPairAPI.save(access, refresh)

                        originalRequest.headers.Authorization = access
                        processQueue(null, access);
                        resolve(axios(originalRequest));
                    })
                    .catch((err) => {
                        console.error("refresh token failed!");
                        processQueue(err, null);
                        reject(err);
                        
                        if (router.currentRoute.value.name != 'auth') {
                            console.log("router to /auth");
                            router.push({name:'auth'});
                        }
                    })
                    .finally(() => {
                        console.error("interceptor finally");
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
)

export {
    failedQueue,
    isRefreshing,
    updateRefreshing,
}

export default client