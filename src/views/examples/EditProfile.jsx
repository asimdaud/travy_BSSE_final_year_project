import React from "react";
import moment from "moment";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Badge,
  Col,
  Modal,
} from "reactstrap";
// import DemoNavbar from "components/Navbars/DemoNavbar";
import UserNavbar from "components/Navbars/UserNavbar";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
// import {profilePic} from "../examples/Profile";
import * as firebase from "firebase";
import { Link } from "react-router-dom";
import Interests from "../examples/Interests";

import { EditUser } from "../../services/authServices";
// import { ImageAspectRatio } from "@material-ui/icons";

// const user3 = JSON.parse(localStorage.getItem("uid"));

class EditProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user3: JSON.parse(localStorage.getItem("uid")),
      uid: "uid",
      profilePic:
        "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
      username: "Username",
      bio: "This is my bio",
      name: "Name",
      email: "email@default.com",
      publicProfile: true,
      interestsArr: [],
      // posts: [],
      // loading: true
      // showModal: false,
      // defaultModal: false
      defaultModal: false,
      modalItem: "",
      progress: 0,
      isLoading: false,
    };
  }

  toggleChange = () => {
    this.setState({
      publicProfile: !this.state.publicProfile, // flip boolean value
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, name, bio, publicProfile } = this.state;
    console.log(this.state);
    EditUser(username, name, bio, publicProfile);
  };

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  componentWillMount = async () => {
    firebase
      .firestore()
      .collection("users")
      .doc(this.state.user3)
      .onSnapshot((doc) => {
        const res = doc.data();

        this.setState({
          username: res.username,
          bio: res.bio,
          name: res.name,
          email: res.email,
          interestsArr: res.interestsArr,
        });
        console.log(res);
      });
    // profile pic
    const firebaseProfilePic = await firebase
      .storage()
      .ref()
      .child("profilePics/(" + this.state.user3 + ")ProfilePic");
    firebaseProfilePic
      .getDownloadURL()
      .then((url) => {
        // Inserting into an State and local storage incase new device:
        this.setState({ profilePic: url });
      })
      .catch((error) => {
        // Handle any errors
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            this.setState({
              profilePic:
                "https://images.unsplash.com/photo-1502630859934-b3b41d18206c?w=500&h=500&fit=crop",
            });
            break;
          default:
        }
        alert(error);
      });
  };

  onChoosePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ isLoading: true });
      this.currentPhotoFile = event.target.files[0];
      // Check this file is an image?
      const prefixFiletype = event.target.files[0].type.toString();
      if (prefixFiletype.indexOf("image/") === 0) {
        // this.uploadPhoto();
        this.handleUpload();
      } else {
        this.setState({ isLoading: false });
        this.props.showToast(0, "This file is not an image");
      }
    } else {
      this.setState({ isLoading: false });
    }
  };

  uploadPhoto = () => {
    const uploadTask = firebase
      .storage()
      .ref()
      .child("profilePics/(" + this.state.user3 + ")ProfilePic")
      .put(this.currentPhotoFile);

    uploadTask.on(
      // "state_changed",
      // null,
      (snapshot) => {
        const getProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress: getProgress });
      },
      (err) => {
        this.setState({ isLoading: false });
        // this.props.showToast(0, err.message);
      },

      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          this.setState({ isLoading: false });
          // this.onSendMessage(downloadURL, 1);
        });
      }
    );
  };

  handleUpload = () => {
    const uploadTask = firebase
      .storage()
      .ref()
      .child("profilePics/(" + this.state.user3 + ")ProfilePic")
      .put(this.currentPhotoFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function ...
        const getProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress: getProgress });
      },
      (error) => {
        // Error function ...
        console.log(error);
      },
      () => {
        // complete function ...

        // profile pic
        const firebaseProfilePic = firebase
          .storage()
          .ref()
          .child("profilePics/(" + this.state.user3 + ")ProfilePic");
        firebaseProfilePic
          .getDownloadURL()
          .then((url) => {
            // Inserting into an State and local storage incase new device:
            this.setState({ profilePic: url });
          })
          .catch((error) => {
            // Handle any errors
            switch (error.code) {
              case "storage/object-not-found":
                // File doesn't exist
                this.setState({
                  profilePic:
                    "https://images.unsplash.com/photo-1502630859934-b3b41d18206c?w=500&h=500&fit=crop",
                });
                break;
              default:
            }
            console.log(error);
          });
      }
    );
  };

  render() {
    return (
      <>
        <UserNavbar />
        <main className="profile-page" ref="main">
          <section className="section-profile-cover section-shaped my-0">
            {/* Circles background */}
            <div className="shape shape-style-2 shape-default alpha-4">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            {/* SVG separator */}
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
          {/* Page content */}
          <section className="section">
            <Container className="mt--150" fluid>
              <Row className="justify-content-center">
                <Col className="order-xl-1" xl="8">
                  <Card className="card-profile shadow mt--300">
                    <CardHeader className="bg-white border-0">
                      <Row className="align-items-center">
                        <Col xs="8">
                          <h3 className="mb-0">My account</h3>
                        </Col>
                        <Col className="text-right" xs="4">
                          <Button
                            color="info"
                            type="submit"
                            onClick={this.handleSubmit}
                            size="sm"
                          >
                            Save
                          </Button>

                          <Button
                            color="default"
                            size="sm"
                            to="/profile"
                            tag={Link}
                          >
                            Back to profile
                          </Button>
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <Form role="form" onSubmit={this.handleSubmit}>
                        <div className="pl-lg-4">
                          <Row className="justify-content-center">
                            <Col lg="8">
                              <FormGroup>
                                <Row className="justify-content-center">
                                  <a
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    <img
                                      // className="rounded img-responsive"
                                      alt="..."
                                      style={{
                                        width: "200px",
                                        height: "200px",
                                        display: "block",
                                        objectFit: "cover",
                                      }}
                                      src={this.state.profilePic}
                                      className="rounded-circle img-responsive"
                                    />

                                    {/* crop: {
      unit: 'px', // default, can be 'px' or '%'
      x: 130,
      y: 50,
      width: 200,
      height: 200
    }
     
    <ReactCrop src="path/to/image.jpg" crop={this.state.crop} /> */}
                                  </a>
                                </Row>{" "}
                                <Row className="justify-content-center">
                                  <label
                                    className="form-control-label"
                                    // htmlFor="input-username"
                                  >
                                    <h6 className="description">
                                      {" "}
                                      Profile Picture
                                    </h6>{" "}
                                  </label>
                                </Row>
                                <Row className="justify-content-center">
                                  <Col lg="4"></Col>
                                  <Col>
                                    <input
                                      ref={(el) => {
                                        this.refInput = el;
                                      }}
                                      accept="image/*"
                                      className="small"
                                      type="file"
                                      onChange={this.onChoosePhoto}
                                    />

                                    <progress
                                      value={this.state.progress}
                                      max="100"
                                    />
                                  </Col>
                                </Row>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  // htmlFor="input-username"
                                >
                                  {" "}
                                  <h4 className="description">Username</h4>
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  placeholder={this.state.username}
                                  type="text"
                                  id="username"
                                  onChange={this.handleChange}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  // htmlFor="input-last-name"
                                >
                                  <h4 className="description">Display Name</h4>
                                </label>

                                <Input
                                  className="form-control-alternative"
                                  placeholder={this.state.name}
                                  type="text"
                                  id="name"
                                  onChange={this.handleChange}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <br />
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label className="form-control-label">
                                  {" "}
                                  <h4 className="description">
                                    Profile privacy settings
                                  </h4>
                                </label>

                                <div className="custom-control custom-checkbox mb-3">
                                  <input
                                    className="custom-control-input"
                                    id="publicProfile"
                                    type="checkbox"
                                    checked={!this.state.publicProfile}
                                    onChange={this.toggleChange}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="publicProfile"
                                  >
                                    <p className="description">
                                      Private profile
                                    </p>
                                  </label>
                                </div>
                                {/* <div className="custom-control custom-radio mb-3">
                                <input
                                  className="custom-control-input"
                                  id="publicProfile"
                                  name="radio1"
                                  type="radio"
                                  checked={this.state.publicProfile === false}
                                  onChange={this.handleChange} 

                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="customRadio1"
                                >
                                  <span>Private</span>
                                </label>
                              </div>
                              <div className="custom-control custom-radio mb-3">
                                <input
                                  className="custom-control-input"
                                  defaultChecked
                                  id="publicProfile"
                                  name="radio2"
                                  checked={this.state.publicProfile === true}
                                  onChange={this.handleChange} 
                                  type="radio"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="customRadio2"
                                >
                                  <span>Public</span>
                                </label>
                              </div> */}
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <hr className="my-4" />
                        {/* Description */}
                        <h6 className="heading-small text-muted mb-4">
                          About Me
                        </h6>
                        <div className="pl-lg-4">
                          <FormGroup>
                            <label>My Bio</label>
                            <Input
                              className="form-control-alternative"
                              rows="4"
                              placeholder={this.state.bio}
                              type="textarea"
                              id="bio"
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                          <label>Add Interests</label>{" "}
                          <div className="pl-lg-4">
                            <Row className="justify-content-center">
                              <h6 className="description">Interests:</h6>
                              <p className="description text-capitalize">
                                {this.state.interestsArr
                                  // .slice(0, 3)
                                  .map((data, index) => (
                                    <>
                                      <Badge
                                        className="text-uppercase"
                                        color="success"
                                        pill
                                      >
                                        {data}
                                      </Badge>

                                      {/* <div className="custom-control custom-checkbox mb-3">
                                        <input
                                          className="custom-control-input"
                                          id={data}
                                          type="checkbox"
                                          checked={!this.state.interestsArr.data}
                                          onChange={this.toggleChange}
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor={data}
                                        >
                                          <p className="description">
                                            {data}
                                          </p>
                                        </label>
                                      </div> */}
                                    </>
                                  ))}
                              </p>
                            </Row>
                          </div>
                        </div>

                        <hr className="my-4" />
                      </Form>
                      <Form
                      // role="form" onSubmit={this.handleSubmit }
                      >
                        {/* Passowrd change */}
                        <h6 className="heading-small text-muted mb-4">
                          Change Password
                        </h6>
                        <Row>
                          <Col lg="3"></Col>
                          <Col lg="6">
                            <div className="pl-lg-4 justify-content-center">
                              <FormGroup>
                                {/* <label>Old Password</label> */}
                                <Input
                                  className="form-control-alternative"
                                  placeholder="Old password"
                                  type="password"
                                  id="password"
                                  // onChange={this.handleChange}
                                  autoComplete="off"
                                />
                                <br />
                                {/* <label>New Password</label> */}
                                <Input
                                  className="form-control-alternative"
                                  placeholder="New Password"
                                  type="password"
                                  id="password"
                                  // onChange={this.handleChange}
                                  autoComplete="off"
                                />
                              </FormGroup>
                            </div>
                          </Col>
                          <Col lg="3"></Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>
        </main>

        <Modal
          size="lg"
          isOpen={this.state.defaultModal}
          toggle={() => this.toggleModal("defaultModal")}
          className="fluid"
        >
          <Interests />
        </Modal>
        <SimpleFooter />
      </>
    );
  }
}

export default EditProfile;
