import React, { useState } from 'react';
import { Link, Redirect } from "react-router-dom";

import { Card , Input , Button, Label, FormFeedback, FormGroup, Form} from 'reactstrap'
import LockIcon from '@material-ui/icons/Lock';
import { baseUrl } from '../config';

function SignIn(props){
    
    const [credentials , setCredentials] = useState({username:"",password:""});
    const [username , setUsername] = useState({
        focus: false,
        err: "",
        valid: null
    });
    const [password , setPassword] = useState({
      focus: false,
      err: "",
      valid: null
    });

    function handleChange(event){
        if(event.target.name === "password"){
            if(event.target.value.length >= 8 && event.target.value.length <= 22){
                setPassword(prevState => ({
                    ...prevState,
                    err:"",
                    valid: true
                }))
            }
        }
        setCredentials(prevState => ({
        ...prevState,
        [event.target.name]: event.target.value
        }))
    }

    function handleFocus(event){
        if(event.target.name === "username"){
            setUsername(prevState => ({
                ...prevState,
                focus: true
            }))
        }else if(event.target.name === "password"){
            setPassword(prevState => ({
                ...prevState,
                focus: true
            }))
        }
    }

    function Validate(event){
        if(event.target.name === "username"){
            if(username.focus){
                if(credentials.username === "" ){
                    setUsername(prevState => ({
                        ...prevState,
                        err: "Username can't be empty!!",
                        valid: false
                    }))
                }else if(credentials.username.length < 2){
                    setUsername(prevState => ({
                        ...prevState,
                        err: "Username should be minimumm of 2 characters long!!",
                        valid: false
                    }))
                }else if(credentials.username.length >= 48){
                    setUsername(prevState => ({
                        ...prevState,
                        err: "Username can be maximum of 48 characters long!!",
                        valid: false
                    }))
                }else{
                    setUsername(prevState => ({
                        ...prevState,
                        err:"",
                        valid: true
                    }))
                }
            }
        }else if(event.target.name === "password"){
            if(password.focus){
                if(credentials.password === "" ){
                    setPassword(prevState => ({
                        ...prevState,
                        err: "Password can't be empty!!",
                        valid: false
                    }))
                }else if(credentials.password.length < 8){
                    setPassword(prevState => ({
                        ...prevState,
                        err: "Password should be minimumm of 8 characters long!!",
                        valid: false
                    }))
                }else if(credentials.password.length >= 22){
                    setPassword(prevState => ({
                        ...prevState,
                        err: "Password can be maximum of 22 characters long!!",
                        valid: false
                    }))
                }else{
                    setPassword(prevState => ({
                        ...prevState,
                        err:"",
                        valid: true
                    }))
                }
            }
        }
    }

    function handleSubmit(event){
        event.preventDefault();
        console.log("Event Got Called")
        fetch(baseUrl + "users/login" , {
            method: "POST",
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                username:credentials.username,
                password:credentials.password
            })
        })
        .then(resp => resp.json())
        .then(resp => {
            console.log(resp)
            if(resp.err){
                handleErr(resp)
            }else{
                handleSuccess(resp)
            }
        })
    }

    function handleErr(resp){
        if(resp.status === "IncorrectUsernameError"){
            setUsername(prevState => ({
                ...prevState,
                err: "Incorrect Username!",
                valid: false
            }))
            setCredentials({username:"",password:""})
        }else if(resp.status === "IncorrectPasswordError"){
            setPassword(prevState => ({
                ...prevState,
                err: "Incorrect Password!",
                valid: false
            }))
            setCredentials(prevState => ({
                ...prevState,
                password:""
            }))
        }
    }

    function handleSuccess(resp){
        setCredentials({username:"",password:""});
        let user = resp.user
        user.authenticated = true;
        props.setUser(user)
        localStorage.setItem('user' , JSON.stringify(user));
        localStorage.setItem('token' , JSON.stringify(resp.token));
    }

    return (
        <div className="App container-fluid h-100" style={{backgroundColor:"#E2E7EC"}}>
            {props.user && props.user.authenticated && <Redirect to="/dashboard" />}
            <Card className="container singInWindow form-container" style={{overflowY:"auto" , overflowX:"hidden" , maxWidth:"600px"}}>
                {/* {props.user && props.user.isAuthenticated && <Redirect to="/dashboard" />} */}
                <div className="row h-100">
                    <div className="col p-5 m-auto">
                    <div className="">
                        <h1 className="text-center" ><LockIcon fontSize='large' /></h1>
                        <h1 className="text-center">Sign In</h1>
                        <Form onSubmit= {handleSubmit} >
                            
                            <FormGroup className="mt-4">
                                <Label className="col" size="lg">Username</Label>
                                <Input 
                                    invalid={username.focus ? username.valid === false : false} 
                                    onChange={handleChange} onFocus={handleFocus} onBlur={Validate} 
                                    className="col input-field" bsSize="lg" type="text" 
                                    name="username" placeholder="Enter Username" autoComplete='off' 
                                    value={credentials.username}
                                />
                                <FormFeedback>{username.err}</FormFeedback>
                            </FormGroup>
                            
                            <FormGroup className="mt-2" style={{position:"relative"}}>
                                <Label className="col" size="lg">Password</Label>
                                <Input 
                                    invalid={password.focus ? password.valid === false : false}
                                    onChange={handleChange} onFocus={handleFocus} onBlur={Validate} 
                                    className="col input-field" bsSize="lg" autoComplete='off'
                                    name="password" placeholder="Enter Password" 
                                    value={credentials.password} type="password"
                                />
                                <FormFeedback>{password.err}</FormFeedback>
                            </FormGroup>
                            
                            <Button className="mt-5 w-100 rounded-pill sign-button" 
                            type="submit" size="lg block" disabled={!username.valid || !password.valid}>
                                Login
                            </Button>

                            <div className="text-center text-white">
                                <Label className="" size="lg">Not a User? <Link className="nav-link d-inline navLink" to='/signUp'> Sign Up!</Link> </Label>
                            </div>

                        </Form>
                    </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default SignIn;