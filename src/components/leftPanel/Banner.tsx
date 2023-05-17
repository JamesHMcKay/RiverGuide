import React, { Component } from "react";
import { connect } from "react-redux";
import { setBannerPage } from "../../actions/actions";
import closeIcon from "../../img/banners/x-solid.svg";
import { IState } from "../../reducers";

interface IBannerProps extends IBannerStateProps {
    setBannerPage: (value: boolean) => void;
}

interface IBannerStateProps {
    bannerPage: boolean;
}

class Banner extends Component<IBannerProps> {
    public render(): JSX.Element {
        return (
            <div onClick={(): Window | null => window.open("https://www.thisisus.nz/check-clean-dry")}
                 style={{position: "relative", width: "100%", backgroundColor: "grey", textAlign: "center"}}>
                <img src={closeIcon} className={"banner-close"}
                     onClick={(event: any): void => {event.stopPropagation(); this.props.setBannerPage(false); }}
                     alt={""}/>
                <div>
                    <img src={require("../../img/banners/20230412-BannerImage.jpg")}
                        style={{width: "100%"}}
                        alt={""}/>
                </div>
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
