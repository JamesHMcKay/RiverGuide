import { Grid, ListItem, ListItemText } from "@material-ui/core";
import CalendarToday from "@material-ui/icons/CalendarToday";
import LocationOn from "@material-ui/icons/LocationOn";
import QueryBuilder from "@material-ui/icons/QueryBuilder";
import ShowChart from "@material-ui/icons/ShowChart";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers/index";
import { ILogComplete } from "../../utils/types";

interface ILogBookStatsProps {
    log: ILogComplete[];
}

class LogbookStats extends Component<ILogBookStatsProps> {
    public getTimeDiff = (dateNow: Date, date: string): number => {
        const dateParsed: Date = new Date(date);
        return (dateNow.getTime() - dateParsed.getTime());
    }

    public onlyUnique = (value: string, index: number, self: string[]): boolean => {
        return self.indexOf(value) === index;
    }

    public render(): JSX.Element {
        const logs: ILogComplete[] = this.props.log;
        const dateNow: Date = new Date();
        const timeDiff: number[] = logs.map(
            (item: ILogComplete) => this.getTimeDiff(dateNow, item.start_date_time),
        );

        const sectionId: string[] = logs.map((
            item: ILogComplete) => item.guide_id,
        ).filter(this.onlyUnique);
        const dateThirtyDays: number[] = timeDiff.filter((item: number) => item < 2.592e9);
        const dateYear: number[] = timeDiff.filter((item: number) => item < 3.154e10);

        return (
            <Grid container spacing={0} justify="space-between">
                <Grid item xs={6} lg={3}>
                    <ListItem>
                        <ShowChart fontSize="large" />
                        <ListItemText
                            style={{marginLeft: "10px"}}
                            secondary="Total trips"
                            primary={logs.length} />
                    </ListItem>
                </Grid>
                <Grid item xs={6} lg={3}>
                    <ListItem>
                        <LocationOn fontSize="large" />
                        <ListItemText
                            style={{marginLeft: "10px"}}
                            secondary="Different locations"
                            primary={sectionId.length} />
                    </ListItem>
                </Grid>
                <Grid item xs={6} lg={3}>
                    <ListItem>
                        <CalendarToday fontSize="large" />
                        <ListItemText
                            style={{marginLeft: "10px"}}
                            secondary="Last 30 days"
                            primary={dateThirtyDays.length} />
                    </ListItem>
                </Grid>
                <Grid item xs={6} lg={3}>
                    <ListItem>
                        <QueryBuilder fontSize="large" />
                        <ListItemText
                            style={{marginLeft: "10px"}}
                            secondary="Last year"
                            primary={dateYear.length} />
                    </ListItem>
                </Grid>
            </Grid>
        );
    }
}

function mapStateToProps(state: IState): ILogBookStatsProps {
    return ({
        log: state.log,
    });
}

export default connect(
    mapStateToProps,
    {},
)(LogbookStats);
