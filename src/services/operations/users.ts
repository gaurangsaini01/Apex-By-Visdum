import axiosInstance from "../axiosInstance";

export async function getUsers(){
    try {
        const res = await axiosInstance.get('/users')
        if(res?.data?.success){
            return res?.data
        }
    } catch (error) {
        
    }
}