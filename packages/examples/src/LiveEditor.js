// @flow
import React, { Component } from "react";
import { Form, FormFragment } from "react-forms-processor";
import { renderer } from "react-forms-processor-atlaskit";
import { form1 } from "./definitions";

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
  fields: any
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
    const { definition } = this.state;

    let fieldsToRender, prettyDefinition;
    try {
      fieldsToRender = JSON.parse(definition);
      prettyDefinition = JSON.stringify(fieldsToRender, null, "\t");
    } catch (e) {
      prettyDefinition = definition;
    }

    return (
      <div className="live-editor">
        <div className="editor">
          <h2>Editor</h2>
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
          <Form renderField={renderer} defaultFields={fieldsToRender} />
        </div>
      </div>
    );
  }
}
