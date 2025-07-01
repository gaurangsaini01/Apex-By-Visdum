import axios from "axios"
import {AUTH_ENDPOINTS} from "../apis" 
export async function login (){
    try {
        const res = await axios.post('/login')
    } catch (error) {
        
    }
}