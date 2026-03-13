/*global google*/

import React from "react";
import moment from "moment";
import SmoothImage from "react-smooth-image";
import Rater from "react-rater";
import "react-rater/lib/react-rater.css";
// reactstrap components
import {
  // UncontrolledCollapse,
  // NavbarBrand,
  // Navbar,
  // NavItem,
  // NavLink,
  // Nav,
  Button,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardLink,
  CardTitle,
  CardSubtitle,
  Input,
  UncontrolledTooltip,
  Row,
  UncontrolledPopover,
  PopoverBody,
  PopoverHeader,
  Form,
  Container,
  UncontrolledCollapse,
  Collapse,
  Modal,
} from "reactstrap";
import * as firebase from "firebase";

// git project https://github.com/erikflowers/weather-icons
// import "weather-icons/css/weather-icons.css";
import Weather from "../components/weather";
import { Link } from "react-router-dom";

const Api_Key = "e5ce2de5690065c5047368704599552a";

class PlaceCard extends React.Component {
  //   user = firebase.auth().currentUser;

  user = JSON.parse(localStorage.getItem("uid"));
  firestoreUsersRef = firebase.firestore().collection("users");
  firestorePostRef = firebase.firestore().collection("posts");
  firestoreFollowingRef = firebase
    .firestore()
    .collection("users")
    .doc(this.user)
    .collection("following");
  firestorePlacesRecommendationsRef = firebase
    .firestore()
    .collection("placesRecommendations")
    .doc(this.user)
    .collection("recommendedPlaces")
    .doc(this.user);

