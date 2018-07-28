// @flow
import React, { Component, type Node } from "react";
import { Form, FormContext } from "react-forms-processor";
import type { FieldDef, OnFormChange } from "../../../types";

type Props = {
  defaultValue: Object[], // TODO: Could be anything - not just fields
  fields: FieldDef[],
  onChange?: any => void
};

type State = {
  items: Object[], // TODO: Could be anything - not just fields
  forms: Node[]
};

type CreateFormChangeHandler = (index: number) => OnFormChange;

const createFormForItem = (
  item: Object,
  targetIndex: number,
  fieldsForForm: FieldDef[],
  createFormChangeHandler: CreateFormChangeHandler
): Node => {
  const formChangeHandler = createFormChangeHandler(targetIndex);
  return (
    <FormContext.Consumer>
      {context => {
        const { renderer, optionsHandler } = context;
        return (
          <Form
            parentContext={context}
            key={`FIELD_${targetIndex}`}
            defaultFields={fieldsForForm}
            renderer={renderer}
            value={item}
            optionsHandler={optionsHandler}
            onChange={formChangeHandler}
          />
        );
      }}
    </FormContext.Consumer>
  );
};

const addFormForItem = (
  item: Object,
  forms: Node[],
  fieldsForForm: FieldDef[],
  createFormChangeHandler: CreateFormChangeHandler
): Node[] => {
  const targetIndex = forms.length;
  const newForm = createFormForItem(
    item,
    targetIndex,
    fieldsForForm,
    createFormChangeHandler
  );
  return [...forms, newForm];
};

export default class Repeats extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { fields, defaultValue: items = [], onChange } = props;

    const createFormChangeHandler = (targetIndex: number): OnFormChange => (
      value,
      isValid
    ) => {
      const { items } = this.state;
      items[targetIndex] = value;
      this.setState(
        {
          items
        },
        () => {
          const { onChange } = this.props;
          const { items } = this.state;
          onChange && onChange(items);
        }
      );
    };

    let forms = [];
    items.forEach((item, index) => {
      forms = addFormForItem(item, forms, fields, createFormChangeHandler);
    });

    this.state = {
      forms,
      items
    };

    // For each item, render a form
  }

  // TODO: Remove an item from state
  // TODO: Add an item to state
  // TODO: Re-order items in state

  render() {
    // Render the items in the state
    const { forms } = this.state;
    return <div>{forms}</div>;
  }
}
