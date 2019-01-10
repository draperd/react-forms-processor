// @flow
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16.3";
import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import { shouldOptionsBeRefreshed } from "./utils";
import Form from "../components/Form";
import FormFragment from "../components/FormFragment";
import FormContext from "../components/FormContext";
import FormButton from "../components/Button";
import type { FieldDef, OptionsHandler, Options } from "../types";

chai.use(chaiEnzyme());
Enzyme.configure({ adapter: new Adapter() });

describe("shouldOptionsBeRefreshed", () => {
  const optionsShouldNotRefresh: FieldDef = {
    id: "OPTIONS_SHOULD_NOT_CHANGE",
    name: "a",
    type: "select",
    options: [
      {
        items: ["1"]
      }
    ]
  };

  const optionsShouldBeRefreshed: FieldDef = {
    id: "OPTIONS_SHOULD_REFRESH",
    name: "c",
    type: "select",
    options: [
      {
        items: ["1"]
      }
    ],
    refreshOptionsOnChangesTo: ["FAKE", "TRIGGER", "COUNTERFEIT"]
  };

  test("options should not be refreshed unless requested", () => {
    expect(
      shouldOptionsBeRefreshed({
        lastFieldUpdated: "TRIGGER",
        field: optionsShouldNotRefresh
      })
    ).toBe(false);
  });

  test("options should not be refreshed unless last field change is trigger", () => {
    expect(
      shouldOptionsBeRefreshed({
        lastFieldUpdated: "NOPE",
        field: optionsShouldBeRefreshed
      })
    ).toBe(false);
  });

  test("options should refrehs when last field changed is a trigger", () => {
    expect(
      shouldOptionsBeRefreshed({
        lastFieldUpdated: "TRIGGER",
        field: optionsShouldBeRefreshed
      })
    ).toBe(true);
  });

  test("returns false when last field changed is undefined", () => {
    expect(
      shouldOptionsBeRefreshed({
        field: optionsShouldBeRefreshed
      })
    ).toBe(false);
  });
});

describe("options handler", () => {
  const onFormChange = jest.fn();
  const singleField: FieldDef[] = [
    {
      id: "FIELD1",
      name: "prop1",
      type: "text",
      defaultValue: "test"
    },
    {
      id: "FIELD2",
      name: "prop2",
      type: "select",
      refreshOptionsOnChangesTo: ["FIELD1"]
    },
    {
      id: "FIELD3",
      name: "prop3",
      type: "text",
      defaultValue: "test"
    }
  ];

  const optionsHandler: OptionsHandler = jest.fn(
    (fieldId, fields, parentContext) => {
      const options: Options = [
        {
          items: [
            {
              label: "A",
              value: "1"
            },
            {
              label: "B",
              value: "2"
            }
          ]
        }
      ];
      return options;
    }
  );

  const form = mount(
    <Form
      defaultFields={singleField}
      onChange={onFormChange}
      optionsHandler={optionsHandler}
    />
  );

  test("options handler is called initially for each field", () => {
    expect(optionsHandler.mock.calls.length).toBe(3); // Called for each field
  });

  test("options handler is called again when trigger field is updated", () => {
    const inputField = form.find("input[type='text']").at(0);
    inputField.prop("onChange")({ target: { value: "updated" } });
    expect(optionsHandler.mock.calls.length).toBe(4);
  });

  test("options handler is NOT called again if a different field is changed", () => {
    const inputField = form.find("input[type='text']").at(1);
    inputField.prop("onChange")({ target: { value: "updated" } });
    expect(optionsHandler.mock.calls.length).toBe(4);
  });
});
