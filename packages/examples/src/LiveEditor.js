// @flow
import React, { Component } from "react";
import { Form, FormFragment, FormContext } from "react-forms-processor";
import { renderer, FormButton } from "react-forms-processor-atlaskit";
import { form1 } from "./definitions";
import type { FormValue } from "../../../types";

import brace from "brace";
import AceEditor from "react-ace";
import "brace/mode/json";
import "brace/theme/monokai";

import "./LiveEditor.css";

export type LiveEditorProps = {
  defaultDefinition: string
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
            <h2>Editor</h2>
            <p>
              Try experimenting with the form definition in the editor and see
              how it updates the form rendered in the preview.
            </p>
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
            <h2>Preview</h2>
            <p>
              The form defintion will be rendered here - if the definition is
              invalid then the form will not be displayed
            </p>
            <FormFragment defaultFields={fieldsToRender}>
              <FormButton label="Preview" />
            </FormFragment>
          </div>
          <div>
            <h2>Form value</h2>
            <p>This shows the current value of the form in the preview</p>
            <FormContext.Consumer>
              {context => (
                <pre>{JSON.stringify(context.value, null, "\t")})}</pre>
              )}
            </FormContext.Consumer>
          </div>
        </div>
      </Form>
    );
  }
}
