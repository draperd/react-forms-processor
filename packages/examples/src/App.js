// @flow
import React, { Component } from "react";
import Tabs from "@atlaskit/tabs";
import { Form, FormFragment } from "react-forms-processor";
import { FormBuilder } from "react-forms-processor-formbuilder";
import {
  FieldText,
  FormButton,
  renderer as atlaskitRenderer
} from "react-forms-processor-atlaskit";
import { renderer as materialUiRenderer } from "react-forms-processor-material-ui";
import LiveEditor from "./LiveEditor";
import Tutorial from "./tutorial/Tutorial";
import "./App.css";

import type {
  FieldRenderer,
  FormValue,
  OptionsHandler,
  Options
} from "../../../types";
import {
  createTeamForm,
  frag1,
  frag2,
  form1,
  rendererChoice
} from "./definitions";
import { getOptions } from "./SwapiOptionsHandler";

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
      return getOptions();
    default: {
      return null;
    }
  }
};

const repeatingFields = [
  {
    id: "ID",
    name: "id",
    label: "An id",
    type: "text"
  }
];

const getTabs = (renderer: FieldRenderer) => {
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

  return [
    {
      label: "Tutorial",
      content: <Tutorial renderer={renderer} />
    },
    {
      label: "Live editor",
      content: (
        <LiveEditor
          defaultDefinition={JSON.stringify(form1)}
          renderer={renderer}
        />
      )
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
            showValidationBeforeTouched={false}
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
            This is an example of a Form component with Field component
            children. These will always be displayed as Atlaskit fields because
            those are the components that have been specifically used.
          </p>
          <Form renderer={renderer}>
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
            (each with their own definition) nested within a Tab container
            layout component.
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
          <FormBuilder renderer={renderer} />
        </div>
      )
    }
  ];
};

type AppProps = {};

type AppState = {
  renderer: FieldRenderer,
  selectedTab: any
};

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      renderer: atlaskitRenderer,
      selectedTab: null
    };
  }

  setRenderer(value: FormValue) {
    let renderer = atlaskitRenderer;
    if (value.renderer) {
      switch (value.renderer) {
        case "NATIVE":
          renderer = undefined;
          break;
        case "ATLASKIT":
          renderer = atlaskitRenderer;
          break;

        case "MATERIALUI":
          renderer = materialUiRenderer;
          break;
      }
    }
    this.setState({
      renderer
    });
  }

  handleUpdate(selectedTab: any) {
    this.setState({ selectedTab: selectedTab.label });
  }

  render() {
    const { renderer, selectedTab } = this.state;
    const tabs = getTabs(renderer);
    return (
      <article>
        <section className="header">
          <div>
            <h1>React Forms Processor Demo</h1>
            <a
              href="https://github.com/draperd/react-forms-processor"
              target="_blank"
            >
              GitHub Project Link
            </a>
          </div>
          <Form
            defaultFields={rendererChoice}
            renderer={renderer}
            onChange={(value, isValid) => this.setRenderer(value)}
          />
        </section>
        <Tabs
          tabs={tabs}
          onSelect={selectedTab => this.handleUpdate(selectedTab)}
          isSelectedTest={(selected, tab) => selectedTab === tab.label}
        />
      </article>
    );
  }
}

export default App;
