// @flow
import React, { Component } from "react";
import { Form, FormContext } from "react-forms-processor";
import { FormButton } from "react-forms-processor-atlaskit";
import type {
  FieldRenderer,
  FieldDef,
  FormContextData,
  FormValue,
  Options,
  OptionsHandler
} from "../../../types";
import renderer from "./renderer";
import { formBuilder } from "./definitions";

type Props = {
  renderer?: FieldRenderer
};

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
    parentContext.parentContext.parentContext &&
    parentContext.parentContext.parentContext.value &&
    parentContext.parentContext.parentContext.value.fields.length
  ) {
    const value = parentContext.parentContext.parentContext.value.fields;
    if (Array.isArray(value)) {
      const fields = [];
      value.forEach(field => {
        if (field.field && field.field.id) {
          fields.push({
            value: field.field.id
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
    const previewFields = value.fields.map(value => value.field);
    this.setState({
      previewFields
    });
  }

  render() {
    const { previewFields } = this.state;
    const previewRenderer = this.props.renderer || renderer;
    return (
      <div className="App">
        <section>
          <Form
            defaultFields={formBuilder}
            renderer={renderer}
            onChange={(value, isValid) => {
              this.onBuilderFormChange(value, isValid);
            }}
            optionsHandler={optionsHandler}
            // value={{ fields: [{ field: { id: "bob" } }] }}
          />
        </section>
        <section>
          <div> Preview </div>
          <Form
            defaultFields={previewFields.slice()}
            renderer={previewRenderer}
          >
            <FormButton
              label="Test"
              onClick={(value: FormValue) =>
                console.log("Form preview value", value)
              }
            />
          </Form>
        </section>
        <section>
          <pre>{JSON.stringify(previewFields.slice(), null, 2)}</pre>
        </section>
      </div>
    );
  }
}
