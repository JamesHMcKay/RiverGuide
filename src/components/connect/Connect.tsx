import React, { Component } from "react";
import { connect } from "react-redux";
import { providerLogin } from "../../actions/getAuth";
import { IState } from "../../reducers/index";

export interface IMatch<P> {
  params: P;
  isExact: boolean;
  path: string;
  url: string;
}

interface IProviderLogin {
    provider: string;
    search: any;
}

interface IConnectProps {
    match: IMatch<{provider: string}>;
    location: string;
    providerLogin: (action: IProviderLogin, history: any) => void;
    history: any;
}

class Connect extends Component<IConnectProps> {
    public componentDidMount(): void {
        const { match, location } = this.props;
        const action: IProviderLogin = {
            provider: match.params.provider,
            search: location.search,
        };
        this.props.providerLogin(action, this.props.history);
        // this.props.logUser(match.params.provider, location.search);
    }

    public render(): JSX.Element {
        return (
            <div>
                <h1>Retrieving your token and checking its validity</h1>
            </div>
        );
    }
}

function mapStateToProps(state: IState): {} {
    return ({
    });
}

export default connect(
    mapStateToProps,
    { providerLogin },
)(Connect);
