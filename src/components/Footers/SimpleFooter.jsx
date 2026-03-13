import React from "react";
// reactstrap components
import {
  Button,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";
import { Link } from "react-router-dom";


class SimpleFooter extends React.Component {
  render() {
    return (
      <>
          <Container>

                <div className="copyright"
                 style={{
backgroundColor:"transparent",color:"white", width:"100%", textShadow:"3px 2px 5px rgba(0, 5, 9, 1)"
                }}>
                  © {new Date().getFullYear()}{" "}
                  <Link
                   to="/timeline"
                   style={{color:"white"}}

                  >
                    Travy social network
                  </Link>
                  
                </div>
<br/>                
          </Container>

      </>
    );
  }
}

export default SimpleFooter;
