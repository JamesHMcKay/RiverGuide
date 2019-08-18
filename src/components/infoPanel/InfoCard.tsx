import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers";
import { IExpansionPanels } from "../../utils/types";
import ExpansionHead from "./ExpansionHead";

interface IInfoCardProps extends IInfoCardStateProps {
    content: string;
    title: string;
    attribution: string;
    directions: string;
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
                    <div>
                        <Typography component="div">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: this.props.content,
                                }}
                            />
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom style={{marginBottom: "10px", marginTop: "10px"}}>
                            {"Attribution"}
                        </Typography>
                        <Typography variant="body1">
                            {this.props.attribution}
                        </Typography>
                        {this.props.directions && this.props.directions !== "" &&
                        <div>
                            <Typography
                                variant="subtitle2"
                                gutterBottom
                                style={{marginBottom: "10px", marginTop: "10px"}}
                            >
                            {"Directions"}
                            </Typography>
                            <Typography component="div">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: this.props.directions,
                                    }}
                                />
                            </Typography>
                        </div>
                        }
                    </div>
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
