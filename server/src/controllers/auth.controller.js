import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  clearAccessTokenCookieOptions,
  clearRefreshTokenCookieOptions,
} from "../config/cookie.config.js";
import { ApiError } from "../utils/ApiError.js";

export const registerController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const dbResponse = await registerUser({ name, email, password });
  const { user, accessToken, refreshToken } = dbResponse;

  return res
    .status(201)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(new ApiResponse(200, user, "User registered successfully"));
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const dbResponse = await loginUser({ email, password });

  const { user, accessToken, refreshToken } = dbResponse;

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(new ApiResponse(200, user, "User login successfully"));
});

export const getMeController = asyncHandler(async(req,res)=>{
    const userId = req.user?.Id
    
    const dbResponse = await getCurrentUser(userId)

    const {user} = dbResponse;
    
    return  res.status(200).json(new ApiResponse(200,user,"User fetched successfully")) 

})


export const logoutController = asyncHandler(async(req,res)=>{

    const userId = req?.user?.Id;

    const dbResponse = await logoutUser(userId);

    if(!dbResponse.success){
        throw new ApiError(400,"logout failed")
    }

    return res
        .status(200)
      .clearCookie("accessToken",clearAccessTokenCookieOptions)
        .clearCookie("refreshToken",clearRefreshTokenCookieOptions)
        .json(new ApiResponse(200,{},"User logged out successfully"))   

})

export const refreshTokensController = asyncHandler(async(req,res)=>{
    const refreshToken = req.cookies.refreshToken;
    
    const dbResponse = await refreshAccessToken(refreshToken)

    const {accessToken,refreshToken:newRefreshToken} = dbResponse
    
  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions)
    .json(new ApiResponse(200, {}, "Tokens refreshed successfully"))
    
})
