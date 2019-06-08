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
import { IState } from "../../reducers/index";
import { IAuth, IFilter, IGauge, IGuide, IInfoPage, IListEntry, IRiverRegion } from "./../../utils/types";
import GuideItem from "./ListItem";

interface IRiverGroupProps extends IRiverGroupStateProps {
    riverRegion: IRiverRegion;
}

interface IRiverGroupStateProps {
    listEntries: IListEntry[];
    auth: IAuth;
    filters: IFilter;
}

interface IListGroupState {
    isExpanded: boolean;
}

class ListGroup extends Component<IRiverGroupProps, IListGroupState> {
    constructor(props: IRiverGroupProps) {
        super(props);
        this.state = {
            isExpanded: false,
        };
    }

    public handleClick = (): void => {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    public getChildren = (): IListEntry[] => {
        const { riverRegion }: {riverRegion: IRiverRegion} = this.props;
        const filterdGuides: IListEntry[] = this.props.listEntries;

        return filterdGuides.filter(
            (guide: IListEntry) => guide.region === riverRegion.region,
        ).filter((guide: IListEntry) => guide.river_name === riverRegion.river);
    }

    public renderListItem = (guide: IListEntry, idx: number): JSX.Element => <GuideItem key={idx} guide={guide} />;

    public sortAlphbetically = (a: IListEntry, b: IListEntry): number => {
        if (a.display_name < b.display_name) { return -1; }
        if (a.display_name > b.display_name) { return 1; }
        return 0;
    }

    public render(): JSX.Element {
        const children: IListEntry[] = this.getChildren();
        const isExpanded: boolean = this.props.filters.searchString !== "" || this.state.isExpanded;
        const isSelected: boolean = this.props.filters.searchString === "" && this.state.isExpanded;
        return (
            <div>
                <ListItem
                    selected={isSelected}
                    button
                    onClick={this.handleClick}
                >
                    <ListItemText
                        primary={this.props.riverRegion.river}
                        style={{ marginLeft: "2em" }}/>
                    <Chip
                        label={children.length}
                        color="primary"
                        variant="outlined"
                        style={{ marginRight: "1em" }}
                    />
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Divider />
                <Collapse
                    in={isExpanded}
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

function mapStateToProps(state: IState): IRiverGroupStateProps {
    return ({
        auth: state.auth,
        listEntries: state.filteredList,
        filters: state.filters,
    });
}

export default connect(mapStateToProps)(ListGroup);
