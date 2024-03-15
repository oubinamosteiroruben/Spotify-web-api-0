import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap'
import { useState, useEffect } from 'react';

const CLIENT_ID = "dea769c434c64c8e93d3d34b1d2d36b0"
const CLIENT_SECRET = "018b436cfe734d128d68044bb980b5a6"

function App() {


  const [searchInput, setSearchInput] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [artistIdent, setArtistIdent] = useState("")
  const [artistAlbums, setArtistAlbums] = useState([])

  useEffect(() => {
    // API ACCESS TOKEN
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token',authParameters)
    .then(result => result.json())
    .then(data => setAccessToken(data.access_token))
  }, [])

  async function search(){
    console.log("Search for " + searchInput)
    var artistParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', artistParameters )
    .then(response => response.json())
    .then(data => { return data.artists.items[0].id })
    console.log(artistID)
  
    setArtistIdent(artistID)

    getAlbumsFromArtist()
  }


  async function getAlbumsFromArtist(){
    console.log("Albums from " + artistIdent)
    var artistParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    var albumsNames = await fetch('https://api.spotify.com/v1/artists/' + artistIdent + '/albums', artistParameters )
    .then(response => response.json())
    .then(data => { 
      console.log(data)
      let vals = Array.from(data.items).reduce((acc, o) => {
        acc.push(o.name);
        return acc;
      }, []);
      return vals //Array.from(data.items).reduce((tot,e)=> tot.push(e.name), [])
     })

     setArtistAlbums(albumsNames)

  }


  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl 
            placeholder="Search For Artist"
            type="input"
            onKeyUp={event => {
              if(event.key === "Enter"){
                console.log("Pressed enter")
                search()
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
            />
            <Button onClick={event => {search()}}>
              Search
            </Button>
        </InputGroup>
      </Container>
      <Container>
        {artistAlbums}
        <Row className="mx-2 row row-cols-4">
          <Card>
            <Card.Img src="#" />
            <Card.Body>
              <Card.Title>Album Name</Card.Title>
            </Card.Body>
          </Card>
          
        </Row>
        
      </Container>
    </div>
  );
}

export default App;
