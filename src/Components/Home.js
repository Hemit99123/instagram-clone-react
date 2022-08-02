import React, {useState, useEffect} from 'react'
import {Input, Button} from '@mui/material'
import {storage} from '../firebase/firebase'
import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {auth,db} from '../firebase/firebase'
import {v4} from 'uuid'
import {
  collection,
  addDoc,
  onSnapshot
} from "firebase/firestore";
import moment from 'moment'
import Post from './Post'
function Home() {
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState()
  const [perc, setPerc] = useState(null)
  const [data, setData] = useState(null)
  const [results, setResults] = useState([])
  const [imageRef, setImageRef] = useState()

      useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + v4() + image.name ;
      console.log(name);
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          //if image is fully uploaded then do the following tasks...
          if (progress === 100){
            setPerc(null)
            setImageRef(name)
            alert('Image has sucessfully been uploaded!')
          }else{
          setPerc(progress);
          }
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData(downloadURL);
          });
        }
      );
    };
    image && uploadFile();
  }, [image]);

  const addPost = async () => {
    if (caption === '' || data === null){
      alert('please write something in caption and/or please upload an image.')
      return;
    }
    alert('post has been created sucessfully')
    await addDoc(collection(db, "posts") , {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        caption,
        link: data,
        date: moment().format('MMMM Do YYYY'),
        profile: auth.currentUser.photoURL,
        imageRef
    })
    window.location.reload()
}

    const getPost = () => {
    const collectionRef = collection(db, "posts");

    const unsub = onSnapshot(collectionRef, (snapshot) =>
      setResults(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))),
      console.log(results)
    );

    return unsub;
  }

  useEffect(() => {
    getPost()
  }, [])

  const postMap = results.map((results) => {
    return(
      <center className="postMap">
      <Post name={results.displayName} profile={results.profile} date={results.date} image={results.link} caption={results.caption} uid={results.uid} postID={results.id} imageRef={results.imageRef}/>
      </center>
    )
  })

  return (
    <div className='posts'>
      {perc !== null &&
      <div>
        {Math.floor(Math.round(perc))} % uploaded

      </div>
      }
          <Input
            fullWidth
            multiline
            placeholder="Your caption goes here..."
            onChange={(event) => {
              setCaption(event.target.value);
            }}
          />
        <br />
        <br />
        <center><input type="file" onChange={(e) => {setImage(e.target.files[0])}} /></center>
      {perc === null &&
      <center>
        <br />
        <Button variant='outlined' onClick={() => {addPost()}}>Post</Button>
      </center>
      }
      {postMap}
    </div>
  )
}

export default Home