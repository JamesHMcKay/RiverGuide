import React, { PureComponent } from "react";

export interface IMapClusterProps {
    size: number;
    onClick: () => void;
    count: number;
}

export default class MapCluster extends PureComponent<IMapClusterProps> {
    public render(): JSX.Element {
        const {size = 80}: {size: number} = this.props;
        return (
            <div
                className="map-cluster"
                onClick={(): void => this.props.onClick()}
                style={{transform: `translate(${-size / 2}px,${-size}px)`}}
            >
                {this.props.count}
            </div>
        );
      }
}
