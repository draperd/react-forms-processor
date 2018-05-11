// @flow
import React from "react";
import InfoIcon from "@atlaskit/icon/glyph/info";
import Tooltip from "@atlaskit/tooltip";

export type DescriptionProps = {
  description?: string
};

export default class Description extends React.Component<DescriptionProps> {
  render() {
    const { description = "" } = this.props;
    if (description.trim !== "") {
      return (
        <Tooltip content={description} position="right">
          <InfoIcon primaryColor="#6554C0" />
        </Tooltip>
      );
    } else {
      return null;
    }
  }
}
