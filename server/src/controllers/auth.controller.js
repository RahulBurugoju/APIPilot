import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { refreshTokenCookieOptions, clearRefreshTokenCookieOptions } from "../config/cookie.config.js";

export const registerController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const dbResponse = await registerUser({ name, email, password });
  const { user, accessToken, refreshToken } = dbResponse;

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 1000,
  };
  // if CORS error because of cookies in production send both tokens in response body instead of setting cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(new ApiResponse(200, user, "User registered successfully"));
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const dbResponse = await loginUser({ email, password });

  const { user, accessToken, refreshToken } = dbResponse;

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 1000,
  };
  // if CORS error because of cookies in production send both tokens in response body instead of setting cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
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
        .clearCookie("accessToken",clearRefreshTokenCookieOptions)
        .clearCookie("refreshToken",clearRefreshTokenCookieOptions)
        .json(new ApiResponse(200,{},"User logged out successfully"))   

})

export const refreshTokensController = asyncHandler(async(req,res)=>{
    const refreshToken = req.cookies.refreshToken;
    
    const dbResponse = await refreshAccessToken(refreshToken)

    const {accessToken,refreshToken:newRefreshToken} = dbResponse
    
    const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions)
    .json(new ApiResponse(200, {}, "Tokens refreshed successfully"))
    
})
