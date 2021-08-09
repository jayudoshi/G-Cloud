import React, { useState } from 'react';
import { Link, Redirect } from "react-router-dom";

import { Card , Input , Button, Label, FormFeedback, FormGroup, Form} from 'reactstrap'
import LockIcon from '@material-ui/icons/Lock';
import { baseUrl } from '../config';

function SignUp(props){
    
    const [credentials , setCredentials] = useState({
        fname: "",
        lname: "",
        username: "",
        password: "",
        registered: false
    })
    const [fname , setFname] = useState({
        focus: false,
        err: "",
        valid: null
    })
    const [lname , setLname] = useState({
        focus: false,
        err: "",
        valid: null
    })
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
        }else if(event.target.name === "fname"){
            setFname(prevState => ({
                ...prevState,
                focus: true
            }))
        }else if(event.target.name === "lname"){
            setLname(prevState => ({
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
        }else if(event.target.name === "fname"){
            if(fname.focus){
                if(credentials.fname === "" ){
                    setFname(prevState => ({
                    ...prevState,
                    err: "First Name can't be empty!!",
                    valid: false
                    }))
                }else if(credentials.fname.length < 2){
                    setFname(prevState => ({
                    ...prevState,
                    err: "First Name should be minimumm of 2 characters long!!",
                    valid: false
                    }))
                }else if(credentials.fname.length >= 22){
                    setFname(prevState => ({
                    ...prevState,
                    err: "First Name can be maximum of 22 characters long!!",
                    valid: false
                    }))
                }else{
                    setFname(prevState => ({
                    ...prevState,
                    err:"",
                    valid: true
                    }))
                }
            }
        }else if(event.target.name === "lname"){
            if(lname.focus){
                if(credentials.lname === "" ){
                    setLname(prevState => ({
                    ...prevState,
                    err: "Last Name can't be empty!!",
                    valid: false
                    }))
                }else if(credentials.lname.length < 2){
                    setLname(prevState => ({
                    ...prevState,
                    err: "Last Name should be minimumm of 2 characters long!!",
                    valid: false
                    }))
                }else if(credentials.lname.length >= 22){
                    setLname(prevState => ({
                    ...prevState,
                    err: "Last Name can be maximum of 22 characters long!!",
                    valid: false
                    }))
                }else{
                    setLname(prevState => ({
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
        const document = {
            username: credentials.username,
            password: credentials.password,
            fname: credentials.fname,
            lname: credentials.lname,
        }
        fetch(baseUrl + "users/register" , {
            method: "POST",
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify(document)
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
        console.log(resp.status)
        console.log(resp.status === "UserExistsError")
        if(resp.status === "UserExistsError"){
            setUsername(prevState => ({
                ...prevState,
                err: resp.err,
                valid: false
            }))
            setCredentials(prevState => ({
                ...prevState,
                registered: false,
            }))
        }
    }

    function handleSuccess(resp){
        setCredentials(prevState => ({
            fname: "",
            lname: "",
            username: "",
            password: "",
            registered: true
        }))
    }

    return (
        <div className="App container-fluid h-100" style={{backgroundColor:"#E2E7EC"}}>
            {props.user && props.user.authenticated && <Redirect to="/dashboard" />}
            {credentials.registered && <Redirect to="/signIn" />}
            <Card className="container singInWindow form-container" style={{overflowY:"auto" , overflowX:"hidden" , maxWidth:"600px"}}>
                {/* {props.user && props.user.isAuthenticated && <Redirect to="/dashboard" />} */}
                <div className="row h-100">
                    <div className="col m-auto" style={{paddingLeft:"5%" , paddingRight:"5%" , paddingTop:"10px" , paddingBottom:"5px"}}>
                    <div className="">
                        <h1 className="text-center" ><LockIcon fontSize='large' /></h1>
                        <h1 className="text-center">Sign Up</h1>
                        <Form onSubmit= {handleSubmit} className="p-4"  >
                            
                            <FormGroup className="mt-2">
                                <Label htmlFor="fname" className="col p-0" size="lg">First Name</Label>
                                <Input 
                                    invalid={fname.focus ? fname.valid === false : false} 
                                    onChange={handleChange} onFocus={handleFocus} onBlur={Validate} 
                                    className="col input-field" bsSize="lg" type="text" 
                                    name="fname" placeholder="First Name" autoComplete='off' 
                                    value={credentials.fname} id="fname"
                                />
                                <FormFeedback>{fname.err}</FormFeedback>
                            </FormGroup>

                            <FormGroup className="mt-2">
                                <Label htmlFor="lname" className="col p-0" size="lg">Last Name</Label>
                                <Input 
                                    invalid={lname.focus ? lname.valid === false : false} 
                                    onChange={handleChange} onFocus={handleFocus} onBlur={Validate} 
                                    className="col input-field" bsSize="lg" type="text" 
                                    name="lname" placeholder="Last Name" autoComplete='off' 
                                    value={credentials.lname} id="lname"
                                />
                                <FormFeedback>{lname.err}</FormFeedback>
                            </FormGroup>

                            <FormGroup className="mt-2">
                                <Label htmlFor="username" className="p-0" size="lg">Username</Label>
                                <Input 
                                    invalid={username.focus ? username.valid === false : false} 
                                    onChange={handleChange} onFocus={handleFocus} onBlur={Validate} 
                                    className="col input-field" bsSize="lg" type="text" 
                                    name="username" placeholder="Enter Username" autoComplete='off' 
                                    value={credentials.username} id="username"
                                />
                                <FormFeedback>{username.err}</FormFeedback>
                            </FormGroup>

                            <FormGroup className="mt-2" style={{}}>
                                <Label id="password" className="p-0" size="lg">Password</Label>
                                <Input 
                                    invalid={password.focus ? password.valid === false : false}
                                    onChange={handleChange} onFocus={handleFocus} onBlur={Validate} 
                                    className="col input-field" bsSize="lg" autoComplete='off'
                                    type="password" name="password" placeholder="Enter Password" 
                                    value={credentials.password} id="password"
                                />
                                <FormFeedback>{password.err}</FormFeedback>
                            </FormGroup>

                            <Button className="mt-3 w-100 rounded-pill sign-button" 
                                type="submit" size="lg block"
                                disabled={!username.valid || !password.valid || !fname.valid || !lname.valid}>
                                Sign Up
                            </Button>
                            
                            <div className="text-center text-white">
                                <Label className="" size="lg">Already a User? <Link className="nav-link d-inline navLink" to='/signin'> Sign In!</Link> </Label>
                            </div>
                        </Form>
                    </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default SignUp;