import React from 'react';
import { Button, Modal, ModalHeader, ModalBody} from 'reactstrap';
import FileDrop from 'react-file-drop';
import './App.css';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';



class Upload extends React.Component {
constructor(props) {
   super()
   this.state = {
       tags: [],
       file: '',
       imagePreviewUrl: '',
       modal: false
   }
   this.toggle = this.toggle.bind(this);
  }
 
 toggle = () => {
   this.setState(prevState => ({
     modal: !prevState.modal
   }));
 }
 
 handleChange = (tags) => {
   this.setState({
       tags: tags,
   })
 }

  handleDrop = (files, event) => {
    //make a list of file
   console.log(files);
   let reader = new FileReader();
   let file = files[0];
   reader.onloadend = () => {
     this.setState({
       file: file,
       imagePreviewUrl: reader.result
     });
   }
   reader.readAsDataURL(file);
  }
  
  upload = async () => {
     
      console.log("should upload photo");
      var requestBody = {
          image_id: this.state.file.name,
          image_format: 'jpg',
          image_object: this.state.imagePreviewUrl
      }
      try {
          await axios.post("https://jmxfyznnpg.execute-api.us-east-2.amazonaws.com/default/uploadToS3",{
              headers:{
                  'Accept': 'application/json',
                  'Content-Length':'9403',
                  'X-Amz-Date':'20191010T084844Z',
                  'Authorization':'AWS4-HMAC-SHA256 Credential=AKIAUNHP3HO3JQFNFARX/20191010/us-east-2/execute-api/aws4_request, SignedHeaders=cache-control;content-length;content-type;host;postman-token;x-amz-date;x-api-key, Signature=7f4c5a6a8cbfa05dd4e57b95b47698a78e854b508d0873a8a691658cd43f320d',
                  'x-api-key':'ESV3f620NN6apcduxonSs8iUJOqwvMJo3eJAF5XF',
                  'Content-Type':'application/json',
                  'Access-Control-Allow-Origin':'http://localhost:3000',
                  'Cache-Control':'no-cache'
              },
              data: requestBody
          })
          
      } catch (err) {
      }  finally {
          if(this.state.imagePreviewUrl!==''){
              this.setState({modal:true});
          }
          
      }   
      
  }
  

  render() {
    const { tags} = this.state;
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (
          <FileDrop className ="drag-and-drop" onDrop={this.handleDrop} >
            <FontAwesomeIcon id = "uploadIcon" icon={faUpload} size='5x' color='#549bba' />
            <div> DROP AN IMAGE HERE!</div>
            
          </FileDrop>
      );
    }
    return (
      <div className = 'Upload'>
      <div className="imgPreview">
        {$imagePreview}
      </div>
        <div id="uploadTagsInput">
            <TagsInput  className="tagsInput" value={this.state.tags} onChange={this.handleChange} />
        </div>    
        <Button  id = "uploadBtn" color="primary" onClick = {this.upload} >Upload</Button>
        <Modal id="successModal" isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
         <ModalHeader toggle={this.toggle}>Your image is successfully uploaded</ModalHeader>
         <ModalBody>
         <img src={imagePreviewUrl} />
         <div>Tag(s): {tags.join()} </div>
         <Button color="info" onClick={this.toggle}>Go back</Button>
         
         </ModalBody>
           
         
           
         
       </Modal>
      </div>      
    );
  }
}

export default Upload;