import React from "react";
import ProviderButton from "../ProviderButton/";
import { capitalize } from "lodash";
import PropTypes from "prop-types";

function SocialLink({ pretext, provider }) {
  let icon = provider;
  if (provider === "facebook") {
    icon = "facebook-square";
  }
  return (
    <a href={`https://rapidsapi.herokuapp.com/connect/${provider}`} className="link">
      <ProviderButton
        type="button"
        social={provider}
        style={{ width: "90%", marginTop: "10px",  marginBottom: "10px" }}
      >
        <i className={`fa fa-${icon}`} style = {{fontSize: "30px", position: "absolute", left: "10px"}}/>
        {pretext + capitalize(provider)}
      </ProviderButton>
    </a>
  );
}

SocialLink.propTypes = {
  provider: PropTypes.string.isRequired,
  pretext: PropTypes.string.isRequired,
};

export default SocialLink;
