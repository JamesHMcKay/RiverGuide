import React, { Component } from "react";

// Material UI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

// Component
import InfoMapComponent from "../map/InfoMapComponent";

class HistoryCard extends Component {
    render() {
        return (
            <Card>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Local map
                    </Typography>
                    <br />
                    <InfoMapComponent markers={this.props.markers} />
                </CardContent>
            </Card>
        );
    }
}

export default HistoryCard;
