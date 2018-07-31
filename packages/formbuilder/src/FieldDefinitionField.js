// @flow
import React, { Component, PureComponent } from "react";
import {
  Form,
  FormContext,
  FormFragment,
  getFirstDefinedValue
} from "react-forms-processor";
import Tabs from "@atlaskit/tabs";
import {
  basicInfo,
  optionsInfo,
  rulesInfo,
  validationInfo,
  advancedInfo
} from "./definitions";
import type { FieldDef, FieldRenderer } from "../../../types";

const getTabs = (renderer: FieldRenderer) => {
  return [
    {
      label: "Basics",
      content: (
        <div>
          <div>
            <FormFragment defaultFields={basicInfo} />
          </div>
        </div>
      )
    },
    {
      label: "Options",
      content: (
        <div>
          <FormFragment defaultFields={optionsInfo} />
        </div>
      )
    },
    {
      label: "Attributes",
      content: (
        <div>
          <div>
            <div>
              <FormFragment defaultFields={rulesInfo} />
            </div>
          </div>
        </div>
      )
    },
    {
      label: "Validation",
      content: (
        <div>
          <div>
            <div>
              <div>
                <FormFragment defaultFields={validationInfo} />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      label: "Advanced",
      content: (
        <div>
          <div>
            <div>
              <div>
                <div>
                  <FormFragment defaultFields={advancedInfo} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];
};

type State = {
  selectedTab: any
};

export default class FieldDefinitionField extends Component<FieldDef, State> {
  constructor(props: FieldDef) {
    super(props);
    this.state = {
      selectedTab: null
    };
  }
  handleUpdate(selectedTab: any) {
    this.setState({ selectedTab: selectedTab.label });
  }

  render() {
    const { defaultValue, value, name, id } = this.props;
    const { selectedTab } = this.state;
    return (
      <FormContext.Consumer>
        {context => {
          const {
            renderer,
            optionsHandler,
            onFieldChange,
            parentContext
          } = context;

          // TODO: I think the value prop passed to the form here does not override the state value
          return (
            <Form
              value={value}
              parentContext={context}
              renderer={renderer}
              optionsHandler={optionsHandler}
              onChange={(value, isValid) => {
                onFieldChange(id, value);
              }}
            >
              <Tabs
                tabs={getTabs(renderer)}
                onSelect={selectedTab => this.handleUpdate(selectedTab)}
                isSelectedTest={(selected, tab) => selectedTab === tab.label}
              />
            </Form>
          );
        }}
      </FormContext.Consumer>
    );
  }
}
