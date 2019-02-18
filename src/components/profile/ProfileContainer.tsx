import React, { Component } from "react";
import { connect } from "react-redux";
import { makeLogbookRequest } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IAuth } from "../../utils/types";

import Logbook from "./Logbook";
import ProfileBanner from "./ProfileBanner";

import "./profile.css";

interface IProfileContainerProps extends IProfileContainerStateProps {
    makeLogbookRequest: () => void;
}

interface IProfileContainerStateProps {
    auth: IAuth;
}

class ProfileContainer extends Component<IProfileContainerProps> {
    public componentDidMount(): void {
        this.props.makeLogbookRequest();
    }

    public render(): JSX.Element {
        return (
            <div className="container">
                <ProfileBanner user={this.props.auth.user} />
                <Logbook />
            </div>
        );
    }
}

function mapStateToProps(state: IState): IProfileContainerStateProps {
    return ({
        auth: state.auth,
    });
}

export default connect(
    mapStateToProps,
    { makeLogbookRequest },
)(ProfileContainer);
