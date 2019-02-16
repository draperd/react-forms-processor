// @flow
import React, { Component } from "react";
import LiveEditor from "../LiveEditor";
import {
  singleField,
  visibility,
  requiredAndDisabledRules,
  allRulesMustPass,
  fieldsWithOptions,
  manipulateOptions,
  duplicateNames,
  validation,
  comparisonValidation,
  complexValidation
} from "./definitions";
import type { FieldRenderer, OptionsHandler } from "react-forms-processor";
import { getOptions } from "../SwapiOptionsHandler";

// $FlowFixMe
import singleFieldDescription from "./tutorial1.md";
// $FlowFixMe
import visibilityDescription from "./tutorial2.md";
// $FlowFixMe
import requirementDescription from "./tutorial3.md";
// $FlowFixMe
import allRulesDescription from "./tutorial3_1.md";
// $FlowFixMe
import optionsDescription from "./tutorial4.md";
// $FlowFixMe
import manipulateOptionsDescription from "./tutorial5.md";
// $FlowFixMe
import duplicateNamesDescription from "./tutorial6.md";
// $FlowFixMe
import validationDescription from "./tutorial7.md";
// $FlowFixMe
import comparisonValidationDescription from "./tutorial8.md";
// $FlowFixMe
import complexValidationDescription from "./tutorial9.md";

const swapiOptions: OptionsHandler = (fieldId, fields, parentContext) => {
  return getOptions();
};

type TutorialProps = {
  renderer: FieldRenderer
};

type TutorialState = {};

class Tutorial extends Component<TutorialProps, *> {
  render() {
    const { renderer } = this.props;
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
          renderer={renderer}
        />
        <LiveEditor
          defaultDefinition={JSON.stringify(visibility)}
          editorTitle="Making one field control the visibility of another"
          editorDescription={visibilityDescription}
          renderer={renderer}
        />
        <LiveEditor
          defaultDefinition={JSON.stringify(requiredAndDisabledRules)}
          editorTitle="Requirement and disablement rules"
          editorDescription={requirementDescription}
          renderer={renderer}
        />
        <LiveEditor
          defaultDefinition={JSON.stringify(allRulesMustPass)}
          editorTitle="When all rules must pass"
          editorDescription={allRulesDescription}
          renderer={renderer}
        />
        <LiveEditor
          defaultDefinition={JSON.stringify(fieldsWithOptions)}
          editorTitle="Fields with options"
          editorDescription={optionsDescription}
          optionsHandler={swapiOptions}
          renderer={renderer}
        />
        <LiveEditor
          defaultDefinition={JSON.stringify(manipulateOptions)}
          editorTitle="Handling multi-value fields"
          editorDescription={manipulateOptionsDescription}
          renderer={renderer}
        />
        <LiveEditor
          defaultDefinition={JSON.stringify(duplicateNames)}
          editorTitle="Using the multiple fields to control the same value"
          editorDescription={duplicateNamesDescription}
          renderer={renderer}
        />
        <LiveEditor
          defaultDefinition={JSON.stringify(validation)}
          editorTitle="Validating fields"
          editorDescription={validationDescription}
          renderer={renderer}
        />
        <LiveEditor
          defaultDefinition={JSON.stringify(comparisonValidation)}
          editorTitle="Validating against other fields"
          editorDescription={comparisonValidationDescription}
          renderer={renderer}
        />
        <LiveEditor
          defaultDefinition={JSON.stringify(complexValidation)}
          editorTitle="Complex validation"
          editorDescription={complexValidationDescription}
          renderer={renderer}
        />
      </article>
    );
  }
}

export default Tutorial;
