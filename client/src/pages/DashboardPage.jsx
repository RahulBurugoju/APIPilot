import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../features/auth/auth.thunk.js'

function DashboardPage( ) {
    const {user} = useSelector((state) => state.auth)
    const {accessToken} = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    {console.log(user)}
    return (
    <div>DashboardPage
        <button onClick={() => dispatch(logoutUser())}>logout
        </button>
    </div>
  )
}

export default DashboardPage