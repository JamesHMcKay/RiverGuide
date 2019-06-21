import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import theme from "./theme";

export interface IDialogTitleProps {
    title: string;
    handleClose: () => void;

}

function DialogTitle(props: IDialogTitleProps): JSX.Element {
  const { title, handleClose } = props;

  return (
    <div style={{padding: `${theme.spacing() * 2}px ${theme.spacing() * 3}px 0`}}>
      <Typography align="center" variant="h6">
        {title}
      </Typography>
      {handleClose ? (
        <IconButton aria-label="Close" style={{position: "absolute",
        right: theme.spacing() / 2,
        top: theme.spacing() / 2,
        color: theme.palette.grey[500]}} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </div>
  );
}

export default DialogTitle;
