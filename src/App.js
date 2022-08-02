import React from 'react';
import Login from './Components/Login';
import Home from './Components/Home';
import NavBar from './Components/NavBar';
import {
    onAuthStateChanged
} from 'firebase/auth';
import {
    auth
} from './firebase/firebase'
import './App.css';
import {
    selectUser,
    login,
    logout,
    photo,
    photoReset
} from './features/userSlice.js'
import {
    useDispatch,
    useSelector
} from 'react-redux'

function App() {
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    onAuthStateChanged(auth, (user) => {
        if (user) {
            dispatch(
                login(true)
            )
            dispatch(
              photo(user.photoURL)
            )
        } else {
            dispatch(
              logout(),
              )
            dispatch(
              photoReset()
            )
        }
    })
    return (

      <div>
      <header>
        <NavBar />
      </header>
      <br />
      <br />
      {user === true &&
        <Home /> 
      }
      {user === null && 
        <Login />
      }

      </div>
    );
}

export default App;