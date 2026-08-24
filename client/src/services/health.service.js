import api from '../lib/axios.js'

const healthService = {
    check:async()=>{
        const response = await api.get('/health');

        return response.data;
    }
}

export default healthService