import { AxiosResponse, InternalAxiosRequestConfig } from "axios";

interface IResponseInterceptor {
    onFulfilled:(value:AxiosResponse<any, any>) => AxiosResponse<any, any>,
    onRejected:(error: any) => any
}

interface IRequestInterceptor {
    onFulfilled:(value:InternalAxiosRequestConfig<any>) => InternalAxiosRequestConfig<any>,
    onRejected:(error: any) => any
}

export type {
	IResponseInterceptor
}

export type {
	IRequestInterceptor
}
	