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
import RiverGroup from "./RiverGroup";

interface IListGroupProps extends IListGroupStateProps {
    region: string;
}

interface IListGroupStateProps {
    listEntries: IListEntry[];
    auth: IAuth;
    filters: IFilter;
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

    public handleClick = (): void => {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    public onlyUnique = (value: IRiverRegion, index: number, self: IRiverRegion[]): boolean =>
        self.map((item: IRiverRegion) => item.river).indexOf(value.river) === index

    public getChildren = (): IRiverRegion[] => {
        const { region }: {region: string} = this.props;
        const filterdGuides: IListEntry[] = this.props.listEntries;

        return filterdGuides.filter((guide: IListEntry) => guide.region === region).map((item: IListEntry) => ({
            river: item.river_name || "undefined",
            region,
        }));
    }

    public renderListItem = (riverRegion: IRiverRegion, idx: number): JSX.Element =>
        <RiverGroup key={idx} riverRegion={riverRegion} />

    public sortAlphbetically = (a: IRiverRegion, b: IRiverRegion): number => {
        if (a.river < b.river) { return -1; }
        if (a.river > b.river) { return 1; }
        return 0;
    }

    public render(): JSX.Element {
        const children: IRiverRegion[] = this.getChildren();
        const isExpanded: boolean = this.props.filters.searchString !== "" || this.state.isExpanded;
        const isSelected: boolean = this.props.filters.searchString === "" && this.state.isExpanded;
        return (
            <div>
                <ListItem
                    selected={isSelected}
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
                            .filter(this.onlyUnique)
                            .sort(this.sortAlphbetically)
                            .map(this.renderListItem)}
                    </List>
                </Collapse>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IListGroupStateProps {
    return ({
        auth: state.auth,
        listEntries: state.filteredList,
        filters: state.filters,
    });
}

export default connect(mapStateToProps)(ListGroup);
