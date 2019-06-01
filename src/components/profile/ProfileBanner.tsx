import React from "react";

import { Col, Row } from "reactstrap";
import { IUser } from "../../utils/types";

interface IProfileBannerProps {
    user: IUser;
}

function ProfileBanner(props: IProfileBannerProps): JSX.Element {
    return (
        <div className="profile-banner">
            <Row>
                <Col
                    md="3"
                    lg="3"
                    style={{
                        justifyContent: "center",
                    }}
                >
                    <p>
                        Email
                        <br />
                        {props.user.email}
                    </p>
                </Col>
                <Col md="9" lg="9">
                    <h3>{props.user.name}</h3>
                </Col>
            </Row>
        </div>
    );
}

export default ProfileBanner;
