import React from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Navbar, NavbarBrand,Collapse, Nav,NavLink, NavItem, Container,Row,Col } from 'reactstrap';
import { Button } from 'reactstrap';
import TagsInput from 'react-tagsinput';
import Upload  from './Upload';
import axios from 'axios';

class App extends React.Component {
    constructor(props) {
       super()
       this.state = {
           isUpload:false,
           isSearch:false,
           tags: [],
           imageUrls: []
       }
    }
    handleChange = (tags) => {
      this.setState({
          tags: tags
      })
    }
    startUpload = () => {
        this.setState({
            isUpload: true,
            tags: [],
            imageUrls: [],
        })
    }
    startSearch = () => {
        this.setState ({
            isUpload:false,
            isSearch:true,
            imageUrls: [],
        })
    }
    submitSearch= async () => {
       this.startSearch();
       let searchData = this.state.tags.join();
       console.log(searchData);
       const response = await axios.get("https://1vmtofqjz5.execute-api.us-east-1.amazonaws.com/default/queryES",
           { params: {tags: searchData}}
       )
       console.log(response);
       if (response.status === 200 && response.data.length > 0 ) {
           this.setState({
             imageUrls: response.data
         });
       }
    }
    
    render(){
        let {isUpload,isSearch,imageUrls} = this.state
        let $mainContent = null;
        let $imageObjects = null;
        if (imageUrls.length > 0 ) {
            const mappedUrls =  imageUrls.map((url) => {
                return 'https://apiworld-image-bucket.s3.us-east-2.amazonaws.com/'+ url;
             });
            $imageObjects = mappedUrls.map((url,index) => {
                return (
                    <img key = {index} className = "searchResultImg" src = {url} alt="" />
                )
            })
        } else {
            if (isSearch){
                $imageObjects = (
                    <div className = "wordContent" >
                        Let's search for some tags ...   
                    </div>
                )
            } else {
                $imageObjects = (
                    <div className = "wordContent" >
                        Welcome to IRIS! Try upload or search!  
                        <Row>
                            <Col md={{ size: 3, offset: 3 }}>
                                <FontAwesomeIcon id = "uploadIcon" onClick = {this.startUpload} icon={faUpload} size='5x' color='#549bba' />
                            </Col>
                            <Col md={{ size: 3}}>
                                <FontAwesomeIcon id = "searchIcon" onClick = {this.startSearch} icon={faSearch} size='5x' color='#549bba' />
                            </Col>
                        </Row>
                    </div>
                )
            }
            
        }
        if (isUpload) {
            $mainContent = (<Upload />)
        } else {
            //search either search-result or no-result
            $mainContent = $imageObjects
        }
        
        return(
            <div className = "App">
               <Navbar color="light" light expand="md">
                 <NavbarBrand href="/">IRIS</NavbarBrand>
                 <Collapse navbar>
                   <Nav className="mr-auto" navbar>
                     <NavItem>
                       <NavLink>
                        <FontAwesomeIcon id = "uploadIcon" onClick = {this.startUpload} icon={faUpload} size='2x' color='#549bba' />
                       </NavLink>
                     </NavItem>
                     <NavItem>
                       <NavLink>
                        <FontAwesomeIcon id = "searchIcon" onClick = {this.startSearch} icon={faSearch} size='2x' color='#549bba' />
                       </NavLink>
                     </NavItem> 
                     <TagsInput className="tagsInput" value={this.state.tags} placeholder = "Search..." onChange={this.handleChange} />
                     <Button id = "searchBtn" onClick = {this.submitSearch}  color="info">Search</Button>
                   </Nav>
                 </Collapse>
                 
               </Navbar>
             
                <Container>
                    {$mainContent}
                </Container>
                    
             </div>
            
        )
    
    }
  
}

export default App;
