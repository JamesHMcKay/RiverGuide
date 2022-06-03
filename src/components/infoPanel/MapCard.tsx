import { Hidden } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers";
import { IExpansionPanels } from "../../utils/types";
import InfoMapComponent from "../map/InfoMapComponent";
import ExpansionHead from "./ExpansionHead";

interface IMapCardProps extends IMapCardStateProps {
    guideId: string;
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
                <Hidden>
                    <ExpansionHead title={"Local Map"} panelName={"map"}/>
                    {this.props.expansionPanels.map && <InfoMapComponent
                            draggable={true}
                            guideId={this.props.guideId}
                            height={"300px"}
                        />
                    }
                </Hidden>
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
