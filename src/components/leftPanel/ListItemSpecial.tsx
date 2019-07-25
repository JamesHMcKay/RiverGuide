import React, { Component } from "react";
import { connect } from "react-redux";
import { makeLogbookRequest, openLogPage } from "../../actions/actions";

// Material UI
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListIcon from "@material-ui/icons/List";
import { IState } from "../../reducers";
import { IAuth } from "../../utils/types";

interface IGuideItemProps extends IGuideItemStateProps {
    openLogPage: () => void;
    makeLogbookRequest: (userId: string) => void;
}

interface IGuideItemStateProps {
    auth: IAuth;
}

class GuideItem extends Component<IGuideItemProps, {}> {
    public handleClick = (): void => {
        this.props.openLogPage();
    }

    public render(): JSX.Element {
        const title: string = this.props.auth.isAuthenticated ? "My Trips" : "Log in to see your trips here";
        return (
            <div>
                <ListItem button disabled={!this.props.auth.isAuthenticated} onClick={this.handleClick}>
                    <ListItemIcon style = {{marginLeft: "0em"}}>
                        <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary={title} />
                </ListItem>
                <Divider />
            </div>
        );
    }
}

function mapStateToProps(state: IState): IGuideItemStateProps {
    return ({
        auth: state.auth,
    });
}

export default connect(
    mapStateToProps,
    { openLogPage, makeLogbookRequest },
)(GuideItem);
