import React, { Component } from "react";
import Map from "./Map";
import Marker from "./Map";
import UserNavbar from "components/Navbars/UserNavbar.jsx";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";

// import Icon from "../components/Icon";
// import Category from "../components/Category";
// import PlaceCard from "../components/PlaceCard";
// import * as Permissions from "expo-permissions";
// import * as Location from "expo-location";
// import { Images } from "../constants";
// import { FlatList } from "react-native-gesture-handler";

import {
  Card,
  Container,
  Row,
  Modal,
  Button,
  Jumbotron,
  ListGroup,
  ListGroupItem,
  Col,
} from "reactstrap";
// import * as firebase from "../../services/firebase";
import { firebase, auth } from "../../services/firebase";
import PlaceCard from "components/PlaceCard";

// var cors = require('cors')

// use(cors());

const userId = JSON.parse(localStorage.getItem("uid"));

class ExploreAroundMe extends Component {
  user = firebase.auth().currentUser;
  firestoreUsersRef = firebase.firestore().collection("users");
  firestorePostRef = firebase.firestore().collection("posts");
  firestoreFollowingRef = firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("following");
  firestorePlacesRecommendationsRef = firebase
    .firestore()
    .collection("placesRecommendations")
    .doc(userId)
    .collection("recommendedPlaces")
    .doc(userId);

  state = {
    user: JSON.parse(localStorage.getItem("uid")),
    userLat: "33.6829308",
    userLong: "73.005094",
    places: [],
    currentLocation: {},
    placeType: "tourist_attraction",
  };

  componentWillMount() {
    // this.startHeaderHeight = 80
    // if (Platform.OS == 'android') {
    //     this.startHeaderHeight = 100 + StatusBar.currentHeight
    // }
    this.getCurrentLocation().then(() => {
      this.getPlaces();
    });
  }

