import React, { Component } from "react";
import { Badge } from "reactstrap";
import { IGauge, IGradeRange, IGuide, IThemeColor } from "./../../utils/types";

interface IGradeBadgeProps {
    gauges: IGauge[];
    guide: IGuide;
}

export class GradeBadge extends Component<IGradeBadgeProps> {
    constructor(props: IGradeBadgeProps) {
        super(props);
    }

    public flowFilterCondition(grade: IGradeRange, guide: IGuide): boolean {
        const gradeFrom: number = parseInt(grade.from, 10);
        const gradeTo: number = parseInt(grade.to, 10);
        const gaugeName: string = guide.gaugeName || "";

        const gaugeAtThisSite: IGauge | undefined = this.props.gauges.find(
            (gauge: IGauge) =>
                gauge.siteName.toLowerCase() === gaugeName.toLowerCase(),
        );

        if (gaugeAtThisSite) {
            const currentFlow: number = gaugeAtThisSite.currentFlow;
            return gradeFrom <= currentFlow && gradeTo >= currentFlow
                ? true
                : false;
        } else {
            return false;
        }
    }

    public getColor(guide: IGuide): IThemeColor {
        const flowSpecificGrades: IGradeRange[] | undefined = this.props.guide.flowSpecificGrades;
        if (flowSpecificGrades && flowSpecificGrades.length > 0) {
            const filteredGrades: IGradeRange[] = flowSpecificGrades.filter((grade: IGradeRange) =>
                this.flowFilterCondition(grade, guide),
            );
            return filteredGrades.length > 0 ? IThemeColor.primary : IThemeColor.secondary;
        } else {
            return IThemeColor.primary;
        }
    }

    public getFlowAdjustGrade(guide: IGuide): string | undefined {
        if (guide.flowSpecificGrades) {
            const grades: IGradeRange[] = guide.flowSpecificGrades.filter((grade: IGradeRange) =>
                this.flowFilterCondition(grade, guide),
            );

            if (grades.length > 0) {
                return grades[0].from;
            }
        }
        return guide.grade;
    }

    public render(): JSX.Element {
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
