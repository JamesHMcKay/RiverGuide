import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  facebook: {
    background: "#3b5998",
    color: "white",
  },
  google: {
    background: "#4f85ec",
    color: "white",
  },
});

/* eslint-disable react/require-default-props */
function ProviderButton(props) {
  const buttonProps = Object.assign({}, props);
  const propsToDelete = ["primary", "social"];

  propsToDelete.map((value) => delete buttonProps[value]);

  const label = !isEmpty(props.label) && !props.children ? <span>{props.label}</span> : props.children;
  const { classes } = props;
  return (
    <Button
      style = {{height: "40px"}}
      className = {classes[props.social]}
      type={props.type || "button"}
      {...buttonProps}
    >
      {label}
    </Button>
  );
}

ProviderButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.any,
  label: PropTypes.string,
  primary: PropTypes.bool,
  type: PropTypes.string,
};

export default withStyles(styles)(ProviderButton);
