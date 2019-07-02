import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import React, { Component } from "react";
import { connect } from "react-redux";
import { setSelectedLogId, toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { ILogComplete, ILogListItem, IObsValue } from "../../utils/types";
import LogbookHead from "./LogbookHead";
import "./profile.css";

interface IEnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ILogListItem) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    columnOrder: Array<keyof ILogListItem>;
    publicPage: boolean;
}

function dateWrapper(inputDate: string): JSX.Element {
  const dateParsed: Date = new Date(inputDate);
  return (
    <div>
      {dateParsed.toDateString()}
    </div>
  );
}

function renderElement(input: any, key: keyof ILogListItem): React.ReactNode  {
  if (key === "start_date_time") {
    return dateWrapper(input);
  }
  return input;
}

const headRows: IHeadRow[] = [
    { id: "start_date_time", numeric: false, disablePadding: false, label: "Date"},
    { id: "guide_name", numeric: false, disablePadding: true, label: "Guide name" },
    { id: "rating", numeric: true, disablePadding: false, label: "Rating" },
    { id: "participants", numeric: true, disablePadding: false, label: "Participants" },
    { id: "flow", numeric: true, disablePadding: false, label: "Flow"},
    { id: "username", numeric: true, disablePadding: false, label: "User name"},
];

function EnhancedTableHead(props: IEnhancedTableProps): JSX.Element {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, columnOrder } = props;
    const createSortHandler: any = (property: keyof ILogListItem): any => (event: React.MouseEvent<unknown>): any => {
      onRequestSort(event, property);
    };

    const indexedColumns: {[key: string]: IHeadRow} = {};
    for (const row of headRows) {
        indexedColumns[row.id] = row;
    }

    const headerRowsOrdered: IHeadRow[] = columnOrder.map(
      (item: keyof ILogListItem) => indexedColumns[item],
    );

    return (
      <TableHead>
          <TableRow>
              <TableCell padding="checkbox">
                {!props.publicPage &&
                  <Checkbox
                      indeterminate={numSelected > 0 && numSelected < rowCount}
                      checked={numSelected === rowCount}
                      onChange={onSelectAllClick}
                  />}
              </TableCell>
              {headerRowsOrdered.map((row: IHeadRow) => (
              <TableCell
                  key={row.id}
                  align={row.numeric ? "right" : "left"}
                  padding={row.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === row.id ? order : false}
              >
                  <TableSortLabel
                  active={orderBy === row.id}
                  direction={order}
                  onClick={createSortHandler(row.id)}
                  >
                  {row.label}
                  </TableSortLabel>
              </TableCell>
              ))}
          </TableRow>
      </TableHead>
    );
}

