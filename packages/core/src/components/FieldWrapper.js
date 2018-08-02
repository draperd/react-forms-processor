// @flow
import React, { type Node } from "react";
import styled from "styled-components";
import FormContext from "./FormContext";
import type { Field, FieldDef } from "../../../../types";

const Layout = styled.div`
  > div {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    margin-bottom: 20px;
  }
`;

export type FieldWrapperProps = Field & {
  children: Node
};

class FieldWrapper extends React.Component<FieldWrapperProps> {
  constructor(props: FieldWrapperProps) {
    super(props);
    const { registerField, onFieldChange, ...fieldDef } = props;
    if (registerField) {
      registerField(fieldDef);
    } else {
      console.warn(
        "Could not register field because registerField function was missing",
        fieldDef
      );
    }
  }
  render() {
    const { id, fields = [], onFieldChange, children } = this.props;
    const fieldToRender = fields.find(field => field.id === id);
    if (fieldToRender && fieldToRender.visible) {
      const processedChildren = React.Children.map(children, child =>
        React.cloneElement(child, {
          onFieldChange,
          ...fieldToRender
        })
      );
      const { description, id } = fieldToRender;
      return <Layout id={id}>{processedChildren}</Layout>;
    }

    return null;
  }
}

export default (props: FieldDef & { children: Node }) => (
  <FormContext.Consumer>
    {form => {
      return (
        <FieldWrapper {...form} {...props}>
          {props.children}
        </FieldWrapper>
      );
    }}
  </FormContext.Consumer>
);
