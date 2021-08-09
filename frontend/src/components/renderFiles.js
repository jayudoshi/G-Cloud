import React, { useState } from 'react'

import MovieIcon from '@material-ui/icons/Movie';
import ImageIcon from '@material-ui/icons/Image';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import NoteIcon from '@material-ui/icons/Note';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

function RenderFiles(props){
    const [modal , setModal] = useState(false);
    const toggle = () => setModal(!modal);

    function calculateSize(size){
        let Size = (size / 1048576).toFixed(2)
        if(Size < 0.01 ){
            return Size = (size / 1024).toFixed(2) + " kb"
        }
        return Size + " mb";
    }

    function selectIcon(type){
        if(type === "image"){
            return <ImageIcon />
        }else if(type === "application"){
            return <PictureAsPdfIcon />
        }else if(type === "video"){
            return <MovieIcon />
        }else if(type === "text"){
            return <NoteIcon />
        }
    }

    function renderFile(){
        if(props.files){
            return props.files.map(file => {
                return (
                <li key={file.fileName} class="list-group-item p-0" style={{border:"0px" , color:"#434343" , fontSize:"1.4rem" , fontFamily:"font-family: Google Sans, Roboto,RobotoDraft,Helvetica,Arial,sans-serif"}}
                    onClick={(e) => {console.log(file.fileName) ; props.setSelectedFile(file)}}
                    onDoubleClick={() => handleDoubleClick(file)}
                >
                    <div 
                    className={props.selectedFile && props.selectedFile.fileName === file.fileName ? 
                    "container-fluid file-list p-2 m-0 file-list-selected"
                    :
                    "container-fluid file-list p-2 m-0"
                    }
                    
                    >
                        <div className="row">
                            <div className="col-1 mt-1 text-center">
                                {selectIcon(file.type)}
                            </div>
                            <div className="col-7 mt-1" style={{textAlign:"left"}}>
                                {file.fileName}
                            </div>
                            <div className="col-1 mt-1" style={{textAlign:"left"}}>
                                {file.ext}
                            </div>
                            <div className="col-1 mt-1" style={{textAlign:"left"}}>
                                {calculateSize(file.size)}
                            </div>
                            <div className="col-2 mt-1" style={{textAlign:"left"}}>
                                {file.created}
                            </div>
                        </div>
                        
                    </div>
                    <hr style={{width:"98%", marginBottom:"5px" , marginLeft:"auto" , marginRight:"auto"}}></hr>
                </li> 
                )
            })
        }
    }

    function handleDoubleClick(file){
        alert("Doble Clicked !!")
        toggle()
    }

    function renderModal(){
        if(props.selectedFile){
            if(props.selectedFile.ext === "pdf" || props.selectedFile.ext === "txt"){
                return <iframe title={props.selectedFile.fileName} style={{height:"95%" , width:"95%"}} src={props.selectedFile.url} />
            }else if(props.selectedFile.type === "image"){
                return <img style={{maxWidth:"100%" , maxHeight:"100%"}} src={props.selectedFile.url} alt={props.selectedFile.fileName} />
            }else if(props.selectedFile.type === "video"){
                return <video controls style={{maxWidth:"100%" , maxHeight:"100%"}} src={props.selectedFile.url} />
            }
        }
    }

    const closeBtn = <button style={{backgroundColor:"transparent" , border:"0px" , outline:"none" , fontSize:"1.4rem"}} className="close" onClick={toggle}>&times;</button>;

    return (
        <React.Fragment>
            {renderFile()}
            <Modal isOpen={modal} toggle={toggle} close={closeBtn}>
                {props.selectedFile && <ModalHeader style={{backgroundColor:"transparent"}} toggle={toggle} close={closeBtn} className="h-10">{props.selectedFile.fileName}</ModalHeader>}
                <ModalBody className="text-center" style={{backgroundColor:"transparent" ,width:"100%" , height:"90%"}}>
                    {renderModal()}
                </ModalBody>
            </Modal>
        </React.Fragment>
    )

}

export default RenderFiles;