import { Hidden } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers";
import { setBannerPage } from "../../actions/actions";
import closeIcon from "../../img/banners/x-solid.svg";


interface IBannerProps extends IBannerStateProps {
    setBannerPage: (value: boolean) => void;
}

interface IBannerStateProps {
    bannerPage: boolean;
}

class Banner extends Component<IBannerProps> {
    constructor(props: IBannerProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div style={{position: "relative", width: "100%", backgroundColor: "grey", textAlign: "center"}}>
                <img src={closeIcon} className={"banner-close"} onClick={() => (this.props.setBannerPage(false))}/>
                <a href={""}>
                    <img src={require("../../img/banners/CCD banner landscape FINAL 2Mar2022.png")} style={{width: "100%"}}/>
                </a>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IBannerStateProps {
    return ({
        bannerPage: state.bannerPage,
    });
}

export default connect(
    mapStateToProps,
    ({ setBannerPage }),
)(Banner);