  getCurrentLocation = async () => {
    // let { status } = await Permissions.askAsync(Permissions.LOCATION);
    // if (status !== 'granted') {
    //   this.setState({
    //     errorMessage: 'Permission to access location was denied',
    //   });
    // }

    // navigator.geolocation.getCurrentPosition(function(position) {});

    let lat = "";
    let long = "";
    await navigator.geolocation.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      long = position.coords.longitude;
      console.log(lat + "|" + long);
    });

    // this.setState({ userLat: "33", userLong: "77" });
    // console.log("user lat: " + this.state.userLat);
  };

  getPlacesUrl = (lat, long, radius, type) => {
    const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;
    const location = `location=${lat},${long}&radius=${radius}`;
    const typeData = `&types=${type}`;

    const api = `&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
    return `${baseUrl}${location}${typeData}${api}`;
  };

  getPlaces = () => {
    // const { userLat, userLong, placeType } = this.state;
    // const lat = userLat;
    // const long = userLong;
    const markers = [];
    // const url = this.getPlacesUrl(lat, long, 4200, placeType);
    // console.log(url);
    // fetch(url)
    //   .then((res) => res.json())
    //   .then((res) => {

    // firebase
    // .firestore()
    // .collection("users")
    // .doc(this.state.user3)

    firebase
      .firestore()
      .collection("placesRecommendations")
      .doc(this.state.user)
      .collection("recommendedPlaces")
      .doc(this.state.user)
      // .limit(3)
      // .limitToLast(100)
      .onSnapshot((doc) => {
        const res = doc.data();
        //  console.log(res);
        //  console.log(doc);
        // console.log(doc.data());

        res.places.slice(0, 9).map((element, index) => {
          const marketObj = {};
          marketObj.id = element.id;
          marketObj.icon = element.icon;
          marketObj.place_id = element.place_id;
          marketObj.opening_hours = element.opening_hours;
          // marketObj.photoURL=element.photos[0].getUrl();
          marketObj.name = element.name;
          marketObj.photos = element.photos;
          marketObj.rating = element.rating;
          marketObj.vicinity = element.vicinity;
          marketObj.type = element.types;
          marketObj.marker = {
            latitude: element.geometry.location.lat,
            longitude: element.geometry.location.lng,
          };

          markers.push(marketObj);

          // if (marketObj.photos  ) {
          //   console.log(
          //     "ref ref ref ref: " + marketObj.photos[0].photo_reference
          //   );
          // }else console.log("no photototot")
        });

        this.setState({ places: markers });

        // console.log(this.state.places);
      });

    // // this.firestorePlacesRecommendationsRef
    // firebase
    // .firestore()
    // .collection("placesRecommendations")
    // .doc(userId)
    // .collection("recommendedPlaces")
    // .doc(userId)
    //   .onSnapshot((res) => {
    //     console.log(res.results);
    //     console.log(userId);
    //     // res.results.map((element, index) => {
    //     res.data().places.map((element, index) => {
    //       const marketObj = {};
    //       marketObj.id = element.id;
    //       marketObj.place_id = element.place_id;
    //       marketObj.name = element.name;
    //       marketObj.photos = element.photos;
    //       marketObj.rating = element.rating;
    //       marketObj.vicinity = element.vicinity;
    //       marketObj.type = element.types;
    //       marketObj.marker = {
    //         latitude: element.geometry.location.lat,
    //         longitude: element.geometry.location.lng,
    //       };

    //       markers.push(marketObj);
    //     });

    //     this.setState({ places: markers });
    //   })
  };

  // onRefresh = () => {
  //   this.setState({ refreshing: true });

  //   this.getPlaces().then(() => {
  //     this.setState({ refreshing: false });
  //   });
  // };

  // getMorePlaces = () => {};


showMarker=()=>{

// const lat = JSON.parse(localStorage.getItem('lat'));
// const lon = JSON.parse(localStorage.getItem('lon'));
// return(
//   <Marker
//   google={this.props.google}
//   name={""}
//   draggable={true}
//   onDragEnd={this.onMarkerDragEnd}
//   position={{
//     lat: lat,
//     lng: lon,
//   }}
// />
// );

}




  render() {
    const mapOptions = {
      styles:
      // [
      //   {
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#ebe3cd"
      //       }
      //     ]
      //   },
      //   {
      //     "elementType": "labels.text.fill",
      //     "stylers": [
      //       {
      //         "color": "#523735"
      //       }
      //     ]
      //   },
      //   {
      //     "elementType": "labels.text.stroke",
      //     "stylers": [
      //       {
      //         "color": "#f5f1e6"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "administrative",
      //     "elementType": "geometry.stroke",
      //     "stylers": [
      //       {
      //         "color": "#c9b2a6"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "administrative.land_parcel",
      //     "elementType": "geometry.stroke",
      //     "stylers": [
      //       {
      //         "color": "#dcd2be"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "administrative.land_parcel",
      //     "elementType": "labels.text.fill",
      //     "stylers": [
      //       {
      //         "color": "#ae9e90"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "landscape.natural",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#dfd2ae"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "landscape.natural.terrain",
      //     "stylers": [
      //       {
      //         "visibility": "simplified"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "landscape.natural.terrain",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#7b6047"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "landscape.natural.terrain",
      //     "elementType": "labels.icon",
      //     "stylers": [
      //       {
      //         "color": "#44403c"
      //       },
      //       {
      //         "weight": 0.5
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "poi",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#dfd2ae"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "poi",
      //     "elementType": "labels.text.fill",
      //     "stylers": [
      //       {
      //         "color": "#93817c"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "poi.attraction",
      //     "elementType": "labels.icon",
      //     "stylers": [
      //       {
      //         "saturation": 90
      //       },
      //       {
      //         "weight": 8
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "poi.government",
      //     "stylers": [
      //       {
      //         "visibility": "simplified"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "poi.park",
      //     "elementType": "geometry.fill",
      //     "stylers": [
      //       {
      //         "color": "#a5b076"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "poi.park",
      //     "elementType": "labels.text.fill",
      //     "stylers": [
      //       {
      //         "color": "#447530"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "poi.school",
      //     "stylers": [
      //       {
      //         "visibility": "simplified"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "poi.sports_complex",
      //     "stylers": [
      //       {
      //         "visibility": "simplified"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "road",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#f5f1e6"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "road.arterial",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#fdfcf8"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "road.highway",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#f8c967"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "road.highway",
      //     "elementType": "geometry.stroke",
      //     "stylers": [
      //       {
      //         "color": "#e9bc62"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "road.highway.controlled_access",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#e98d58"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "road.highway.controlled_access",
      //     "elementType": "geometry.stroke",
      //     "stylers": [
      //       {
      //         "color": "#db8555"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "road.local",
      //     "stylers": [
      //       {
      //         "visibility": "off"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "road.local",
      //     "elementType": "labels.text.fill",
      //     "stylers": [
      //       {
      //         "color": "#806b63"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "transit.line",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#dfd2ae"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "transit.line",
      //     "elementType": "labels.text.fill",
      //     "stylers": [
      //       {
      //         "color": "#8f7d77"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "transit.line",
      //     "elementType": "labels.text.stroke",
      //     "stylers": [
      //       {
      //         "color": "#ebe3cd"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "transit.station",
      //     "elementType": "geometry",
      //     "stylers": [
      //       {
      //         "color": "#dfd2ae"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "water",
      //     "elementType": "geometry.fill",
      //     "stylers": [
      //       {
      //         "color": "#b9d3c2"
      //       }
      //     ]
      //   },
      //   {
      //     "featureType": "water",
      //     "elementType": "labels.text.fill",
      //     "stylers": [
      //       {
      //         "color": "#92998d"
      //       }
      //     ]
      //   }
      // ]

      [
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.school",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi.sports_complex",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit.station.bus",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "saturation": "21"
                },
                {
                    "weight": "4.05"
                }
            ]
        }
    ]

    };

    return (
      <>
        <UserNavbar />
        <main className="profile-page" ref="main">
          <section className="section-profile-cover section-shaped my-0">
            <div className="shape shape-style-1 shape-default alpha-4">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="separator separator-bottom separator-skew">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-white"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </section>
          <section className="section mt--200">
            <Container className="mt--50 pb-5" fluid>
              <Row>
                <div className="col">
                  <Card 
                  className="shadow border-0 shadow mt--300"
                  >
                    {/* <div style={{ margin: "100px" }}> */}
                      <Map
                        google={this.props.google}
                        center={{ lat: 33.6844, lng: 73.0479 }}
                        height="300px"
                        zoom={15}
                        options={mapOptions}
                      />
                       {/* {this.showMarker()} */}
                    {/* </div> */}
                  </Card>
                </div>
              </Row>

              <Row 
              // className="justify-content-center"
              >
                <Col 
                // lg="11"
                >
                  <div 
                  // className="container-fluid bg-3 text-center"
                  >
                    <div className="row justify-content-center" style={{paddingTop:"70px"}}>
                      {this.state.places.map((data, index) => (
                        <PlaceCard item={data} key={index} />
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
        </main>
        <SimpleFooter />
      </>
    );
  }
}
export default ExploreAroundMe;
