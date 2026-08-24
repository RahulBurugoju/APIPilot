import api from "../lib/axios";

const register = async(payload)=>{
    const {name,email,password} = payload;

    const response = await api.post("/auth/register",{name,email,password});
    return response.data;
}

const login = async(payload)=>{
    const {email,password} = payload
    const response = await api.post('/auth/login',{email,password})
    return response.data;
}

const logout = async()=>{
    const response = await api.post("/auth/logout");

    return response.data;
}

const getme = async()=>{
    const response = await api.get("/auth/me")
    return response.data;
}

const refreshTokens = async()=>{
    const response = await api.post("/auth/refresh-token")
    return response.data;
}

export const authService = {
    register,
    login,
    logout,
    getme,
    refreshTokens
}