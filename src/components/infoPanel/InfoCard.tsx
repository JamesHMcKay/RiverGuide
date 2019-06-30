import Typography from "@material-ui/core/Typography";
import marked from "marked";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers";
import { IExpansionPanels } from "../../utils/types";
import ExpansionHead from "./ExpansionHead";

marked.setOptions({
    gfm: true,
    breaks: true,
    sanitize: true,
});

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
                                    __html: marked(this.props.content),
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
