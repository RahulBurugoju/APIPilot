const buildRequestUrl  = ({baseUrl,reqUrl})=>{
    if(!reqUrl){
        throw new Error("Request url is required");
    }

    if(reqUrl.startsWith("http://") || reqUrl.startsWith("https://") ){
        return reqUrl;
    }

    if(!baseUrl){
        throw new Error("Base url is required");
    }

    const cleanReq = reqUrl.replace(/^\//,"" )
    const cleanBase = baseUrl.replace(/\/$/,"" )
    return `${cleanBase}/${cleanReq}`;
}

export default buildRequestUrl;