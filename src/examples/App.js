// @flow
import React, { Component } from "react";
import Tabs from "@atlaskit/tabs";

import Form from "../components/Form";
import FormFragment from "../components/FormFragment";
import renderAkField from "../renderers/AtlaskitFields";
import FormBuilder from "../components/FormBuilder";
import FieldText from "../components/fields/atlaskit/FieldText";
import FormButton from "../components/buttons/atlaskit/FormButton";

import type { FormValue, OptionsHandler, Options } from "../types";
import { createTeamForm, frag1, frag2 } from "./definitions";

const teamFormOptionsHandler: OptionsHandler = (
  fieldId,
  fields,
  parentContext
) => {
  switch (fieldId) {
    case "ISSUE_SOURCE":
      const options: Options = [
        {
          items: [
            {
              label: "Board 1",
              value: "BOARD1"
            },
            {
              label: "Project A",
              value: "PROJ_A"
            }
          ]
        }
      ];
      return options;
    default: {
      return null;
    }
  }
};

const tabs = [
  {
    label: "Tab1",
    content: (
      <div>
        <FormFragment defaultFields={frag1} />
      </div>
    )
  },
  {
    label: "Tab2",
    content: <FormFragment defaultFields={frag2} />
  }
];

const AppTabs = [
  {
    label: "Single Definition",
    content: (
      // Keep this as a span to avoid content between tabs "bleeding" - there seems to be some strange behaviour with the tab component
      // If all tabs have the same root element then form context is shared
      <span>
        <p>
          This is an example of the Form component given a single form
          definition
        </p>
        <Form
          defaultFields={createTeamForm}
          optionsHandler={teamFormOptionsHandler}
          renderField={renderAkField}
        >
          <FormButton
            onClick={(value: FormValue) =>
              console.log("Definition button value", value)
            }
          />
        </Form>
      </span>
    )
  },
  {
    label: "Field components",
    content: (
      <div>
        <p>
          This is an example of a Form component with Field component children
        </p>
        <Form>
          <FieldText
            id="NAME"
            name="name"
            placeholder="Who are you?"
            value=""
            label="Name"
            description="Tell me a bit about yourself"
            required={true}
            visibleWhen={[{ field: "SHOW", is: ["YES"] }]}
          />
          <FieldText
            id="SHOW"
            name="show"
            placeholder="Show the name field?"
            value="YES"
            label="Show"
          />
          <FormButton
            label="Save"
            onClick={(value: FormValue) =>
              console.log("Inline button value", value)
            }
          />
        </Form>
      </div>
    )
  },
  {
    label: "Multiple definitions as fragments",
    content: (
      // Needs to be different element to prevent tab bleed (in this case to prevent the form being disabled because of bleed from tab 1)
      <section>
        <p>
          This is an example of a Form component with FormFragment components
          (each with their own definition) nested within a Tab container layout
          component.
        </p>
        <Form renderField={renderAkField}>
          <Tabs tabs={tabs} />
          <FormButton
            label="Frags"
            onClick={(value: FormValue) =>
              console.log("Multi fragment form button value", value)
            }
          />
        </Form>
      </section>
    )
  },
  {
    label: "Form builder",
    content: (
      <div style={{ width: "100%" }}>
        <p>
          This is an example the FormBuilder component that can be used to
          dynamically build forms
        </p>
        <FormBuilder />
      </div>
    )
  }
];

class App extends Component<*, *> {
  render() {
    return (
      <div>
        <Tabs tabs={AppTabs} />
      </div>
    );
  }
}

export default App;
