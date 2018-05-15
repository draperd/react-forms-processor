// @flow
import React, { Component } from "react";
import LiveEditor from "../LiveEditor";
import { singleField } from "./definitions";

class Tutorial extends Component<*, *> {
  render() {
    return (
      <article>
        <h2>Step-by-Step Examples</h2>
        <p>
          Read through the examples below to understand how to create complex
          form definitions
        </p>
        <LiveEditor
          defaultDefinition={singleField}
          editorTitle="A single field"
          editorDescription="This is the definition for a single text field"
        />
      </article>
    );
  }
}

export default Tutorial;
