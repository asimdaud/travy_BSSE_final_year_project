import React from "react";
import moment from "moment";

// nodejs library that concatenates classes
import classnames from "classnames";
// reactstrap components
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Modal,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Badge,
  UncontrolledAlert,
} from "reactstrap";
import SmoothImage from "react-smooth-image";
// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import { isUserSignedIn } from "../../services/authServices";
import * as firebase from "firebase";
import Post from "../../components/post";
import { Redirect, Link } from "react-router-dom";
import UserNavbar from "components/Navbars/UserNavbar";

class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      iconTabs: 1,
      plainTabs: 1,
      user3: JSON.parse(localStorage.getItem("uid")),
      uid: "uid",
      profilePic:
        "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
      username: "Username",
      bio: "This is my bio",
      name: "Name",
      email: "email@default.com",
      group: "",
      groupId: JSON.parse(localStorage.getItem("groupId")),
      groupTitle: "",
      groupType: "",
      groupPhoto: "",
      groupDescription: "",
      foundGroups: [],
      myGroups: [],
      suggestedGroups: [],
      allGroups: [],
      groupCreator: [],
      currentMember: {},
      discussion: [],
      loading: true,
      followedUsers: "00",
      following: true,
      joining: false,
      discussion: [],
      myGroups: [],
      isMember: false,
      memberIds: [],
      groupInfo: [],
      members: [],
      isCreator: false,
    };
  }

  UNSAFE_componentWillMount = () => {
    this.isMember();
    this.getCurrentMember();

    this.getMyGroups();
    this.getInterests(() => {
      this.getSuggestedGroups();
      this.getAllGroups();
    });
  };

  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index,
    });
  };

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  //   componentWillMount = () => {
  //     // this.getFollowedUsers();

  //     this.getProfilePic();

  //     this.getFollowedUsers();
  //     this.getPosts();
  //   };

  componentDidMount() {
    this.state.groupId = JSON.parse(localStorage.getItem("groupId"));

    // this.getProfilePic();
    this.getMembers();
    // this.getFollowedUsers();
    this.getPosts();
    this.getGroupInfo();
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;

    // this.getFollowedUsers();
    // this.getPosts();
  }

  getProfilePic = () => {
    if (isUserSignedIn) {
      console.log(this.state.user3);
    }

    firebase
      .firestore()
      .collection("users")
      .doc(this.state.user3)
      .onSnapshot((doc) => {
        const res = doc.data();

        if (res != null) {
          this.setState({
            username: res.username,
            bio: res.bio,
            name: res.name,
            email: res.email,
          });
        }
        console.log(res);
      });
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
  };

  getMyGroups = async (callback) => {
    let myGroups = [];
    await firebase
      .firestore()
      .collection("groups")
      .where("creatorId", "==", this.state.user3)
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          myGroups.push(doc.data());
          this.setState({ myGroups: myGroups });
        });
      })
      .then(async () => {
        await firebase
          .firestore()
          .collection("groups")
          .where("memberIds", "array-contains", this.state.user3)
          .get()
          .then((docs) => {
            docs.forEach((doc) => {
              myGroups.push(doc.data());
              this.setState({ myGroups: myGroups });
            });
          });
      });
  };

  getSuggestedGroups = async () => {
    let suggestedGroups = [];
    let interests = this.state.interests; /// QUERY LIMIT 10
    interests = interests.slice(0, 10); /// QUERY LIMIT 10

    await firebase
      .firestore()
      .collection("groups")
      .where("groupType", "in", interests)
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          if (doc.data().creatorId != this.state.user3) {
            let memberCheckArr = doc
              .data()
              .memberIds.find((memberId) => memberId == this.state.user3);
            if (memberCheckArr != this.state.user3) {
              suggestedGroups.push(doc.data());
              this.setState({ suggestedGroups: suggestedGroups }, () =>
                console.log(this.state.suggestedGroups)
              );
            }
          }
        });
      });
  };

  getAllGroups = async () => {
    let allGroups = [];

    await firebase
      .firestore()
      .collection("groups")
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          allGroups.push(doc.data());
          this.setState({ allGroups: allGroups }, () =>
            console.log(this.state.allGroups)
          );
        });
      });
  };

  getInterests = (callback) => {
    firebase
      .firestore()
      .collection("users")
      .doc(this.state.user3)
      .collection("interests")
      .doc(this.state.user3)
      .get()
      .then((doc) => {
        this.setState(
          {
            interests: doc.data().interestsArr,
          },
          () => {
            console.log(this.state.interests);
            callback();
          }
        );
      });
  };

  getFollowedUsers = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(this.state.user3)
      .collection("userFollowing")
      .onSnapshot((snapshot) => {
        let num = snapshot.size;
        console.log(num);
        this.setState({ followedUsers: num });
      });
  };

  // renderJoinButton = () => {
  //   return (
  //     <div
  //       style={{
  //         backgroundColor: "#efefef",
  //         width: width * 0.3,
  //         height: 35,
  //         alignItems: "center",
  //         borderRadius: 15,
  //         marginLeft: 50,
  //       }}
  //       onPressIn={this.joinGroup}
  //     >
  //       <Card row style={{ marginTop: 5, left: 2 }}>
  //         <p h5 color="grey">
  //           Join
  //         </p>

  //       </Card>
  //     </div>
  //   );
  // };

  renderFollow = () => {
    if (!this.state.isMember) {
      return (
        <Button
          className="mr-4"
          color="info"
          size="sm"
          // shadowless={false}
          // onClick={this.joinGroup}
          onClick={() => this.joinGroup()}
        >
          + JOIN
        </Button>
      );
    }
    if (this.state.isCreator) {
      return (
        <Button
          className="mr-4"
          color="danger"
          size="sm"
          // shadowless={false}
          // onClick={this.joinGroup}
          onClick={() => this.editGroup()}
        >
          + Edit
        </Button>
      );
    }
  };

  joinGroup = () => {
    this.setState({ joining: true });
    let group = this.state.group;
    let members = this.state.members;
    let memberIds = this.state.memberIds;
    let currentMember = this.state.currentMember;

    members.push(currentMember);
    memberIds.push(currentMember.id);
    console.log(members, memberIds, currentMember);
    // console.log();
    firebase
      .firestore()
      .collection("groups")
      .doc(this.state.groupId)
      .set(
        {
          members: members,
          memberIds: memberIds,
        },
        { merge: true }
      )
      .then(() => {
        alert("Joined");
        this.setState({ joining: false });
      })
      .catch((err) => alert(err));
  };

  getCurrentMember = async () => {
    let profilePic = firebase
      .storage()
      .ref()
      .child("profilePics/(" + this.state.user3 + ")ProfilePic");

    await profilePic.getDownloadURL().then(async (url) => {
      await firebase
        .firestore()
        .collection("users")
        .doc(this.state.user3)
        .get()
        .then((doc) => {
          let currentMember = {
            id: this.state.user3,
            name: doc.data().username,
            avatar: url,
            push_token: doc.data().push_token ? doc.data().push_token : "",
          };
          this.setState({ currentMember: currentMember });
        });
    });
  };

  isCreator = () => {
    if (this.state.user3 == this.state.creatorId) {
      this.setState({ isCreator: true });
      return;
    }
  };

  isMember = () => {
    let group = this.state.group;
    let memberIds = [];
    if (this.state.user3 == this.state.creatorId) {
      this.setState({ isMember: true });
      return;
    } else {
      firebase
        .firestore()
        .collection("groups")
        .doc(this.state.groupId)
        .onSnapshot((doc) => {
          this.setState({
            memberIds: doc.data().memberIds,
            members: doc.data().members,
          });
          memberIds = doc.data().memberIds;
          if (memberIds.includes(this.state.user3)) {
            this.setState({ isMember: true });
          } else {
            this.setState({ isMember: false });
          }
        });
    }
  };

  getGroupInfo = () => {
    const cloudImages = [];
    firebase
      .firestore()
      .collection("groups")
      .doc(this.state.groupId)
      .onSnapshot((doc) => {
        const res = doc.data();

        if (res != null) {
          this.setState({
            groupId: res.groupId,
            groupTitle: res.groupTitle,
            groupType: res.groupType,
            groupPhoto: res.groupPhoto,
            groupDescription: res.groupDescription,
            groupCreator: res.groupCreator,
          });
        }
      });
  };

  getPosts = () => {
    const cloudImages = [];
    firebase
      .firestore()
      .collection("groups")
      .doc(this.state.groupId)
      .collection("discussion")
      // .doc(this.state.postId)
      .where("title", "==", "post")
      // .orderBy("time", "desc")
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          let article = {
            username: doc.data().username,
            userId: doc.data().userId,
            title: "post",
            avatar:
              "https://firebasestorage.googleapis.com/v0/b/travycomsats.appspot.com/o/profilePics%2F(" +
              doc.data().userId +
              ")ProfilePic?alt=media&token=69135050-dec6-461d-bc02-487766e1c81d",

            image: doc.data().image,
            // cta: "cta",
            caption: doc.data().caption,
            location: doc.data().location.coordinates,
            locName: doc.data().location.locationName,
            postId: doc.data().postId,
            timeStamp: doc.data().time,
            // likes:0,
            locLatLng: "Address",
          };
          cloudImages.push(article);
        });
      });
    this.setState({ discussion: cloudImages });
  };

  getMembers = () => {
    const markers = [];
    firebase
      .firestore()
      .collection("groups")
      .doc(this.state.groupId)
      .onSnapshot((doc) => {
        const res = doc.data();
        res.members.map((element, index) => {
          const marketObj = {};
          marketObj.avatar = element.avatar;
          marketObj.name = element.name;
          marketObj.id = element.id;
          marketObj.push_token = element.push_token;

          //
          markers.push(marketObj);
        });
        this.setState({ members: markers });
      });
  };

  render() {
    // if (this.state.loading){
    //   return <div>My sweet spinner</div>;
    // }
    return (
      <>
        <UserNavbar />
        <main className="profile-page"  ref="main"
        style={{
          // backgroundImage: "radial-gradient(circle, #053537, #005e5e, #008b85, #00baab, #12ebcf)"
          // backgroundImage: "  linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1)",
          backgroundImage: "linear-gradient(to right, #e4efe9, #d9ede8, #cfeae9, #c6e6ed, #c0e2f1, #bcdef2, #badaf3, #bad5f4, #b7d1f2, #b5ccf1, #b3c8ef, #b1c3ed)"

        }}>
          <section 
          className="section section-blog-info"
            style={{ marginTop: "160px" }}>
            <Container >
              <Row>
                <Col lg="9" className="order-lg-1">
                  <Card
                    className="card-profile"
                    //   fluid body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}
                  >
                    <Row className="justify-content-center">
                      <Col
                      // lg="9" className="order-lg-1"
                      >
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          <img
                            alt="..."
                            className="rounded img-responsive"
                            style={{
                              width: "100%",
                              height: "400px",
                              display: "block",
                              objectFit: "cover",
                            }}
                            // src={"https://c.wallhere.com/photos/f5/52/berge_dawn_morning_mountains_natur_orte_sunrise_valais-839538.jpg!d"                        }
                            src={this.state.groupPhoto}
                            fluid
                          />
                        </a>
                      </Col>
                    </Row>
                    <div className="px-3">
                      <Row
                      //   className="justify-content-center"
                      >
                        <Col className="order-lg-1" lg="10">
                          <div
                          //   className="text-center mt-5"
                          >
                            <h1>
                              {this.state.groupTitle}
                              {/* <span className="font-weight-light">, 27</span> */}
                            </h1>
                            <div
                            // className="h6 font-weight-300"
                            >
                              <i className="ni education_hat mr-2" />
                              {/* Group's description. Including the discussions, images
                          and news. */}
                              {this.state.groupDescription}
                            </div>

                            <div className="h6 mt-4">
                              <i className="ni business_briefcase-24 mr-2" />
                              <span className="description lead text-black text-italic">
                                {this.state.memberIds.length} Group members
                              </span>
                            </div>
                          </div>
                        </Col>
                        <Col
                          className="order-lg-2 text-lg-right align-self-lg-center"
                          lg="2"
                        >
                          <div className="card-profile-actions py-4 mt-lg-0">
                            {this.renderFollow()}
                          </div>
                        </Col>
                      </Row>
                      <div className="mt-5 py-5 border-top">
                        <Row className="justify-content-center">
                          <Col lg="12">
                            <div className="nav-wrapper">
                              <Nav
                                className="nav-fill flex-column flex-md-row"
                                id="tabs-icons-text"
                                pills
                                role="tablist"
                              >
                                <NavItem> 
                                  <NavLink
                                    aria-selected={this.state.iconTabs === 1}
                                    className={classnames("mb-sm-3 mb-md-0", {
                                      active: this.state.iconTabs === 1,
                                    })}
                                    onClick={(e) =>
                                      this.toggleNavs(e, "iconTabs", 1)
                                    }
                                    href="#pablo"
                                    role="tab"
                                  >
                                    <i className="ni ni-cloud-upload-96 mr-2" />
                                    About
                                  </NavLink>
                                </NavItem>
                                <NavItem>
                                  <NavLink
                                    aria-selected={this.state.iconTabs === 2}
                                    className={classnames("mb-sm-3 mb-md-0", {
                                      active: this.state.iconTabs === 2,
                                    })}
                                    onClick={(e) =>
                                      this.toggleNavs(e, "iconTabs", 2)
                                    }
                                    href="#pablo"
                                    role="tab"
                                  >
                                    <i className="ni ni-bell-55 mr-2" />
                                    Discussion
                                  </NavLink>
                                </NavItem>
                                <NavItem>
                                  <NavLink
                                    aria-selected={this.state.iconTabs === 3}
                                    className={classnames("mb-sm-3 mb-md-0", {
                                      active: this.state.iconTabs === 3,
                                    })}
                                    onClick={(e) =>
                                      this.toggleNavs(e, "iconTabs", 3)
                                    }
                                    href="#pablo"
                                    role="tab"
                                  >
                                    <i className="ni ni-calendar-grid-58 mr-2" />
                                    Members
                                  </NavLink>
                                </NavItem>
                              </Nav>
                            </div>
                            <Card   style={{backgroundColor:"transparent"}}>
                              <CardBody >
                                <TabContent
                                  activeTab={"iconTabs" + this.state.iconTabs}
                                >
                                  <TabPane tabId="iconTabs1">
                                    <h4>About:</h4>
                                    <p className="description">
                                      {this.state.groupDescription}
                                    </p>
                                    <h4>Type:</h4>
                                    <p>
                                      <Badge
                                        className="text-uppercase"
                                        color="success"
                                        pill
                                      >
                                        {this.state.groupType}{" "}
                                      </Badge>
                                    </p>
                                    <h4>Created by:</h4>
                                    <p className="font-weight-bold font-italic">
                                      <img
                                        height="50"
                                        width="50"
                                        alt="..."
                                        className="rounded-circle"
                                        src={this.state.groupCreator.avatar}
                                      />{" "}
                                      {this.state.groupCreator.name}
                                    </p>
                                  </TabPane>
                                  <TabPane tabId="iconTabs2">
                                    <Container
                                    // style={{ zoom: "80%" }}
                                    >
                                      {this.state.discussion.map(
                                        (post, postindex) => (
                                          <Post item={post} key={postindex} />
                                        )
                                      )}
                                    </Container>
                                  </TabPane>
                                  <TabPane tabId="iconTabs3">
                                    <h4>Admin:</h4>
                                    <p className="font-weight-bold font-italic">
                                      <img
                                        height="50"
                                        width="50"
                                        alt="..."
                                        className="rounded-circle"
                                        src={this.state.groupCreator.avatar}
                                      />{" "}
                                      {this.state.groupCreator.name}
                                    </p>
                                    <h4>Members:</h4>

                                    {this.state.members.map((data, index) => (
                                      <p className="description font-italic">
                                        <img
                                          height="30"
                                          width="30"
                                          alt="..."
                                          className="rounded-circle"
                                          src={data.avatar}
                                        />{" "}
                                        {data.name}{" "}
                                      </p>
                                    ))}
                                  </TabPane>
                                </TabContent>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col lg="3" className="order-lg-2">
                    <div style={{ paddingTop: "10px" }}>
                      <Card
                        style={{
                          backgroundColor: "transparent",
                          // position: "fixed",
                          width: "100%",
                          // top: "175px",
                          border: "0",

                        }}
                      >
                        <div style={{ overflow:"hidden" }}>
                          <div>
                            {/* <Link to="/peopleyoumayknow"> */}
                            <span
                              className="font-italic font-weight-bold text-white"
                              // style={{ color: "black" }}
                            >
                              Suggested Groups
                            </span>
                            {/* </Link> */}
                          </div>

                          {this.state.suggestedGroups
                            .slice(0, 2)
                            .map((user, postindex) => (
                              <div
                                className="list-group list-group-chat list-group-flush"
                                key={postindex}
                                item={this.state.userRec}
                                style={{ backgroundColor: "transparent" }}
                              >
                                <a
                                  href="javascript:;"
                                  // className="list-group-item bg-gradient-white"
                                  onMouseOver={() =>
                                    localStorage.setItem(
                                      "groupId",
                                      JSON.stringify(user.groupId)
                                    )
                                  }
                                  onClick={() => {
                                    window.location.reload(false);
                                  }}
                                  style={{
                                    position: "relative",
                                    display: "block",
                                    padding: "1rem 1rem",
                                    marginBottom: "-0.0625rem",
                                  }}
                                  // onMouseOver={() => this.onHover(user.userId)}
                                >
                                  <div className="media">
                                    {/* <Link to="/friend"> */}
                                    <img
                                      style={{
                                        width: "45px",
                                        height: "45px",
                                        display: "block",
                                        objectFit: "cover",
                                      }}
                                      className="rounded"
                                      // src={user.avatar}
                                      src={user.groupPhoto}
                                    />
                                    {/* </Link>{" "} */}
                                    <div className="media-body ml-2">
                                      <div className="justify-content-between align-items-center">
                                        <h6 className="mb-0 text-black font-weight-bold">
                                          {user.groupTitle}
                                          <small className="text-white">
                                            <span className="badge badge-success">
                                              {" "}
                                              {user.groupType}
                                            </span>{" "}
                                          </small>
                                        </h6>
                                        <div>
                                          <small className="text-white">
                                            {user.groupDescription}
                                            <span className="badge badge-success">
                                              {/* {user.interestsArr[0]} */}
                                            </span>{" "}
                                            <span className="badge badge-success">
                                              {/* {user.interestsArr[1]} */}
                                            </span>{" "}
                                            <span className="badge badge-success">
                                              {/* {user.interestsArr[2]} */}
                                            </span>
                                          </small>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                            ))}
                        </div>
                      </Card>
                      <Card
                        // className="shadow"
                        // className="shadow mt--300"
                        style={{
                          backgroundColor: "transparent",
                          // position: "fixed",
                          width: "100%",
                          // top: "550px",
                          border: "0",
                        }}
                      >
                        <div style={{ overflow: "hidden", paddingTop:"20px" }}>
                          <div>
                            {/* <Link to="/peopleyoumayknow"> */}
                            <span className="font-italic font-weight-bold text-white">
                              Join these other groups
                            </span>
                            {/* </Link> */}
                          </div>

                          {this.state.allGroups
                            .slice(0, 2)
                            .map((user, postindex) => (
                              <div
                                className="list-group list-group-chat list-group-flush"
                                key={postindex}
                                item={this.state.userRec}
                                style={{
                                  backgroundColor: "transparent",
                                }}
                              >
                                <a
                                  href="javascript:;"
                                  onMouseOver={() =>
                                    localStorage.setItem(
                                      "groupId",
                                      JSON.stringify(user.groupId)
                                    )
                                  }
                                  onClick={() => {
                                    window.location.reload(false);
                                  }}
                                  style={{
                                    position: "relative",
                                    display: "block",
                                    padding: "1rem 1rem",
                                    marginBottom: "-0.0625rem",
                                  }}
                                >
                                  <div className="media">
                                    {/* <Link to="/friend"> */}
                                    <img
                                      style={{
                                        width: "45px",
                                        height: "45px",
                                        display: "block",
                                        objectFit: "cover",
                                      }}
                                      className="rounded"
                                      // src={user.avatar}
                                      src={user.groupPhoto}
                                    />
                                    {/* </Link>{" "} */}
                                    <div className="media-body ml-2">
                                      <div className="justify-content-between align-items-center">
                                        <h6 className="mb-0 text-black font-weight-bold">
                                          {user.groupTitle}
                                          <small className="text-white">
                                            <span className="badge badge-success">
                                              {" "}
                                              {user.groupType}
                                            </span>{" "}
                                          </small>
                                        </h6>
                                        <div>
                                          <small className="text-white">
                                            {user.groupDescription}
                                            <span className="badge badge-success">
                                              {/* {user.interestsArr[0]} */}
                                            </span>{" "}
                                            <span className="badge badge-success">
                                              {/* {user.interestsArr[1]} */}
                                            </span>{" "}
                                            <span className="badge badge-success">
                                              {/* {user.interestsArr[2]} */}
                                            </span>
                                          </small>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                            ))}
                        </div>
                      </Card>
                    </div>
                </Col>
              </Row>
            </Container>
          </section>
          <SimpleFooter />
        </main>
      </>
    );
  }
}

export default Group;
