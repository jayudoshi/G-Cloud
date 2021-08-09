import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {baseUrl} from '../config';

import Header from '../components/header';
import RenderFiles from '../components/renderFiles';

import { Col, Container, Form, FormFeedback, Row } from 'reactstrap';
import Logo from '../assests/img/cloud-computing.png'
import LinkIcon from '@material-ui/icons/Link';
import DeleteIcon from '@material-ui/icons/Delete';

function Dashboard(props){

    const [file , setFile] = useState({
        valid: false,
        err:""
    });
    const [selectedFile , setSelectedFile] = useState(null);
    const [loading , setLoading] = useState(false);
    const [files , setFiles] = useState(null);
    const [event , setEvent] = useState(null);
    
    useEffect(() => {
        if(!files){
            setEvent("Fetching Data...")
            setLoading(true)
            fetch(baseUrl + "files" , {
                method: "GET",
                headers: {
                    'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('token'))
                },
            })
            .then(resp => resp.json())
            .then(resp => {
                if(resp.err){
                    console.log(resp.err);
                }else{
                    console.log(resp);
                    setFiles(resp.files)
                    setLoading(false)
                }
            })
        }
    } , [])

    function handleChange(event){
        if(!event.target.files[0]){
            setFile(prevState => ({
                valid: false,
            }))
        }
        if(event.target.files[0]){
            const file = event.target.files[0]
            const size = file.size
            const arr = (file.type + "").split('/');
            const type = arr[0];
            const ext = arr[1];
            switch(type){
                case 'video':
                    if(ext !== "mp4"){
                        setFile({
                            valid: false,
                            err:"Invalid File Type"
                        })
                        return;
                    }
                    break;
                case 'image':
                    console.log(ext !== "jpeg" || ext !== "png")
                    if( !(ext === "jpeg" || ext === "png") ){
                        setFile({
                            valid: false,
                            err:"Invalid File Type"
                        })
                        return;
                    }
                    break;
                case 'application':
                    if(ext !== "pdf"){
                        setFile({
                            valid: false,
                            err:"Invalid File Type"
                        })
                        return;
                    }
                    break;
                case 'text':
                    if(ext !== "plain"){
                        setFile({
                            valid: false,
                            err:"Invalid File Type"
                        })
                        return;
                    }
                    break;
                default:
                    setFile({
                        valid: false,
                        err:"Invalid File Type"
                    })
                    return;
            }
            if(size > 10485760){
                setFile({
                    valid: false,
                    err:"File size exceeds limits of 10mb"
                })
            }else{
                setEvent("Uploading...")
                setLoading(true)
                let formData = new FormData()
                formData.append('file' , event.target.files[0]);
                formData.append('size' , size);
                formData.append('type',type);
                formData.append('ext',ext);
                fetch(baseUrl + "files/" , {
                    method:"POST",
                    headers: {
                        'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('token'))
                    },
                    body:formData
                })
                .then(resp => resp.json())
                .then(resp => {
                    console.log(resp)
                    if(resp.err){
                        console.log(resp.err)
                    }else{
                        if(resp.file){
                            setFiles(prevState => [resp.file , ...prevState]);
                            setLoading(false)
                        }
                    }
                })
                setFile({
                    valid: true,
                    err:""
                })
            }
        }
    }

    function handleGetLink(){
        setEvent("Fetching Link...")
        setLoading(true)
        fetch(baseUrl + 'files/' + selectedFile.fileName + "/getLink" , {
            method:"GET",
            headers: {
                'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('token'))
            },
        })
        .then(resp => resp.json())
        .then(resp => {
            if(resp.err){
                console.log(resp.err)
            }else{
                navigator.clipboard.writeText(resp.url)
                setSelectedFile("")
                setLoading(false)
            }
        })
    }

    function handleDelete(){
        setEvent("Deleting...")
        setLoading(true)
        fetch(baseUrl + 'files/' + selectedFile.fileName , {
            method:"DELETE",
            headers: {
                'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('token'))
            },
        })
        .then(resp => resp.json())
        .then(resp => {
            console.log(resp)
            if(resp.err){
                console.log(resp.err)
            }else{
                const Files = files.filter(file => file.fileFileName !== selectedFile.fileName)
                setFiles(Files)
                setSelectedFile("")
                setLoading(false)
            }
        })
    }

    return (
        <React.Fragment>
            {loading && <div className="loader-container text-center">
                <div className="loader m-auto text-center"></div>
                <h5 className="loader">{event}</h5>
            </div>}
            <div className='container-fluid h-100 p-0' style={ loading ? {opacity:"0.6"} : {opacity:"1"}} >
                {!props.user && <Redirect to="/signIn" />}
                <div className="w-100" style={{height:"12%"}}>
                    <Header setUser={props.setUser}/>
                </div>
                <div className="w-100" style={{height:"85%"}}>
                    <div className="w-100 h-100">
                        <Container>
                            <Row className="text-center mt-3 pt-3 mb-0 pb-0">
                                <Col lg="12 m-auto">
                                    <Form className="mb-3" >
                                        <label htmlFor="file" typeof="button" className="upload p-0 m-0">
                                            <img className="p-2 upload"  src={Logo} alt="Upload"/>
                                        </label>
                                        <input id="file" type="file" style={{display:"none"}} 
                                            onChange={handleChange}
                                        />
                                        {file.err && <FormFeedback className="text-center" style={{display:"block"}}>{file.err}</FormFeedback>}
                                    </Form>
                                    {selectedFile && <Form>
                                        <label typeof="button" className="upload-link p-0 mt-0 ml-0 mb-0 " style={{marginRight:"15px"}}
                                            onClick={handleGetLink}
                                        >
                                            <LinkIcon className="p-2 w-100 h-100" style={{fontSize:"1.4rem"}}/>
                                        </label>
                                        <label typeof="button" className="upload-link p-0 m-0"
                                            onClick={handleDelete}
                                        >
                                            <DeleteIcon className="p-2 w-100 h-100" style={{fontSize:"1.4rem"}}/>
                                        </label>
                                    </Form>}
                                </Col>
                            </Row>
                            <Row className="p-3">
                                <Col lg="12 m-auto">
                                    <div className="w-100 h-100 p-1">
                                        <ul class="list-group w-100 h-100">
                                        <li class="list-group-item w-100 h-100 p-0 mb-3" style={{border:"0px" , color:"#D7D7D7" , fontSize:"1.4rem" , fontFamily:"font-family: Google Sans, Roboto,RobotoDraft,Helvetica,Arial,sans-serif"}}>
                                                <div className="container-fluid p-0 m-0">
                                                    <div className="row">
                                                        <div className="col-1 text-center">Name</div>
                                                        <div className="col-7" style={{textAlign:"left"}}></div>
                                                        <div className="col-1" style={{textAlign:"left"}}>
                                                            Type
                                                        </div>
                                                        <div className="col-1" style={{textAlign:"left"}}>
                                                            Size
                                                        </div>
                                                        <div className="col-2" style={{textAlign:"left"}}>
                                                            Upload
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <RenderFiles files={files} selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>
                                        </ul>
                                    </div>
                                </Col>
                            </Row>
                        </Container>    
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Dashboard;