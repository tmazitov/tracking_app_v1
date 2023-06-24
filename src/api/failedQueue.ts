import { AxiosError } from "axios";

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

export {
	isRefreshing,
	updateRefreshing,
	failedQueue,
	processQueue
}