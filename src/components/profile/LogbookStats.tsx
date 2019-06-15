import { Grid, ListItem, ListItemText } from "@material-ui/core";
import QueryBuilder from "@material-ui/icons/QueryBuilder";
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
            (item: ILogComplete) => this.getTimeDiff(dateNow, item.date),
        );

        const sectionId: string[] = logs.map((
            item: ILogComplete) => item.guide_id,
        ).filter(this.onlyUnique);
        const dateThirtyDays: number[] = timeDiff.filter((item: number) => item < 2.592e9);
        const dateYear: number[] = timeDiff.filter((item: number) => item < 3.154e10);

        return (
            <Grid container item spacing={10} justify="space-between">
                <Grid item md={12} lg={3}>
                    <ListItem>
                        <QueryBuilder fontSize="large" />
                        <ListItemText primary="Number of sections" secondary={sectionId.length} />
                    </ListItem>
                </Grid>
                <Grid item md={12} lg={3}>
                    <ListItem>
                        <QueryBuilder fontSize="large" />
                        <ListItemText primary="Last 30 days" secondary={dateThirtyDays.length} />
                    </ListItem>
                </Grid>
                <Grid item md={12} lg={3}>
                    <ListItem>
                        <QueryBuilder fontSize="large" />
                        <ListItemText primary="Last year" secondary={dateYear.length} />
                    </ListItem>
                </Grid>
                <Grid item md={12} lg={3}>
                    <ListItem>
                        <QueryBuilder fontSize="large" />
                        <ListItemText primary="All time" secondary={logs.length} />
                    </ListItem>
                </Grid>
            </Grid>
        );
    }
}

function mapStateToProps(state: IState): ILogBookStatsProps {
    return ({
        log: state.filteredLogList,
    });
}

export default connect(
    mapStateToProps,
    {},
)(LogbookStats);
