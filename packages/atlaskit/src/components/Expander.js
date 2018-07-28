// @flow
import React, { Component, PureComponent } from "react";
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down";
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right";
import CrossCircleIcon from "@atlaskit/icon/glyph/cross-circle";
import "./Expander.css";

type ChevronProps = {
  isExpanded: boolean,
  //   ariaControls: string,
  onExpandToggle?: Function
};

type ChevronState = {
  isFocused: boolean,
  isHovered: boolean
};

class Chevron extends PureComponent<ChevronProps, ChevronState> {
  state: ChevronState = {
    isFocused: false,
    isHovered: false
  };

  handleClick = () => {
    if (this.props.onExpandToggle) {
      this.props.onExpandToggle();
    }
  };

  handleMouseOver = () => {
    this.setState({ isHovered: true });
  };

  handleMouseOut = () => {
    this.setState({ isHovered: false });
  };

  handleFocus = () => {
    this.setState({ isFocused: true });
  };

  handleBlur = () => {
    this.setState({ isFocused: false });
  };

  render() {
    const { isExpanded /*ariaControls*/ } = this.props;
    // const { isFocused, isHovered } = this.state;
    const iconProps = {
      size: "medium"
      //   primaryColor: isHovered || isFocused ? iconColorFocus : iconColor
    };
    return (
      <span>
        <button
          type={"button"}
          //   aria-controls={ariaControls}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
        >
          {isExpanded ? (
            <ChevronDownIcon label="Collapse" {...iconProps} />
          ) : (
            <ChevronRightIcon label="Expand" {...iconProps} />
          )}
        </button>
      </span>
    );
  }
}

type ExpanderProps = {
  label: string,
  remove: () => void,
  children: any
};

type ExpanderState = {
  isExpanded: boolean
};

export default class Expander extends Component<ExpanderProps, ExpanderState> {
  state: ExpanderState = {
    isExpanded: false
  };

  render() {
    const { isExpanded } = this.state;
    const { children, label, remove } = this.props;

    return (
      <div className="expander">
        <Chevron
          key="chevron"
          isExpanded={isExpanded}
          onExpandToggle={() =>
            this.setState(prevState => ({
              isExpanded: !prevState.isExpanded
            }))
          }
        />
        <span className="label">{label}</span>
        <CrossCircleIcon onClick={remove} />
        <div
          className="content"
          style={{ display: isExpanded ? "block" : "none" }}
        >
          {children}
        </div>
      </div>
    );
  }
}
