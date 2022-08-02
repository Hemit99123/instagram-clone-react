import React, {useRef, useState, useEffect} from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { red } from '@mui/material/colors';
import {auth, db, storage} from '../firebase/firebase'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  getDocs
} from "firebase/firestore";
import {ref, deleteObject } from "firebase/storage";

export default function Post({name, profile, date, image, caption, uid, postID, imageRef}) {
    const [open, setOpen] = useState()
    const anchorRef = useRef()
    const [likes, setLikes] = useState([])
    const [comment, setComments] = useState([])
    const [hasLiked, setHasLiked] = useState()
    useEffect(() => {
      onSnapshot(collection(db, 'posts', postID, 'likes'), (snapshot) => {
        setLikes(snapshot.docs)
      })
    },[db, postID])

    useEffect(() => {
      onSnapshot(collection(db, 'posts', postID, 'comments'), (snapshot) => {
        setComments(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      })
    },[db, postID])    

    useEffect(() => {
      setHasLiked(
        likes.findIndex((like) => like.id === auth?.currentUser?.uid) !== -1
        )
    })

    const likePost = async () => {
      if (hasLiked) {
        await deleteDoc(doc(db, 'posts', postID, "likes", auth.currentUser.uid))
      }else {
      await setDoc(doc(db, 'posts', postID, 'likes', auth.currentUser.uid), {
        username: auth.currentUser.displayName,
      })
      }
    }

    const addComment = async () => {
      const comment = prompt('Add comment')
      if (comment === null){
        return;
      }
      await addDoc(collection(db, 'posts', postID, 'comments'), {
        username: auth.currentUser.displayName,
        comment: comment,
        uid: auth.currentUser.uid
      })
    }    


    const deletePost = async (id) => {
    alert('post has been deleted sucessfully!')
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);

    const likeRef = collection(db, "posts", id , "likes");
    const snapshotLikes = await getDocs(likeRef);
  
    const resultsLikes = snapshotLikes.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  
    resultsLikes.forEach(async (results) => {
      const docRef = doc(db, "posts", id, "likes", results.id);
      await deleteDoc(docRef);
    });

    const commentRef = collection(db, "posts", id , "comments");
    const snapshotComments = await getDocs(commentRef);
  
    const resultsComments = snapshotComments.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  
    resultsComments.forEach(async (results) => {
      const docRef = doc(db, "posts", id, "comments", results.id);
      await deleteDoc(docRef);
    });    
    const desertRef = ref(storage, imageRef); 

    // Delete the file
    deleteObject(desertRef).then(() => {
      //do nothing upon sucess!
    }).catch((error) => {
      console.log(error)
  });
  };

  const deleteComment = async (id) => {
    alert("comment has been deleted sucessfully")
    const commentDoc = doc(db, 'posts', postID, 'comments', id)
    await deleteDoc(commentDoc)
  }

    const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

    function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  const commentsMap = comment.map((comment) => {
    return(
      <div className="comment" key={comment.id}>
        <b>{comment.username}:</b>
        <span> </span>
        {comment.comment}
        {comment.uid === auth.currentUser.uid &&
        <IconButton onClick={() => {deleteComment(comment.id)}}>
          <DeleteIcon />
        </IconButton>
        
        }
      </div>
    )
  })

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Card sx={{ maxWidth: 435 }} key={postID}>
      <CardHeader
        avatar={
          <Avatar src={profile} aria-label="profilePicture" />
        }
        action={
          <IconButton 
          aria-label="settings"
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          >
            <MoreVertIcon />
          </IconButton>
        }
        
        title={name}
        subheader={date}
      />
      {open &&
                          <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    {uid === auth.currentUser.uid &&
                      <MenuItem onClick={() => {deletePost(postID)}}>
                        Delete
                      </MenuItem>                    
                    }
                    <MenuItem onClick={() => {window.location.href = image}}>
                    Open image
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
      }

      <CardMedia
        component="img"
        src={image}
        alt="Post image"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {caption}
        </Typography>
      </CardContent>
        <CardContent>
        <Typography variant="body3" color="text.secondary">
          {likes.length !== 1  && 
          <div>
            {likes.length} likes
          </div>
          }
          {likes.length === 1 &&
          <div>
            {likes.length} like
          </div>
          }
        </Typography>
      </CardContent>
        <IconButton aria-label="add to favorites" onClick={likePost} sx={{color: red}}>
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="add to favorites" onClick={addComment}>
          <CommentIcon />
        </IconButton>
        <div className='comments'>
          {commentsMap}
        </div>
    </Card>
  );
}