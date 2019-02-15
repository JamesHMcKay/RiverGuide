import React, { Component } from "react";
import { Badge } from "reactstrap";
import { IGauge, IGradeRange, IGuide } from "./../../utils/types";

interface IGradeBadgeProps {
    gauges: IGauge[];
    guide: IGuide;
}

export class GradeBadge extends Component<IGradeBadgeProps> {
    constructor(props: IGradeBadgeProps) {
        super(props);
    }

    public flowFilterCondition(grade: IGradeRange, guide: IGuide) {
        const gradeFrom = parseInt(grade.from, 10);
        const gradeTo = parseInt(grade.to, 10);
        const gaugeName: string = guide.gaugeName || "";

        const gaugeAtThisSite: IGauge | undefined = this.props.gauges.find(
            (gauge) =>
                gauge.siteName.toLowerCase() === gaugeName.toLowerCase(),
        );

        if (gaugeAtThisSite) {
            const currentFlow = gaugeAtThisSite.currentFlow;
            return gradeFrom <= currentFlow && gradeTo >= currentFlow
                ? true
                : false;
        } else {
            return false;
        }
    }

    public getColor(guide: IGuide) {
        const flowSpecificGrades = this.props.guide.flowSpecificGrades;
        if (flowSpecificGrades && flowSpecificGrades.length > 0) {
            const filteredGrades = flowSpecificGrades.filter((grade) =>
                this.flowFilterCondition(grade, guide),
            );
            return filteredGrades.length > 0 ? "primary" : "secondary";
        } else {
            return "primary";
        }
    }

    public getFlowAdjustGrade(guide: IGuide) {
        if (guide.flowSpecificGrades) {
            const grades = guide.flowSpecificGrades.filter((grade) =>
                this.flowFilterCondition(grade, guide),
            );

            if (grades.length > 0) {
                return grades[0].from;
            }
        }
        return guide.grade;
    }

    public render() {
        return (
            <Badge
                className="gradeBadge"
                color={this.getColor(this.props.guide)}
            >
                {this.getFlowAdjustGrade(this.props.guide)}
            </Badge>
        );
    }
}
