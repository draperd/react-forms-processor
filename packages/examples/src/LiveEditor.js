// @flow
import React, { Component } from "react";
import { Form, FormFragment, FormContext } from "react-forms-processor";
import { FormButton } from "react-forms-processor-atlaskit";
import { form1 } from "./definitions";
import type {
  FieldDef,
  FieldRenderer,
  FormValue,
  OptionsHandler
} from "react-forms-processor";

import brace from "brace";
import AceEditor from "react-ace";
import "brace/mode/json";
import "brace/theme/monokai";

import ReactMarkdown from "react-markdown";

import "./LiveEditor.css";

export type LiveEditorProps = {
  defaultDefinition: string,
  editorTitle?: string,
  editorDescription?: string,
  previewTitle?: string,
  previewDescription?: string,
  formValueTitle?: string,
  formValueDescription?: string,
  optionsHandler?: OptionsHandler,
  renderer: FieldRenderer
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
      definition: defaultDefinition,
      fields: JSON.parse(defaultDefinition)
    };
  }

  updateDefinition(definition: string) {
    this.setState({
      definition
    });
  }

  render() {
    const { definition, value } = this.state;
    const { renderer } = this.props;

    const {
      editorTitle = "Editor",
      editorDescription = "Try experimenting with the form definition in the editor and see how it updates the form rendered in the preview.",
      previewTitle = "Preview",
      previewDescription = "The form defintion will be rendered here - if the definition is invalid then the form will not be displayed",
      formValueTitle = "Value",
      formValueDescription = "This shows the current value of the form in the preview",
      optionsHandler
    } = this.props;

    let fieldsToRender, prettyDefinition;
    try {
      fieldsToRender = JSON.parse(definition);
      prettyDefinition = JSON.stringify(fieldsToRender, null, "\t");
    } catch (e) {
      prettyDefinition = definition;
    }

    return (
      <div>
        <div className="live-editor">
          <div className="editor">
            <h2>{editorTitle}</h2>
            <ReactMarkdown source={editorDescription} />
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
            <Form
              renderer={renderer}
              onChange={value => {
                this.setState({ value });
              }}
              defaultFields={fieldsToRender}
              optionsHandler={optionsHandler}
            >
              <FormButton
                label="Preview"
                onClick={(value: FormValue) => console.log("Form value", value)}
              />
            </Form>
          </div>
          <div className="value">
            <h2>{formValueTitle}</h2>
            <p>{formValueDescription}</p>
            <pre>{JSON.stringify(value, null, "\t")}</pre>
          </div>
        </div>
      </div>
    );
  }
}