function desc<T>(a: T, b: T, orderBy: keyof T): number {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

function stableSort<T>(array: T[], cmp: (a: T, b: T) => number): T[] {
    const stabilizedThis: Array<[T, number]> = array.map((el: T, index: number) => [el, index] as [T, number]);
    stabilizedThis.sort((a: [T, number], b: [T, number]) => {
      const order: number = cmp(a[0], b[0]);
      if (order !== 0) { return order; }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el: [T, number]) => el[0]);
  }

type Order = "asc" | "desc";

function getSorting<K extends keyof any>(
    order: Order,
    orderBy: K,
  ): (a: { [key in K]: number | string }, b: { [key in K]: number | string }) => number {
    return order === "desc" ?
    (a: { [key in K]: string | number; }, b: { [key in K]: string | number; }): number =>
      desc(a, b, orderBy) : (a: { [key in K]: string | number; }, b: { [key in K]: string | number; }): number => {
        return -desc(a, b, orderBy);
    };
  }

interface IHeadRow {
    disablePadding: boolean;
    id: keyof ILogListItem;
    label: string;
    numeric: boolean;
  }

interface ILogBookProps extends ILogBookStateProps {
    toggleModal: (modal?: string) => void;
    setSelectedLogId: (logId: string[]) => void;
    columnOrder: Array<keyof ILogListItem>;
    publicPage: boolean;
    log: ILogComplete[];
}

interface ILogBookStateProps {
    openModal: string;
    selectedLogIds: string[];
}

interface ILogBookState {
    listItems: ILogListItem[];
    orderBy: keyof ILogListItem;
    order: Order;
    page: number;
    rowsPerPage: number;
}

interface IGetColumnsArg {
  row: ILogListItem;
  columnOrder: Array<keyof ILogListItem>;
  isItemSelected: boolean;
  labelId: string;
}

class Logbook extends Component<ILogBookProps, ILogBookState> {
    constructor(props: ILogBookProps) {
        super(props);
        this.state = {
            page: 0,
            order: "asc",
            rowsPerPage: 5,
            orderBy: "start_date_time",
            listItems: this.createList(this.props.log),
        };
    }

    public getFlow = (observables: IObsValue | undefined): string => {
      if (!observables) {
        return "";
      } else {
        if (observables.flow) {
          return observables.flow.toFixed(1);
        } else if (observables.stage_height) {
          return observables.stage_height.toFixed(1);
        }
      }
      return "";
    }

    public createList = (inputList: ILogComplete[]): ILogListItem[] => {
        const listItems: ILogListItem[] = inputList.map((item: ILogComplete) => ({
            guide_name: item.guide_name,
            guide_id: item.guide_id,
            start_date_time: item.start_date_time,
            end_date_time: item.end_date_time,
            participants: item.participants,
            rating: item.rating,
            log_id: item.log_id,
            id: item.id,
            flow: item.flow,
            username: item.username,
            river_name: item.river_name,
        }));
        return listItems;
    }

    public setRowsPerPage = (rowsPerPage: number): void => {
        this.setState({
            rowsPerPage,
        });
    }

    public setOrderBy = (orderBy: keyof ILogListItem): void => {
        this.setState({
            orderBy,
        });
    }

    public setPage = (page: number): void => {
        this.setState({
            page,
        });
    }

    public setOrder = (order: Order): void => {
        this.setState({
            order,
        });
    }

    public openModal = (): void => {
        this.props.toggleModal("addTrip");
    }

    public handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ILogListItem): void => {
        const isDesc: boolean = this.state.orderBy === property && this.state.order === "desc";
        this.setOrderBy(property);
        this.setOrder(isDesc ? "asc" : "desc");
      }

      public setSelected = (selection: string[]): void => {
          this.props.setSelectedLogId(selection);
      }

    public handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.checked) {
           const newSelecteds: string[] = this.state.listItems.map((n: ILogListItem) => n.log_id);
           this.setSelected(newSelecteds);
           return;
        }
        this.setSelected([]);
      }

      public handleCheckClick = (name: string): void => {
        const selectedIndex: number = this.props.selectedLogIds.indexOf(name);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
          newSelected = newSelected.concat(this.props.selectedLogIds, name);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(this.props.selectedLogIds.slice(1));
        } else if (selectedIndex === this.props.selectedLogIds.length - 1) {
          newSelected = newSelected.concat(this.props.selectedLogIds.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            this.props.selectedLogIds.slice(0, selectedIndex),
            this.props.selectedLogIds.slice(selectedIndex + 1),
          );
        }
        this.setSelected(newSelected);
      }

      public handlePublicClick = (name: string): void => {
        this.props.setSelectedLogId([name]);
        this.props.toggleModal("viewTripDetails");
      }

      public handleClick = (event: React.MouseEvent<unknown>, name: string): void => {
        event.stopPropagation();
        this.handleCheckClick(name);
      }

      public handleChangePage = (event: unknown, newPage: number): void => {
        this.setPage(newPage);
      }

      public handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.setRowsPerPage(+event.target.value);
      }

    public isSelected = (name: string): boolean => this.props.selectedLogIds.indexOf(name) !== -1;

    public getColumns = (input: IGetColumnsArg): JSX.Element[] | null => {
        const output: JSX.Element[] = [(
            <TableCell padding="checkbox" key = {"checkbox"}>
            {!this.props.publicPage &&
                <Checkbox
                  onClick={(event: any): void => this.handleClick(event, input.row.log_id)}
                  checked={input.isItemSelected}
                  inputProps={{ "aria-labelledby": input.labelId }}
                />
              }
            </TableCell>
        )];
        for (const key of input.columnOrder) {
            if (output.length === 1) {
                output.push(
                  <TableCell
                    component="th"
                    id={input.labelId}
                    scope="row"
                    padding="none"
                    key={key}
                  >{renderElement(input.row[key], key)}</TableCell>,
                );
            } else {
                output.push(
                  <TableCell key={key} align="right">
                    {renderElement(input.row[key], key)}
                  </TableCell>,
                );
            }
        }
        return output;
    }

    public render(): JSX.Element {
        const listItems: ILogListItem[] = this.createList(this.props.log);
        const emptyRows: number = this.state.rowsPerPage - Math.min(
          this.state.rowsPerPage,
          listItems.length - this.state.page * this.state.rowsPerPage,
        );

        return (
            <div style={{width: "100%", marginTop: "0em"}}>
            <Paper style={{width: "100%", marginTop: "1em"}}>
              {!this.props.publicPage && <LogbookHead/>}
              <div style={{overflowX: "auto"}}>
                <Table
                  // style={{minWidth: 750}}
                  aria-labelledby="tableTitle"
                >
                  <EnhancedTableHead
                    numSelected={this.props.selectedLogIds.length}
                    order={this.state.order}
                    orderBy={this.state.orderBy}
                    onSelectAllClick={this.handleSelectAllClick}
                    onRequestSort={this.handleRequestSort}
                    rowCount={listItems.length}
                    columnOrder={this.props.columnOrder}
                    publicPage={this.props.publicPage}
                  />
                  <TableBody>
                    {stableSort(listItems, getSorting(this.state.order, this.state.orderBy))
                      .slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                      .map((row: ILogListItem, index: number) => {
                        const isItemSelected: boolean = this.isSelected(row.log_id);
                        const labelId: string = `enhanced-table-checkbox-${index}`;
                        return (
                          <TableRow
                            hover
                            onClick={(event: any): void => {this.handlePublicClick(row.log_id); }}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.log_id}
                            selected={isItemSelected}
                          >
                            {this.getColumns({row, columnOrder: this.props.columnOrder, isItemSelected, labelId})}
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 40 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={listItems.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                backIconButtonProps={{
                  "aria-label": "Previous Page",
                }}
                nextIconButtonProps={{
                  "aria-label": "Next Page",
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
          </div>
        );
    }
}

function mapStateToProps(state: IState): ILogBookStateProps {
    return ({
        openModal: state.openModal,
        selectedLogIds: state.selectedLogId,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, setSelectedLogId },
)(Logbook);
