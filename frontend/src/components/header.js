import React from 'react';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CloudIcon from '@material-ui/icons/Cloud';

function Header(props){

    function handleClick(){
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        props.setUser(null);
    }

    return (
        <div className="w-100 h-100 pt-3" style={{height:"10%" , color:"#9A9A9A"}}>
            <div className="container">
                <div className="navbar-toggle-header" style={{display:"inline-block"}}>
                    <h1 className="align-middle" style={{display:"inline-block" , fontSize:"2.7rem" , marginTop:"auto" , marginBottom:"auto"}}><span><CloudIcon className="align-middle" style={{fontSize:"3rem" , marginRight:"13px"}}/></span>GCloud</h1>
                </div>
                <div className="logout" style={{display:"inline-block" , textAlign:"right"}}>
                    <button className="logout-btn" onClick={handleClick}>
                        <span className="align-middle" style={{fontSize:"2.7rem"}}>
                            Logout
                        </span>
                        {" "}
                        <ExitToAppIcon className="logout-btn" style={{fontSize:"3rem" , display:"inline-block"}}/>
                    </button>
                </div>
            </div>
            <hr className="p-0 m-0 mt-2" style={{clear:"left"}}></hr>
        </div>
    )
}

export default Header;