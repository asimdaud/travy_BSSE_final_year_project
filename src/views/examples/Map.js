import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker,
} from "react-google-maps";
import Rater from "react-rater";
import { Link } from "react-router-dom";
import {
  Card,
  Modal,
  Button,
  Row,
  Col,
  CardImg,
  CardText,
  CardBody,
  CardLink,
  CardTitle,
  CardSubtitle,
  UncontrolledCarousel,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";
import BadgeLabel from "../../components/Badge";
import Autocomplete from "react-google-autocomplete";
import Geocode from "react-geocode";
Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
Geocode.enableDebug();

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultModal: false,
      carousel: false,
      placeDetails: {},
      itemState: [],
      address: "",
      city: "",
      area: "",
      state: "",
      mapPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng,
      },
      markerPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng,
      },
    };
  }
  /**
   * Get the current address from the default map position and set those values in the state
   */
  componentDidMount() {
    this.markerExplore();

    Geocode.fromLatLng(
      this.state.mapPosition.lat,
      this.state.mapPosition.lng
    ).then(
      (response) => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);

        console.log("city", city, area, state);

        this.setState({
          address: address ? address : "",
          area: area ? area : "",
          city: city ? city : "",
          state: state ? state : "",
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }
  /**
   * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
   *
   * @param nextProps
   * @param nextState
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.markerPosition.lat !== this.props.center.lat ||
      this.state.address !== nextState.address ||
      this.state.city !== nextState.city ||
      this.state.area !== nextState.area ||
      this.state.state !== nextState.state
    ) {
      return true;
    } else if (this.props.center.lat === nextProps.center.lat) {
      return false;
    }
  }
  /**
   * Get the city and set the city input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getCity = (addressArray) => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_2" === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };
  /**
   * Get the area and set the area input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getArea = (addressArray) => {
    let area = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };
  /**
   * Get the address and set the address input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getState = (addressArray) => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "administrative_area_level_1" === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };
  /**
   * And function for city,state and address input
   * @param event
   */
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  /**
   * This Event triggers when the marker window is closed
   *
   * @param event
   */
  onInfoWindowClose = (event) => {};
  /**
   * When the user types an address in the search box
   * @param place
   */
  onPlaceSelected = (place) => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    // Set these values in the state.
    this.setState({
      address: address ? address : "",
      area: area ? area : "",
      city: city ? city : "",
      state: state ? state : "",
      markerPosition: {
        lat: latValue,
        lng: lngValue,
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue,
      },
    });
  };

  markerExplore = () => {
    const latValue = JSON.parse(localStorage.getItem("lat"))
      ? JSON.parse(localStorage.getItem("lat"))
      : 33;
    const lngValue = JSON.parse(localStorage.getItem("lon"))
      ? JSON.parse(localStorage.getItem("lon"))
      : 77;
    this.setState({
      markerPosition: {
        lat: latValue,
        lng: lngValue,
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue,
      },
    });
  };
  /**
   * When the marker is dragged you get the lat and long using the functions available from event object.
   * Use geocode to get the address, city, area and state from the lat and lng positions.
   * And then set those values in the state.
   *
   * @param event
   */
  onMarkerDragEnd = (event) => {
    console.log("event", event);
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng(),
      addressArray = [];
    Geocode.fromLatLng(newLat, newLng).then(
      (response) => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);
        this.setState({
          address: address ? address : "",
          area: area ? area : "",
          city: city ? city : "",
          state: state ? state : "",
        });
      },
      (error) => {
        console.error(error);
      }
    );
  };

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  getCurrentLocation = async () => {
    let lat = "";
    let long = "";
    await navigator.geolocation.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      long = position.coords.longitude;
      console.log(lat + "|" + long);
    });
  };

  getPlaceDetails = (place_id) => {
    const baseUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=`;
    // const placeId = JSON.parse(localStorage.getItem("placeId")) ;
    // const placeId = place_id;
    const fields =
      "&fields=name,types,geometry,website,photos,price_level,rating,url,formatted_phone_number,formatted_address";
    const api = `&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;

    return `${baseUrl}${place_id}${fields}${api}`;
  };

  renderPlaceDetails = () => {
    const placeId = JSON.parse(localStorage.getItem("placeId"));
    const url = this.getPlaceDetails(placeId);
    const PROXY_URL = "https://cors-anywhere.herokuapp.com/";
    // fetch(url,  { headers: new HttpHeaders({'Authorization': 'Bearer '})})

    // fetch(url, { mode: 'no-cors'})
    fetch(PROXY_URL + url)
      .then((res) => res.json())
      .then((res) => {
        const marketObj = {};
        marketObj.name = res.result.name ? res.result.name : "N/A";
        marketObj.types = res.result.types ? res.result.types : "N/A";
        marketObj.website = res.result.website ? res.result.website : "N/A";
        marketObj.photos = res.result.photos ? res.result.photos : "N/A";
        marketObj.price_level = res.result.price_level
          ? res.result.price_level
          : "N/A";
        marketObj.rating = res.result.rating ? res.result.rating : "N/A";
        marketObj.url = res.result.url ? res.result.url : "N/A";
        marketObj.formatted_phone_number = res.result.formatted_phone_number
          ? res.result.formatted_phone_number
          : "N/A";
        marketObj.formatted_address = res.result.formatted_address
          ? res.result.formatted_address
          : "N/A";
        marketObj.marker = {
          latitude: res.result.geometry.location.lat,
          longitude: res.result.geometry.location.lng,
        };
        // markers.push(marketObj);
        this.setState({ placeDetails: marketObj });
        console.log(this.state.placeDetails);
      });
  };

  renderTypes = () => {
    if (this.state.placeDetails.types) {
      //   return(
      //  <div>  { this.state.placeDetails.types.map((data, index) => {
      //     <BadgeLabel item={data} key={index} />
      //   })}
      //   </div>
      //   );}
      return (
        <div>
          {this.state.placeDetails.types.map((data, index) => (
            <BadgeLabel item={data} key={index} />
            // <Post item={post} key={postindex} />
          ))}
        </div>
      );
    }
  };

  renderRating = () => {
    const { item } = this.props;
    return (
      <>
        <Rater
          total={5}
          rating={this.state.placeDetails.rating}
          interactive={false}
        />

        {/* <p className="description">{item.rating}</p> */}
      </>
    );
  };

  renderImage = (photo) => {
    // const { item } = this.props;

    const baseUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=`;
    // const location = `location=${lat},${long}&radius=${radius}`;
    // const typeData = `&types=${type}`;
    const pr = photo.photo_reference;

    const api = `&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
    // return `${baseUrl}${pr}${api}`;
    // return (
    //   <img
    //     style={{
    //       width: "400px",
    //       height: "300px",
    //       display: "block",
    //       objectFit: "cover",
    //     }}
    //     className="rounded"
    //     referrerPolicy="no-referrer"
    //     src={`${baseUrl}${pr}${api}`}
    //   />

    // );
    // console.log(`${baseUrl}${pr}${api}`);
    return `${baseUrl}${pr}${api}`;

    // console.log("no photo available for the place.");
  };

  renderCarousel = () => {
    let photos = [];

    if (this.state.placeDetails.photos) {
      this.state.placeDetails.photos.map((element, index) => {
        let sources = {};
        sources = this.renderImage(element);
        let key = index;

        photos.push(sources);
      });

      let items = [];
      let pics = {};

      items = photos.map((data, index) => ({
        src: data,
      }));
      // this.state.itemState.push(pics);

      //       console.log(pics)

      this.setState({ itemState: items, carousel: true });
      // console.log(items);
      // console.log(this.state.itemState);

      // console.log(this.state.itemState);
      // console.log(photos[2]);
      // return this.state.itemState;
      // <UncontrolledCarousel items={items} />
      //   <CarouselItem
      //   key={items.src}
      // >
      //   <img src={items.src} alt={items.altText} />
      // </CarouselItem>
    }
  };
  // <script crossorigin src="https://maps.googleapis.com/maps/api/place/details/json?"></script>

  AsyncMap = withScriptjs(
    withGoogleMap((props) => (
      <GoogleMap
        panTo={{
          lat: JSON.parse(localStorage.getItem("lat"))
            ? JSON.parse(localStorage.getItem("lat"))
            : this.state.markerPosition.lat,
          lng: JSON.parse(localStorage.getItem("lon"))
            ? JSON.parse(localStorage.getItem("lon"))
            : this.state.markerPosition.lng,
        }}
        google={this.props.google}
        defaultZoom={this.props.zoom}
        defaultCenter={{
          lat: JSON.parse(localStorage.getItem("lat"))
            ? JSON.parse(localStorage.getItem("lat"))
            : this.state.markerPosition.lat,
          lng: JSON.parse(localStorage.getItem("lon"))
            ? JSON.parse(localStorage.getItem("lon"))
            : this.state.markerPosition.lng,
        }}
        setCenter={{lat: JSON.parse(localStorage.getItem("lat"))
        ? JSON.parse(localStorage.getItem("lat"))
        : this.state.markerPosition.lat,
      lng: JSON.parse(localStorage.getItem("lon"))
        ? JSON.parse(localStorage.getItem("lon"))
        : this.state.markerPosition.lng,}}
        styles={this.props.styles}
        options={this.props.options}
      >
        {/* For Auto complete Search Box */}
        <Autocomplete
          style={{
            width: "100%",
            height: "40px",
            paddingLeft: "16px",
            marginTop: "2px",
            marginBottom: "100px",
          }}
          onPlaceSelected={this.onPlaceSelected}
          types={["(regions)"]}
        />
        {/*Marker*/}
        <Marker
          options={{
            icon: {
              url: require("assets/img/icons/map/location-pin.png"),
              scaledSize: { width: 40, height: 40 },
            },
          }}
          google={this.props.google}
          name={this.markerExplore}
          draggable={false}
          onDragEnd={this.onMarkerDragEnd}
          position={{
            // lat: this.state.markerPosition.lat,
            // lng: this.state.markerPosition.lng,
            lat: JSON.parse(localStorage.getItem("lat"))
              ? JSON.parse(localStorage.getItem("lat"))
              : this.state.markerPosition.lat,

            lng: JSON.parse(localStorage.getItem("lon"))
              ? JSON.parse(localStorage.getItem("lon"))
              : this.state.markerPosition.lng,
          }}
          onClick={() => {
            this.setState({ defaultModal: true });
            this.renderPlaceDetails();
            // this.setState({ modalItem: this.state.posts[index] });
          }}
        />
        <Marker />
        {/* InfoWindow on top of marker */}
        <InfoWindow
          onClose={this.onInfoWindowClose}
          position={{
            // lat: JSON.parse(localStorage.getItem("lat")) + 0.0018,
            // lng: JSON.parse(localStorage.getItem("lon"))

            lat: JSON.parse(localStorage.getItem("lat"))
              ? JSON.parse(localStorage.getItem("lat")) + 0.0018
              : this.state.markerPosition.lat + 0.0018,
            lng: JSON.parse(localStorage.getItem("lon"))
              ? JSON.parse(localStorage.getItem("lon"))
              : this.state.markerPosition.lng,
          }}
        >
          <div>
            <span style={{ padding: 0, margin: 0 }}>
              {/* {this.state.address} */}
              {JSON.parse(localStorage.getItem("place"))
                ? JSON.parse(localStorage.getItem("place"))
                : "N/A"}
            </span>
          </div>
        </InfoWindow>
      </GoogleMap>
    ))
  );

  render() {
    let map;
    if (this.props.center.lat !== undefined) {
      map = (
        <div>
          {/* <div>
            <div className="form-group">
              <label htmlFor="">City</label>
              <input
                type="text"
                name="city"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.city}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Area</label>
              <input
                type="text"
                name="area"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.area}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">State</label>
              <input
                type="text"
                name="state"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.state}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.address}
              />
            </div>
          </div> */}

          <Modal
            fluid
            size="md"
            isOpen={this.state.defaultModal}
            toggle={() => this.toggleModal("defaultModal")}
          >
            <Card
              // body inverse
              style={{
                backgroundColor: "#F2F2F2",
                borderColor: "#F2F2F2",
                //  padding:"1px"
              }}
            >
              <div
                className="rounded"
                style={{
                  // width: "100%",
                  // height: "600px",
                  display: "inline-block",
                  objectFit: "cover",
                  overflow: "auto",
                  zoom: "50%",
                }}
              >
                {this.state.carousel && (
                  <UncontrolledCarousel
                    indicators={true}
                    controls={true}
                    items={this.state.itemState}
                  />
                )}
              </div>
              <CardBody className="justify-content-center">
                {/* {this.renderCarousel()} */}

                {/* <UncontrolledCarousel items={this.state.itemState} /> */}
                {/* <img src={this.state.itemState.src} /> */}

                <CardTitle>{this.state.placeDetails.name}</CardTitle>
                <CardSubtitle>
                  <p className="description text-capitalize">
                    {" "}
                    {this.state.placeDetails.formatted_address}
                  </p>
                  {this.renderRating()}
                </CardSubtitle>
              </CardBody>

              <CardBody>
                <h6 className="description">Place Type: </h6>
                {this.renderTypes()}
                <CardText>
                  <br />
                  {!this.state.placeDetails.price_level != "N/A" && (
                    <>
                      <h6 className="description">Price Level: </h6>
                      {this.state.placeDetails.price_level}
                    </>
                  )}
                </CardText>
                {this.state.placeDetails.formatted_phone_number != "N/A" && (
                  <CardText>
                    <i className="ni ni-mobile-button" />{" "}
                    {this.state.placeDetails.formatted_phone_number}
                  </CardText>
                )}

                <CardLink
                  href={this.state.placeDetails.website}
                  style={{ fontSize: "12px" }}
                >
                  {" "}
                  <i className="ni ni-pin-3" /> View their website
                </CardLink>

                <CardLink
                  href={this.state.placeDetails.url}
                  style={{ fontSize: "12px" }}
                >
                  {" "}
                  <i className="ni ni-square-pin" /> More on Google Maps
                </CardLink>
              </CardBody>
              {!this.state.carousel && (
                <Button
                  // className="mr-4"
                  color="info"
                  size="sm"
                  onClick={() => {
                    this.renderCarousel();
                  }}
                >
                  View Photos
                </Button>
              )}
            </Card>

            {/* {this.state.modalItem && 
          <p item={this.state.modalItem}
> MODAL</p>
           } */}

            {/* 

        marketObj.photos = res.result.photos;
        marketObj.url = res.result.url;
        marketObj.marker = {
          latitude: res.result.geometry.location.lat,
          longitude: res.result.geometry.location.lng,
        }; */}
            {/* 
            <Card>
              <h2 className="title">Place's details</h2>
              <Row>
                <Col lg="4">Name:</Col>
                <Col lg="8">
                  <p>{this.state.placeDetails.name}</p>
                </Col>
              </Row>
              <Row>
                <Col lg="4">Place types:</Col>
                <Col lg="8">
                  <p>{this.state.placeDetails.types}</p>
                </Col>
              </Row>
              <Row>
                <Col lg="4">Price level:</Col>
                <Col lg="8">
                  <p>{this.state.placeDetails.price_level}</p>
                </Col>
              </Row>
              <Row>
                <Col lg="4">Rating:</Col>
                <Col lg="8">
                  <p>{this.state.placeDetails.rating}</p>
                </Col>
              </Row>
              <Row>
                <Col lg="4">Contact:</Col>
                <Col lg="8">
                  <p>{this.state.placeDetails.formatted_phone_number}</p>
                </Col>
              </Row>
              <Row>
                <Col lg="4">Address:</Col>
                <Col lg="8">
                  <p>{this.state.placeDetails.formatted_address}</p>
                </Col>
              </Row>
              <Row>
                <Col lg="4">Website:</Col>
                <Col lg="8">
                  <p>{this.state.placeDetails.website}</p>
                </Col>
              </Row>
              <Row>
                <Col >
                <Link to={this.state.placeDetails.url}>
                <i className="ni ni-world-2" />
                      </Link>
                </Col>
                </Row>

            </Card> */}
          </Modal>
          <this.AsyncMap
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=visualization,places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: this.props.height }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      );
    } else {
      map = <div style={{ height: this.props.height }} />;
    }
    return map;
  }
}
export default Map;

