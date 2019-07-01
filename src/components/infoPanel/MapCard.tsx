import { Button } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers";
import { IExpansionPanels, IMarker } from "../../utils/types";
import InfoMapComponent from "../map/InfoMapComponent";
import ExpansionHead from "./ExpansionHead";

interface IMapCardProps extends IMapCardStateProps {
    markers: IMarker[];
}

interface IMapCardStateProps {
    expansionPanels: IExpansionPanels;
}

interface IMapCardProps extends IMapCardStateProps {
    toggleModal: (modal: string) => void;
}

class MapCard extends Component<IMapCardProps> {
    public render(): JSX.Element {
        return (
            <div>
                <ExpansionHead title={"Local Map"} panelName={"map"}/>
                {this.props.expansionPanels.map && <InfoMapComponent
                        markers={this.props.markers}
                        draggable={false}
                    />
                }
                                <Button
                    variant="outlined"
                    onClick={(): void => {this.props.toggleModal("mapModal"); }}
                >Open map in dialog</Button>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IMapCardStateProps {
    return ({
        expansionPanels: state.expansionPanels,
    });
}

export default connect(mapStateToProps, {toggleModal})(MapCard);
