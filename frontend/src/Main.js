import React, { useState } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";

import Dashboard from './layouts/dashboard';
import SignIn from './layouts/singIn';
import SignUp from './layouts/singnUp';

function Main(){

    const [user , setUser] = useState(JSON.parse(localStorage.getItem('user')));
    
    const renderDashboard = () => {
        return <Dashboard user={user} setUser={setUser} />
    }

    const renderSignIn = () => {
        return <SignIn user={user} setUser={setUser}/>
    }

    const renderSignUp = () => {
        return <SignUp user={user} setUser={setUser}/>
    }

    return(
        <Switch>
            <Route path="/signIn" component={renderSignIn} />
            <Route path="/signUp" component={renderSignUp} />
            <Route path="/dashboard" component={renderDashboard} />
            <Redirect to="/signIn"/>
        </Switch>
    )
}

export default Main;