  constructor() {
    super();
    this.state = {
      user: JSON.parse(localStorage.getItem("uid")),
      userLat: "33.6829308",
      userLong: "73.005094",
      places: [],
      currentLocation: {},
      placeType: "tourist_attraction",
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      celsius: undefined,
      temp_max: null,
      temp_min: null,
      description: "",
      error: false,
    };

    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Atmosphere: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-day-fog",
    };
  }

  // get_WeatherIcon(icons, rangeId) {
  //   switch (true) {
  //     case rangeId >= 200 && rangeId < 232:
  //       this.setState({ icon: icons.Thunderstorm });
  //       break;
  //     case rangeId >= 300 && rangeId <= 321:
  //       this.setState({ icon: icons.Drizzle });
  //       break;
  //     case rangeId >= 500 && rangeId <= 521:
  //       this.setState({ icon: icons.Rain });
  //       break;
  //     case rangeId >= 600 && rangeId <= 622:
  //       this.setState({ icon: icons.Snow });
  //       break;
  //     case rangeId >= 701 && rangeId <= 781:
  //       this.setState({ icon: icons.Atmosphere });
  //       break;
  //     case rangeId === 800:
  //       this.setState({ icon: icons.Clear });
  //       break;
  //     case rangeId >= 801 && rangeId <= 804:
  //       this.setState({ icon: icons.Clouds });
  //       break;
  //     default:
  //       this.setState({ icon: icons.Clouds });
  //   }
  // }

  calCelsius(temp) {
    let cell = Math.floor(temp - 273.15);
    return cell;
  }

  getWeather = async () => {
    // e.preventDefault();
    const { item } = this.props;

    const lat = item.marker.latitude;
    const lon = item.marker.longitude;

    if (lat && lon) {
      const api_call = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${Api_Key}`
      );

      const response = await api_call.json();

      this.setState({
        // city: `${response.name}, ${response.sys.country}`,
        // country: response.sys.country,
        main: response.weather[0].main,
        celsius: this.calCelsius(response.main.temp),
        // temp_max: this.calCelsius(response.main.temp_max),
        // temp_min: this.calCelsius(response.main.temp_min),
        description: response.weather[0].description,
        error: false,
      });

      // seting icons
      // this.get_WeatherIcon(this.weatherIcon, response.weather[0].id);

      // console.log(response);
    } else {
      this.setState({
        error: true,
      });
    }
  };

  // state = {
  //   // user: firebase.auth().currentUser,
  // };

  componentDidMount = () => {
    // this.getProfilePic();
    // this.getPlaces();

    this.getWeather();
  };
  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  renderImage = () => {
    const { item } = this.props;

    if (item.photos) {
      const baseUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=`;
      // const location = `location=${lat},${long}&radius=${radius}`;
      // const typeData = `&types=${type}`;
      const pr = item.photos[0].photo_reference;

      const api = `&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
      // return `${baseUrl}${pr}${api}`;
      return (
        <img
          style={{
            width: "400px",
            height: "300px",
            display: "block",
            objectFit: "cover",
          }}
          className="rounded"
          referrerPolicy="no-referrer"
          src={`${baseUrl}${pr}${api}`}
        />
      );
    } else {
      return (
        <img
          style={{
            width: "400px",
            height: "300px",
            display: "block",
            objectFit: "cover",
          }}
          className="rounded"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"
        />
      );
    }

    // console.log("no photo available for the place.");
  };

  types = () => {
    const { item } = this.props;
    const r0 = item.type[0];
    // return <p className="text-muted mb-0">{r0}</p>;
    return <cite style={{ color: "cyan" }}>{r0} </cite>;
  };

  renderRating = () => {
    const { item } = this.props;
    return (
      <>
        <Rater total={5} rating={item.rating} interactive={false} />

        {/* <p className="description">{item.rating}</p> */}
      </>
    );
  };

  showOnMap = () => {
    const { item } = this.props;

    localStorage.setItem("lat", JSON.stringify(item.marker.latitude));
    localStorage.setItem("lon", JSON.stringify(item.marker.longitude));
    localStorage.setItem("place", JSON.stringify(item.name));
    localStorage.setItem("placeId", JSON.stringify(item.place_id));
    // console.log(
    //   "lat: " + item.marker.latitude + "long: " + item.marker.longitude
    // );
  };
  //   getPlaces = () => {
  //     const markers = [];
  //     // this.firestorePlacesRecommendationsRef
  //     firebase
  //     .firestore()
  //     .collection("placesRecommendations")
  //     .doc(this.state.user)
  //     .collection("recommendedPlaces")
  //     .doc(this.state.user)
  //       .onSnapshot((res) => {
  //         // console.log(res.results);
  //         console.log(res.data().places.length)
  //         res.data().places.map((element, index) => {
  //           const marketObj = {};
  //           marketObj.id = element.id;
  //           marketObj.place_id = element.place_id;
  //           marketObj.name = element.name;
  //           marketObj.photos = element.photos;
  //           marketObj.rating = element.rating;
  //           marketObj.vicinity = element.vicinity;
  //           marketObj.type = element.types;
  //           marketObj.marker = {
  //             latitude: element.geometry.location.lat,
  //             longitude: element.geometry.location.lng,
  //           };

  //           markers.push(marketObj);
  //         });

  //         this.setState({ places: markers });
  //         console.log(this.state.places);
  //       });

  //   };

  render() {
    const { item } = this.props;
    return (
      <div style={{ padding: "5px" }}>
        <Card
          // body inverse
          style={{
            backgroundColor: "#F2F2F2",
            borderColor: "#F2F2F2",
            borderBottomLeftRadius: "35px",
            borderBottomRightRadius: "35px",
          }}
        >
          {this.renderImage()}
          <CardBody>
            <CardTitle style={{fontFamily:"'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif"}}>
              {item.name}<span className="ml-auto text-right" style={{right:"40px", position:"absolute"}}> {this.renderRating()}</span>
            </CardTitle>
            <CardSubtitle className="description">
              {/* {this.renderRating()} */}
              {/* <br/> */}
              {this.types()} <i className="ni ni-tag" />
            </CardSubtitle>
          </CardBody>

          <CardBody>
            <CardText>
              <h6 className="description">Weather: </h6>
              <p className="description text-capitalize">
                {" "}
                {this.state.description}
              </p>
              <h6 className="description">Temperature: </h6>
              <p className="description text-capitalize">
                {" "}
                {this.state.celsius} C
              </p>
            </CardText>
            <CardText>
              <i className="ni ni-pin-3" /> {item.vicinity}
            </CardText>
            <CardLink
              href="#"
              onClick={() => {
                this.showOnMap();
              }}
            >
              {" "}
              <i className="ni ni-square-pin" /> Show on Map
            </CardLink>
            <CardLink href="#">
              {" "}
              <i className="ni ni-book-bookmark" /> View Details
            </CardLink>
          </CardBody>
        </Card>
      </div>

      //   <div className="media-list">
      //     <div className="media media-comment">
      //       <img
      //         alt="Image placeholder"
      //         className="media-comment-avatar avatar rounded-circle"
      //         style={{
      //           // width: "200px",
      //           // height: "200px",
      //           display: "block",
      //           objectFit: "cover",
      //         }}
      //         // src={this.state.profilePic}
      //         // className="rounded-circle img-responsive"

      //         src={this.state.profilePic}
      //       />
      //       <div className="media-body">
      //         <div className="media-comment-text">
      //           <h4>
      //             <Badge color="secondary">{item.commentData.username}</Badge>
      //           </h4>
      //           <p className="text-sm lh-160">{item.commentData.comment}</p>
      //         </div>
      //       </div>

      //       {item.commentData.userId == this.state.currentUserId ? (
      //         <DeleteOutline onClick={this.deleteComment} fontSize="small" />
      //       ) : (
      //         ""
      //       )}
      //     </div>
      //   </div>
    );
  }
}

export default PlaceCard;
