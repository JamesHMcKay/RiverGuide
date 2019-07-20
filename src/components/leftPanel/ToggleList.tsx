import React, { Component } from "react";
import { connect } from "react-redux";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import {
    generateFilteredList,
    setMapBounds,
    setSearchPanel,
} from "../../actions/actions";

import { IState } from "../../reducers";
import { IFilter, IInfoPage, IListEntry, IMapBounds } from "../../utils/types";

interface IToggleListProps extends IToggleListStateProps {
    setSearchPanel: (value: string) => void;
    setMapBounds: (bounds: IMapBounds | null) => void;
    generateFilteredList: (
        guides: IListEntry[],
        filters: IFilter,
        mapBounds: IMapBounds | null,
    ) => void;
}

interface IToggleListStateProps {
    searchPanel: string;
    infoPage: IInfoPage;
    logPageOpen: boolean;
    filters: IFilter;
    listEntries: IListEntry[];
}

class ToggleList extends Component<IToggleListProps> {
    public handleToggle = (event: any, value: string): void => {
        this.props.setSearchPanel(value);
        this.props.setMapBounds(null);
        this.props.generateFilteredList(
            this.props.listEntries,
            this.props.filters,
            null,
        );
    }

    public render(): JSX.Element {
        return (
            <div style = {{width: "100%"}}>
                {(!this.props.infoPage.infoSelected && !this.props.logPageOpen) &&
                    <ToggleButtonGroup
                        value={this.props.searchPanel}
                        exclusive
                        onChange={this.handleToggle}
                        style = {{width: "100%"}}
                    >
                        <ToggleButton value="list" style = {{width: "50%", minHeight: "25px"}}>
                        List view
                        </ToggleButton>
                        <ToggleButton value="map" style = {{width: "50%", minHeight: "25px"}}>
                        Map view
                        </ToggleButton>
                    </ToggleButtonGroup>
                }
          </div>
        );
    }
}

function mapStateToProps(state: IState): IToggleListStateProps {
    return ({
        searchPanel: state.searchPanel,
        infoPage: state.infoPage,
        logPageOpen: state.logPageOpen,
        filters: state.filters,
        listEntries: state.listEntries,
    });
}

export default connect(
    mapStateToProps,
    { setSearchPanel, setMapBounds, generateFilteredList },
)(ToggleList);
