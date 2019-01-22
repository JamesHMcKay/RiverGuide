import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeLogbookRequest } from "../../actions/actions";
import { State } from '../../reducers/index';
import { IAuth } from '../../utils/types';

import ProfileBanner from "./ProfileBanner";
import Logbook from "./Logbook";

import "./profile.css";

interface IProfileContainerProps {
    makeLogbookRequest: () => void;
    auth: IAuth;
}

class ProfileContainer extends Component<IProfileContainerProps> {
    componentDidMount() {
        this.props.makeLogbookRequest();
    }

    render() {
        return (
            <div className="container">
                <ProfileBanner user={this.props.auth.user} />
                <Logbook />
            </div>
        );
    }
}

ProfileContainer.propTypes = {
    auth: PropTypes.object.isRequired,
    makeLogbookRequest: PropTypes.func.isRequired
};

const mapStateToProps = (state: State) => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { makeLogbookRequest }
)(ProfileContainer);
