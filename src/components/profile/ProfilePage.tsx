import { Button, Divider, List, ListItem, ListItemText, TextField, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    makeLogbookRequest,
    setMapBounds,
} from "../../actions/actions";
import { changeUserDetails, deleteUser } from "../../actions/getAuth";
import {
    openLogInfoPage,
} from "../../actions/getGuides";
import { IState } from "../../reducers/index";
import loadingButton from "../../utils/loadingButton";
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
    deleteUser: (user: IUser) => void;
}

interface IProfilePageStateProps {
    auth: IAuth;
    gauges: IGauge[];
    infoPage: IInfoPage;
    filterdGuides: IListEntry[];
    listEntries: IListEntry[];
    log: ILogComplete[];
    logPageOpen: boolean;
    loadingSpinner: string;
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

    public componentDidUpdate(prevProps: IProfilePageProps): void {
        const userId: string = this.props.auth.user.id;
        const prevUserId: string = prevProps.auth.user.id;

        const shouldUpdate: boolean = prevUserId !== userId;
        if (shouldUpdate) {
            this.setState({
                user: this.props.auth.user,
                editMode: false,
            });
        }
    }

    public onDeleteClick = (event: any): void => {
        this.props.deleteUser(this.state.user);
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
            <ListItemText primary={this.props.auth.user[item.type]}/>
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
            <Button
                variant="outlined"
                style={{marginRight: "10px"}}
                onClick={this.onEditClick}
                disabled={!this.props.auth.isAuthenticated}
            >
                Edit
            </Button>
        );
    }

    public render(): JSX.Element {
        const dateParsed: Date = new Date(this.props.auth.user.createdAt);
        return (
            <Grid container spacing={0} justify={"center"} style={{height: "82vh"}}>
                <List style={{ width: "100%", maxWidth: 360}}>
                {!this.props.auth.isAuthenticated &&
                    <ListItem>
                        <ListItemText primary={"You are not logged in"}/>
                    </ListItem>
                }
                {listItems.map((item: IProfileListItem) => (
                    <div key={item.name}>
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
                    <ListItemText
                        primary={this.props.auth.isAuthenticated ? dateParsed.toDateString() : ""}
                    />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                <div style={{display: "flex", flexDirection: "row"}}>
                    {this.getEditSaveButton()}
                    <Button
                        variant="outlined"
                        disabled={this.state.editMode || !this.props.auth.isAuthenticated}
                        onClick={this.onDeleteClick}
                    >
                        Delete account
                    </Button>
                    {this.props.loadingSpinner === "deleteAccount" && loadingButton()}
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
        loadingSpinner: state.loadingSpinner,
    });
}

export default connect(
    mapStateToProps,
    { makeLogbookRequest, openLogInfoPage, setMapBounds, changeUserDetails, deleteUser },
)(ProfilePage);
