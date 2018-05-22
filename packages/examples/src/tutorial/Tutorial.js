// @flow
import React, { Component } from "react";
import LiveEditor from "../LiveEditor";
import {
  singleField,
  visibility,
  requiredAndDisabledRules,
  fieldsWithOptions,
  manipulateOptions,
  duplicateNames
} from "./definitions";
import type { OptionsHandler } from "../../../../types";
import { getOptions } from "../SwapiOptionsHandler";

import singleFieldDescription from "./tutorial1.md";
import visibilityDescription from "./tutorial2.md";
import requirementDescription from "./tutorial3.md";
import optionsDescription from "./tutorial4.md";
import manipulateOptionsDescription from "./tutorial5.md";
import duplicateNamesDescription from "./tutorial6.md";

const swapiOptions: OptionsHandler = (fieldId, fields, parentContext) => {
  return getOptions();
};
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
          editorDescription={singleFieldDescription}
        />
        <LiveEditor
          defaultDefinition={JSON.stringify(visibility)}
          editorTitle="Making one field control the visibility of another"
          editorDescription={visibilityDescription}
        />
        <LiveEditor
          defaultDefinition={JSON.stringify(requiredAndDisabledRules)}
          editorTitle="Requirement and disablement rules"
          editorDescription={requirementDescription}
        />
        <LiveEditor
          defaultDefinition={JSON.stringify(fieldsWithOptions)}
          editorTitle="Fields with options"
          editorDescription={optionsDescription}
          optionsHandler={swapiOptions}
        />
        <LiveEditor
          defaultDefinition={JSON.stringify(manipulateOptions)}
          editorTitle="Handling multi-value fields"
          editorDescription={manipulateOptionsDescription}
        />
        {/* <LiveEditor
          defaultDefinition={JSON.stringify(duplicateNames)}
          editorTitle="Using the multiple fields to control the same value"
          editorDescription={duplicateNamesDescription}
        /> */}
        <h3>
          There are more examples still to be written - lots more to
          demonstrate!
        </h3>
      </article>
    );
  }
}

export default Tutorial;
