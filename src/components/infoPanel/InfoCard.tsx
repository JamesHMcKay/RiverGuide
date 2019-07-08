import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers";
import { IExpansionPanels } from "../../utils/types";
import ExpansionHead from "./ExpansionHead";

interface IInfoCardProps extends IInfoCardStateProps {
    content: string;
    title: string;
}

interface IInfoCardStateProps {
    expansionPanels: IExpansionPanels;
}

class InfoCard extends Component<IInfoCardProps> {
    public render(): JSX.Element {
        return (
            <div>
                <ExpansionHead title={this.props.title} panelName={"description"}/>
                <br />
                {this.props.expansionPanels.description &&
                    <Typography component="div">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: this.props.content,
                                }}
                            />
                    </Typography>
                }
            </div>
        );
    }
}

function mapStateToProps(state: IState): IInfoCardStateProps {
    return ({
        expansionPanels: state.expansionPanels,
    });
}

export default connect(mapStateToProps)(InfoCard);
