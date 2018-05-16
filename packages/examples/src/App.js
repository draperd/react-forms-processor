// @flow
import React, { Component } from "react";
import Tabs from "@atlaskit/tabs";
import { Form, FormFragment } from "react-forms-processor";
import { FormBuilder } from "react-forms-processor-formbuilder";
import {
  FieldText,
  FormButton,
  renderer
} from "react-forms-processor-atlaskit";
import LiveEditor from "./LiveEditor";
import Tutorial from "./tutorial/Tutorial";

import type { FormValue, OptionsHandler, Options } from "../../../types";
import { createTeamForm, frag1, frag2, form1 } from "./definitions";

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
    case "MEMBERS":
      return fetch("https://swapi.co/api/people/")
        .then(response => response.json())
        .then(json => {
          const items = json.results.map(character => character.name);
          const options: Options = [
            {
              items
            }
          ];
          return options;
        });
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

const codeValue = JSON.stringify({ bob: { ted: "value" } });

const AppTabs = [
  // {
  //   label: "Tutorial",
  //   content: <Tutorial />
  // },
  {
    label: "Live editor",
    content: <LiveEditor defaultDefinition={JSON.stringify(form1)} />
  },
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
          renderer={renderer}
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
        <Form renderer={renderer}>
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
      <article>
        <h1>React Forms Processor Demo</h1>
        <Tabs tabs={AppTabs} />
      </article>
    );
  }
}

export default App;
