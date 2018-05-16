// @flow
import React, { Component } from "react";
import LiveEditor from "../LiveEditor";
import { singleField } from "./definitions";

import markdown from "./tutorial1.md";

// const markdown = "# This is a header\n\nAnd this is a paragraph";

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
          defaultDefinition={JSON.stringify(singleField)}
          editorTitle="A single field"
          editorDescription={markdown}
        />
      </article>
    );
  }
}

export default Tutorial;
