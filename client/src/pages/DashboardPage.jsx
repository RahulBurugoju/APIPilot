import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

function DashboardPage( ) {
    const {user} = useSelector((state) => state.auth)
    const {accessToken} = useSelector((state) => state.auth)
    {console.log(user)}
    return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage