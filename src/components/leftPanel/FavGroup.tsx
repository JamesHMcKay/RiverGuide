import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import React, { Component } from "react";
import { connect } from "react-redux";
import GuideItem from "./ListItem";

// Components
import { IState } from "../../reducers/index";
import { IAuth, IFilter, IListEntry, IRiverRegion } from "./../../utils/types";

interface IFavGroupProps extends IFavGroupStateProps {
    listEntries: IListEntry[];
}

interface IFavGroupStateProps {
    auth: IAuth;
    filters: IFilter;
}

interface IFavGroupState {
    isExpanded: boolean;
}

class FavGroup extends Component<IFavGroupProps, IFavGroupState> {
    constructor(props: IFavGroupProps) {
        super(props);
        this.state = {
            isExpanded: props.listEntries.length > 0 ? true : false,
            // isExpanded: false,
        };
    }

    public handleClick = (): void => {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    public onlyUnique = (value: IRiverRegion, index: number, self: IRiverRegion[]): boolean =>
        self.map((item: IRiverRegion) => item.river).indexOf(value.river) === index

    public getChildren = (): IListEntry[] => {
        return this.props.listEntries;
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
        // const isSelected: boolean = this.props.filters.searchString === "" && this.state.isExpanded;
        const title: string = this.props.auth.isAuthenticated ? "Favourites" : "Recently viewed";
        return (
            <div>
                <ListItem
                    selected={false}
                    button
                    onClick={this.handleClick}
                >
                    <ListItemText primary={title} />
                    {/* <Chip
                        label={children.length}
                        color="primary"
                        variant="outlined"
                        style={{ marginRight: "1em" }}
                    /> */}
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
                            .sort(this.sortAlphbetically)
                            .map(this.renderListItem)}
                    </List>
                </Collapse>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IFavGroupStateProps {
    return ({
        auth: state.auth,
        filters: state.filters,
    });
}

export default connect(mapStateToProps)(FavGroup);
