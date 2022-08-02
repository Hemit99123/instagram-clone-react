import React, {useEffect} from 'react'
import { Button } from '@mui/material';
import {signInWithRedirect} from 'firebase/auth'
import {auth, provider} from '../firebase/firebase.js'


function Login() {

  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };



  return (
    <div>
      <center>
        <img src="https://pbs.twimg.com/profile_images/1526231349354303489/3Bg-2ZsT_400x400.jpg" alt="Instagram Clone Logo" />
        <br />
        <Button variant='contained' onClick={signInWithGoogle}>Login with Google</Button>
      </center>
    </div>
  )
}

export default Login