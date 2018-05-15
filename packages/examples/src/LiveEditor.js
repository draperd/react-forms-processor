// @flow
import React, { Component } from "react";
import { Form, FormFragment, FormContext } from "react-forms-processor";
import { renderer, FormButton } from "react-forms-processor-atlaskit";
import { form1 } from "./definitions";
import type { FieldDef, FormValue } from "../../../types";

import brace from "brace";
import AceEditor from "react-ace";
import "brace/mode/json";
import "brace/theme/monokai";

import "./LiveEditor.css";

export type LiveEditorProps = {
  defaultDefinition: FieldDef[],
  editorTitle?: string,
  editorDescription?: string,
  previewTitle?: string,
  previewDescription?: string,
  formValueTitle?: string,
  formValueDescription?: string
};

export type LiveEditorState = {
  definition: string,
  fields: any,
  value?: FormValue
};

const editorOptions = {
  lineNumbers: true,
  mode: "json"
};

export default class LiveEditor extends Component<
  LiveEditorProps,
  LiveEditorState
> {
  constructor(props: LiveEditorProps) {
    super(props);

    const { defaultDefinition } = props;
    this.state = {
      definition: JSON.stringify(defaultDefinition),
      fields: defaultDefinition
    };
  }

  updateDefinition(definition: string) {
    this.setState({
      definition
    });
  }

  render() {
    const { definition, value } = this.state;
    const {
      editorTitle = "Editor",
      editorDescription = "Try experimenting with the form definition in the editor and see how it updates the form rendered in the preview.",
      previewTitle = "Preview",
      previewDescription = "The form defintion will be rendered here - if the definition is invalid then the form will not be displayed",
      formValueTitle = "Value",
      formValueDescription = "This shows the current value of the form in the preview"
    } = this.props;

    let fieldsToRender, prettyDefinition;
    try {
      fieldsToRender = JSON.parse(definition);
      prettyDefinition = JSON.stringify(fieldsToRender, null, "\t");
    } catch (e) {
      prettyDefinition = definition;
    }

    return (
      <Form
        renderer={renderer}
        onChange={value => {
          this.setState({ value });
        }}
        value={value}
      >
        <div className="live-editor">
          <div className="editor">
            <h2>{editorTitle}</h2>
            <p>{editorDescription}</p>
            <AceEditor
              width="800px"
              value={prettyDefinition}
              mode="json"
              theme="monokai"
              onChange={definition => this.updateDefinition(definition)}
              name="EDITOR"
              editorProps={{ $blockScrolling: true }}
              wrapEnabled={true}
            />
          </div>
          <div className="preview">
            <h2>{previewTitle}</h2>
            <p>{previewDescription}</p>
            <FormFragment defaultFields={fieldsToRender} />
            <FormButton label="Preview" />
          </div>
          <div>
            <h2>{formValueTitle}</h2>
            <p>{formValueDescription}</p>
            <FormContext.Consumer>
              {context => (
                <pre>{JSON.stringify(context.value, null, "\t")}</pre>
              )}
            </FormContext.Consumer>
          </div>
        </div>
      </Form>
    );
  }
}
