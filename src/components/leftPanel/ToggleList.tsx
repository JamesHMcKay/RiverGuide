import React, { Component } from "react";
import { connect } from "react-redux";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import {
    setSearchPanel,
} from "../../actions/actions";

import { IState } from "../../reducers";
import { IInfoPage } from "../../utils/types";

interface IToggleListProps extends IToggleListStateProps {
    setSearchPanel: (value: string) => void;
}

interface IToggleListStateProps {
    searchPanel: string;
    infoPage: IInfoPage;
}

class ToggleList extends Component<IToggleListProps> {
    public handleToggle = (event: any, value: string): void => {
        this.props.setSearchPanel(value);
    }

    public render(): JSX.Element {
        return (
            <div style = {{width: "100%", marginTop: "auto"}}>
                {!this.props.infoPage.infoSelected &&
                    <ToggleButtonGroup
                        value={this.props.searchPanel}
                        exclusive
                        onChange={this.handleToggle}
                        style = {{width: "100%"}}
                    >
                        <ToggleButton value="list" style = {{width: "50%", height: "30px"}}>
                        List view
                        </ToggleButton>
                        <ToggleButton value="map" style = {{width: "50%", height: "30px"}}>
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
    });
}

export default connect(
    mapStateToProps,
    { setSearchPanel },
)(ToggleList);
