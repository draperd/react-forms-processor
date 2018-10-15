// @flow
import React, { Component } from "react";
import { Form, FormContext } from "react-forms-processor";
import { FormButton } from "react-forms-processor-atlaskit";
import get from "lodash/get";
import type {
  FieldRenderer,
  FieldDef,
  FormContextData,
  FormValue,
  Options,
  OptionsHandler,
  ValidationHandler
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

type GetDefinedFields = (
  ?FormContextData,
  fieldsProp: string,
  idProp: string
) => Options;

const getDefinedFields: GetDefinedFields = (
  parentContext,
  fieldsProp,
  idProp
) => {
  const fields = get(parentContext, fieldsProp);
  const id = get(parentContext, idProp);
  if (fields && fields.length) {
    const value = fields;
    if (Array.isArray(value)) {
      const fields = [];
      value.forEach(field => {
        if (field.field && field.field.id && field.field.id !== id) {
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
  const attributeOptionRegex = /FIELD_[\d]+_FIELDS/gm;
  if (id === "COMPARED_TO_FIELDS") {
    const definedFields = getDefinedFields(
      parentContext,
      "parentContext.value.fields",
      "value.field.id"
    );
    return definedFields;
  } else if (attributeOptionRegex.test(id)) {
    const definedFields = getDefinedFields(
      parentContext,
      "parentContext.parentContext.value.fields",
      "parentContext.value.field.id"
    );
    return definedFields;
  }
  return null;
};

const validationHandler: ValidationHandler = (field, fields, parentContext) => {
  if (field.id === "ID") {
    let matchingIdCount = 0;
    const requestedFieldId = field.value;

    const allFields = get(parentContext, "parentContext.value.fields", []);
    allFields.forEach(currField => {
      const currFieldId = get(currField, "field.id");
      if (currFieldId === requestedFieldId) {
        matchingIdCount++;
      }
    });

    if (matchingIdCount > 1) {
      // There will always be one id that matches - e.g. the current one
      return "That id has already been used";
    }
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
            validationHandler={validationHandler}
            conditionalUpdate={true}
          />
        </section>
        <section>
          <div> Preview </div>
          <Form
            defaultFields={previewFields.slice()}
            renderer={previewRenderer}
            conditionalUpdate={true}
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
