import axios, { AxiosError, AxiosResponse } from "axios";
import router from "@/router";
import { AccessTokenPairAPI } from "./auth/auth";
import { failedQueue, isRefreshing, processQueue, updateRefreshing } from "./failedQueue";
import { IResponseInterceptor } from "./interceptor";

const responseInterceptor:IResponseInterceptor = {
	onFulfilled : (response:AxiosResponse<any, any>) => {
        console.info("response interceptor: OK : ", response.config.url)
        return response
    },
	onRejected : (error:any) => {
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
            updateRefreshing(true)

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
                        updateRefreshing(false)
                    });
            });
        }

        return Promise.reject(error);
	}
}

export default responseInterceptor