import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
// import { expect } from "chai";
import Form from "./components/Form";
import { FieldDef } from "./types";

Enzyme.configure({ adapter: new Adapter() });

describe("Default renderer", () => {
  test("single text field", () => {
    const singleField: FieldDef[] = [
      {
        id: "FIELD1",
        name: "prop1",
        defaultValue: "test",
        type: "text"
      }
    ];
    // NOTE: It's not possible to test components using the new React Context API yet in Enzyme,
    //       See https://github.com/airbnb/enzyme/pull/1513
    // const wrapper = mount(<Form />);
  });
});
