import React from 'react'
import {Avatar, Button} from "@mui/material"
import {useSelector, useDispatch} from 'react-redux'
import {selectPhoto, selectUser} from '../features/userSlice'
import {signOut} from 'firebase/auth'
import {auth} from '../firebase/firebase'
import {logout, photoReset} from '../features/userSlice'

function NavBar() {
  const user = useSelector(selectUser)
  const photo = useSelector(selectPhoto)
  const dispatch = useDispatch()
    const signUserOut = () => {
      signOut(auth).then(() => {
        alert('signed out')
        dispatch(
          logout(),
          photoReset()
        )
      })
  }
  return (
    <div className='navbar__main'>
        <img
        alt="instagram_logo"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
        className="insta__logo"
      />
      {user &&
      <div className='navbar__buttons'>
      <Avatar src={photo} className="navbar__avatar"></Avatar>
      <Button variant="contained" onClick={signUserOut}>Sign out</Button>
      </div>
      }
    </div>
  )
}

export default NavBar