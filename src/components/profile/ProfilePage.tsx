import { Button, Divider, List, ListItem, ListItemText, TextField, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    makeLogbookRequest,
    setMapBounds,
} from "../../actions/actions";
import { changeUserDetails } from "../../actions/getAuth";
import {
    openLogInfoPage,
} from "../../actions/getGuides";
import { IState } from "../../reducers/index";
import { IAuth, IGauge, IInfoPage, IListEntry, ILogComplete, IMapBounds, IUser } from "../../utils/types";
import "./profile.css";

interface IProfilePageState {
    user: IUser;
    editMode: boolean;
}

interface IProfilePageProps extends IProfilePageStateProps {
    makeLogbookRequest: (userId: string) => void;
    openLogInfoPage: (guide: IListEntry) => void;
    setMapBounds: (mapBounds: IMapBounds) => void;
    changeUserDetails: (user: IUser) => void;
}

interface IProfilePageStateProps {
    auth: IAuth;
    gauges: IGauge[];
    infoPage: IInfoPage;
    filterdGuides: IListEntry[];
    listEntries: IListEntry[];
    log: ILogComplete[];
    logPageOpen: boolean;
}

interface IProfileListItem {
    type: keyof IUser;
    name: string;
}

const listItems: IProfileListItem[] = [
    {type: "username", name: "User name"},
    {type: "email", name: "Email"},
];

class ProfilePage extends Component<IProfilePageProps, IProfilePageState> {
    constructor(props: IProfilePageProps) {
        super(props);
        this.state = {
            user: this.props.auth.user,
            editMode: false,
        };
    }

    public onEditClick = (event: any): void => {
        this.setState({
            editMode: true,
        });
    }

    public onSaveClick = (event: any): void => {
        this.setState({
            editMode: false,
        });
        this.props.changeUserDetails(this.state.user);
    }

    public onChange = (event: any, type: keyof IUser): void => {
        const user: IUser = {
            ...this.state.user,
            [type]: event.target.value,
        };
        this.setState({
            user,
        });
    }

    public getDetailsBox = (item: IProfileListItem): JSX.Element => {
        if (this.state.editMode) {
            return (
                <TextField
                    style={{ margin: `5px 0 0 2px`}}
                    color="textSecondary"
                    defaultValue={this.props.auth.user[item.type]}
                    onChange={(event: any): void => {this.onChange(event, item.type); }}
                />
            );
        }
        return (
            <ListItem>
            <ListItemText primary={this.state.user[item.type]}/>
        </ListItem>
        );
    }

    public getEditSaveButton = (): JSX.Element => {
        if (this.state.editMode) {
            return (
                <Button variant="outlined" style={{marginRight: "10px"}} onClick={this.onSaveClick}>
                    Save
                </Button>
            );
        }
        return (
            <Button variant="outlined" style={{marginRight: "10px"}} onClick={this.onEditClick}>
                Edit
            </Button>
        );
    }

    public render(): JSX.Element {
        return (
            <Grid container spacing={0} justify={"center"}>
                <List style={{ width: "100%", maxWidth: 360}}>
                {listItems.map((item: IProfileListItem) => (
                    <div>
                    <li>
                        <Typography
                        style={{ margin: `5px 0 0 2px`}}
                        color="textSecondary"
                        display="block"
                        variant="caption"
                        >
                        {item.name}
                        </Typography>
                    </li>
                        {this.getDetailsBox(item)}
                    <Divider component="li" />
                    </div>))}
                    <li>
                    <Typography
                    style={{ margin: `5px 0 0 2px`}}
                    color="textSecondary"
                    display="block"
                    variant="caption"
                    >
                    Created
                    </Typography>
                </li>
                <ListItem>
                    <ListItemText primary={this.props.auth.user.createdAt}/>
                </ListItem>
                <Divider component="li" />
                <ListItem>
                <div style={{display: "flex", flexDirection: "row"}}>
                    {this.getEditSaveButton()}
                    <Button variant="outlined">
                        Delete account
                    </Button>
                </div>
                </ListItem>
                </List>

            </Grid>
        );
    }

}

function mapStateToProps(state: IState): IProfilePageStateProps {
    return ({
        auth: state.auth,
        gauges: state.gauges,
        infoPage: state.infoPage,
        filterdGuides: state.filteredList,
        listEntries: state.listEntries,
        log: state.log,
        logPageOpen: state.logPageOpen,
    });
}

export default connect(
    mapStateToProps,
    { makeLogbookRequest, openLogInfoPage, setMapBounds, changeUserDetails },
)(ProfilePage);
