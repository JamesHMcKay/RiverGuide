import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers/index";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { IInfoPage, IGauge } from "../../utils/types";

interface ILatestDataProps {
    infoPage: IInfoPage;
    gauges: IGauge[];
}

class LatestData extends Component<ILatestDataProps> {

    public handleChange = (event: any): void => {
        this.setState({ tempValue: event.target.value });
    }

    public render(): JSX.Element {
        return (
            <div>
                    <Typography variant="h5" gutterBottom>
                        {"Latest data"}
                    </Typography>
            </div>
        );
    }
}


function mapStateToProps(state: IState): ILatestDataProps {
    return ({
        infoPage: state.infoPage,
        gauges: state.gauges,
    });
}

export default connect(mapStateToProps)(LatestData);