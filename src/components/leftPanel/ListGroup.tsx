import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

// Material UI components
import Chip from "@material-ui/core/Chip";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

// Components
import { State } from "../../reducers/index";
import { IAuth, IGauge, IGuide, IInfoPage } from "./../../utils/types";
import GuideItem from "./ListItem";

interface IListGroupProps {
    region: string;
    filteredList: IGuide[];
    auth: IAuth;
}

interface IListGroupState {
    isExpanded: boolean;
}

class ListGroup extends Component<IListGroupProps, IListGroupState> {
    constructor(props: IListGroupProps) {
        super(props);
        this.state = {
            isExpanded: props.region === "Favourites" ? true : false,
        };
    }

    public handleClick = () => {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    public getChildren = () => {
        const { region } = this.props;
        const filterdGuides = this.props.filteredList;

        if (region === "Favourites") {
            return filterdGuides.filter(
                (guide) => this.props.auth.user.favourites.indexOf(guide._id) > -1,
            );
        }

        return filterdGuides.filter((guide) => guide.region === region);
    }

    public renderListItem = (guide: IGuide, idx: number) => <GuideItem key={idx} guide={guide} />;

    public sortAlphbetically = (a: IGuide, b: IGuide) => {
        if (a.title < b.title) { return -1; }
        if (a.title > b.title) { return 1; }
        return 0;
    }

    public render() {
        const children = this.getChildren();

        return (
            <div>
                <ListItem
                    selected={this.state.isExpanded}
                    button
                    onClick={this.handleClick}
                >
                    <ListItemText primary={this.props.region} />
                    <Chip
                        label={children.length}
                        color="primary"
                        variant="outlined"
                        style={{ marginRight: "1em" }}
                    />
                    {this.state.isExpanded ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Divider />
                <Collapse
                    in={this.state.isExpanded}
                    timeout="auto"
                    unmountOnExit
                >
                    <List disablePadding>
                        {children
                            .sort(this.sortAlphbetically)
                            .map(this.renderListItem)}
                    </List>
                </Collapse>
            </div>
        );
    }
}

ListGroup.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state: State) => ({
    auth: state.auth,
    filters: state.filteredGuides,
    filteredList: state.filteredList,
});

export default connect(mapStateToProps)(ListGroup);
