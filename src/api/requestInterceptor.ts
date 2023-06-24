import { AccessTokenPairAPI } from "./auth/auth"
import { IRequestInterceptor } from "./interceptor"

const requestInterceptor:IRequestInterceptor = {
    onFulfilled : (request) => {
        let access = AccessTokenPairAPI.getAccess()
        if (access)  request.headers.Authorization = access
           
        return request
    },
    onRejected : (error:any) => Promise.reject(error)
}

export default requestInterceptor