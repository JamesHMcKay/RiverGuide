import React, { Component } from "react";
import { connect } from "react-redux";
import { makeLogbookRequest, openLogPage } from "../../actions/actions";

// Material UI
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListIcon from "@material-ui/icons/List";

interface IGuideItemProps {
    openLogPage: () => void;
    makeLogbookRequest: (userId: string) => void;
}

class GuideItem extends Component<IGuideItemProps, {}> {
    public handleClick = (): void => {
        this.props.openLogPage();
        this.props.makeLogbookRequest("userid");
    }

    public render(): JSX.Element {
        return (
            <div>
                <ListItem button onClick={this.handleClick}>
                    <ListItemIcon style = {{marginLeft: "0em"}}>
                        <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary={"All my log book entries"} />
                </ListItem>
                <Divider />
            </div>
        );
    }
}

export default connect(
    null,
    { openLogPage, makeLogbookRequest },
)(GuideItem);
