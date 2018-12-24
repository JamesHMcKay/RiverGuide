import React, {PureComponent} from 'react';
import IoIosLocation from "react-icons/lib/io/ios-location";
import Tooltip from '@material-ui/core/Tooltip';

const pinStyle = {
  fill: '#d00',
  stroke: 'none'
};

interface IMapMarkerProps {
    size: number;
    onClick: () => void;
    deleteMode: boolean;
    toolTip: string;
}

export default class MapMarker extends PureComponent<IMapMarkerProps> {
    getToolTip(element: any) {
        if (this.props.deleteMode) {
            return (<Tooltip title='Click to delete' style={{'backgroundColor':'red'}}>{element}</Tooltip>)
        } else {
            return <Tooltip title={this.props.toolTip}>{element}</Tooltip>
        }
    }


    render() {
        const {size = 80, onClick} = this.props;
        return (
            <svg
                height={size}
                viewBox="0 0 80 80"
                style={{...pinStyle, transform: `translate(${-size / 2}px,${-size}px)`}}
                onClick={onClick}
            >
                {this.getToolTip(<IoIosLocation
                            size={80}
                            className="map-marker"
                    />)}
            </svg>
        );
      }
}
