import React from "react";
import moment from "moment";

import { Col, Row } from "reactstrap";

const ProfileBanner = props => (
    <div className="profile-banner">
        <Row>
            <Col
                md="3"
                lg="3"
                style={{
                    justifyContent: "center"
                }}
            >
                <img
                    className="profile-img"
                    src={props.user.avatar}
                    height="110px"
                    width="110px"
                    alt="User Avatar"
                />
                <p>
                    Member since
                    <br />
                    {moment(props.user.creationDate).format("MMM YYYY")}
                </p>
            </Col>
            <Col md="9" lg="9">
                <h3>{props.user.name}</h3>
                <h5>Christchurch, Canterbury, New Zealand</h5>
            </Col>
        </Row>
    </div>
);

export default ProfileBanner;
