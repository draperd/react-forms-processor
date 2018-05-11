// @flow
import React, { Component } from "react";
import { Form, FormContext } from "react-forms-processor";
import { FormButton, renderer } from "react-forms-processor-atlaskit";
import type {
  FieldDef,
  FormContextData,
  FormValue,
  Options,
  OptionsHandler
} from "../../../types";
import { formBuilder } from "./definitions";

type Props = {};

type State = {
  previewFields: FieldDef[],
  builderFields: Array<any>,
  previewFormValue: any,
  previewFormButtonDisabled: boolean
};

type GetDefinedFields = (?FormContextData) => Options;

const getDefinedFields: GetDefinedFields = parentContext => {
  if (
    parentContext &&
    parentContext.parentContext &&
    parentContext.parentContext.fields.length &&
    parentContext.parentContext.fields[0].value
  ) {
    const value = parentContext.parentContext.fields[0].value;
    if (Array.isArray(value)) {
      const fields = [];
      value.forEach(field => {
        if (field.id) {
          fields.push({
            value: field.id
          });
        }
      });
      return [
        {
          items: fields
        }
      ];
    }
  }
  return [];
};

const optionsHandler: OptionsHandler = (id, fields, parentContext) => {
  if (id === "FIELD") {
    const definedFields = getDefinedFields(parentContext);
    return definedFields;
  }
  return null;
};

export default class FormBuilder extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      previewFields: [],
      builderFields: [],
      previewFormValue: {},
      previewFormButtonDisabled: false
    };
  }

  onBuilderFormChange(value: FormValue, isValid: boolean) {
    this.setState({
      previewFields: value.fields
    });
  }

  render() {
    const { previewFields } = this.state;
    return (
      <div className="App">
        <section>
          <Form
            defaultFields={formBuilder}
            renderField={renderer}
            onChange={(value, isValid) =>
              this.onBuilderFormChange(value, isValid)
            }
            optionsHandler={optionsHandler}
          />
        </section>
        <section>
          <div> Preview </div>
          <Form defaultFields={previewFields.slice()} renderField={renderer}>
            <FormButton
              label="Test"
              onClick={(value: FormValue) =>
                console.log("Form preview value", value)
              }
            />
          </Form>
        </section>
      </div>
    );
  }
}
