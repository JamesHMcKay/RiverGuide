import React, { Component } from "react";
import { CSVLink } from "react-csv";
import { connect } from "react-redux";
import { IState } from "../../reducers/index";
import { IErrors, IGauge, IHistory, IInfoPage, IObsValue } from "../../utils/types";

interface IDownloadModalBodyState {
    identifier: string;
    password: string;
    showPassword: boolean;
    errors?: IErrors;
    loading: boolean;
}

interface IDownloadModalBodyProps {
    errors: IErrors;
    infoPage: IInfoPage;
    gauges: IGauge[];
}

class DownloadModalBody extends Component<IDownloadModalBodyProps, IDownloadModalBodyState> {
    constructor(props: IDownloadModalBodyProps) {
        super(props);
        this.state = {
            identifier: "",
            password: "",
            showPassword: false,
            loading: false,
        };
    }

    public componentWillReceiveProps = (nextProps: IDownloadModalBodyProps): void => {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors,
                loading: false,
            });
        }
    }

    public getData = (): Array<Partial<IObsValue>> => {
        const data: IHistory[] = this.props.infoPage.history;
        return data.map((item: IHistory) => item.values);
    }

    public render(): JSX.Element {
        const data: Array<Partial<IObsValue>> = this.getData();
        return (
            <div>
                <CSVLink data={data}>
                Download data
                </CSVLink>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IDownloadModalBodyProps {
    return ({
        infoPage: state.infoPage,
        gauges: state.gauges,
        errors: state.errors,
    });
}

export default connect(
    mapStateToProps,
    {},
)(DownloadModalBody);
