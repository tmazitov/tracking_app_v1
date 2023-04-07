import axios from "axios"

const auth = axios.create({
    baseURL: "/aaa/api",
})

class AuthAPI {
	static async login(email:string){
		const response = await auth.post("/auth", {
			email: email
		})
		if (response.data["err"]){
			return response.data["err"]
		}
		CheckTokenAPI.save(response.data["token"])
	}

	static async sendCode(code:string){
		const response = await auth.post("/auth/code", {
			code: code,
			token: CheckTokenAPI.get()
		})

		if (response.data["err"]){
			return response.data["err"]
		}

		let access = response.data["access"]
		let refresh = response.data["refresh"]
		AccessTokenPairAPI.save(access, refresh)
		CheckTokenAPI.del()
	}
}

class CheckTokenAPI {
	static save(token:string){
		localStorage.setItem("check_token", token)
	}
	static get(){
		return localStorage.getItem("check_token")
	}
	static del(){
		localStorage.removeItem("check_token")
	}
}

class AccessTokenPairAPI {
	static save(access:string, refresh:string){
		localStorage.setItem("access_token", access)
		localStorage.setItem("refresh_token", refresh)
	}
	static getAccess(){
		return localStorage.getItem("access_token")
	}
	static getRefresh(){
		return localStorage.getItem("refresh_token")
	}
	static delAccess(){
		return localStorage.removeItem("access_token")
	}
	static delRefresh(){
		return localStorage.removeItem("refresh_token")
	}
}

export {
	AccessTokenPairAPI,
}
export default AuthAPI