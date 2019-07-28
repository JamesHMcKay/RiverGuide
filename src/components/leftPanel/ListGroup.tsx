import Chip from "@material-ui/core/Chip";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import React, { Component } from "react";
import { connect } from "react-redux";

// Components
import { IState } from "../../reducers/index";
import { IAuth, IFilter, IListEntry, IRiverRegion } from "./../../utils/types";
import RiverGroup from "./RiverGroup";

interface IListGroupProps extends IListGroupStateProps {
    region: string;
    listEntries: IListEntry[];
}

interface IListGroupStateProps {
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
        <RiverGroup listEntries = {this.props.listEntries} key={idx} riverRegion={riverRegion}/>

    public sortAlphbetically = (a: IRiverRegion, b: IRiverRegion): number => {
        if (a.river < b.river) { return -1; }
        if (a.river > b.river) { return 1; }
        return 0;
    }

    public isSearch = (): boolean => {
        return this.props.filters.searchString.length > 3;
    }

    public render(): JSX.Element {
        const children: IRiverRegion[] = this.getChildren();
        const isExpanded: boolean = this.isSearch() || this.state.isExpanded;
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
                        variant="outlined"
                        style={{ marginRight: "1em" }}
                    />
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                {/* <Divider /> */}
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
        filters: state.filters,
    });
}

export default connect(mapStateToProps)(ListGroup);
