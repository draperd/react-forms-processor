// @flow
import { allAreTrue, noneAreTrue, someAreTrue } from "./validation";
import { createField } from "./utils.js";
import type { FieldDef, ComplexValidationConfig } from "../types";

const allAreTrueExample: ComplexValidationConfig = {
  message: "fail",
  conditions: [
    {
      field: "TRIGGER",
      isNot: {
        values: ["on"]
      }
    },
    {
      isNot: {
        values: ["invalid"]
      }
    }
  ]
};

const triggerField = createField({
  id: "TRIGGER",
  name: "trigger",
  value: "off"
});

const targetField = createField({
  id: "TARGET",
  name: "target",
  value: "valid"
});

const allFields = [triggerField, targetField];

describe("allAreTrue", () => {
  test("should pass when both conditions are true", () => {
    expect(
      allAreTrue({
        value: "valid",
        allFields,
        ...allAreTrueExample
      })
    ).toBeUndefined();
  });
  test("should fail when one conditions is false", () => {
    triggerField.value = "on";
    expect(
      allAreTrue({
        value: "valid",
        allFields,
        ...allAreTrueExample
      })
    ).toBe("fail");
  });
});

describe("someAreTrue", () => {
  triggerField.value = "off";
  targetField.value = "valid";
  test("should pass when both conditions are true", () => {
    expect(
      someAreTrue({
        value: "valid",
        allFields,
        ...allAreTrueExample
      })
    ).toBeUndefined();
  });
  test("should still pass when one condition is false", () => {
    triggerField.value = "on";
    expect(
      someAreTrue({
        value: "valid",
        allFields,
        ...allAreTrueExample
      })
    ).toBeUndefined();
  });
  test("should fail when both conditions are false", () => {
    triggerField.value = "on";
    targetField.value = "invalid";
    expect(
      someAreTrue({
        value: "invalid",
        allFields,
        ...allAreTrueExample
      })
    ).toBe("fail");
  });
});

describe("noneAreTrue", () => {
  triggerField.value = "off";
  targetField.value = "valid";
  test("should fail when both conditions are true", () => {
    expect(
      noneAreTrue({
        value: "valid",
        allFields,
        ...allAreTrueExample
      })
    ).toBe("fail");
  });
  test("should still fail when one condition is false", () => {
    triggerField.value = "on";
    expect(
      noneAreTrue({
        value: "valid",
        allFields,
        ...allAreTrueExample
      })
    ).toBe("fail");
  });
  test("should pass when both conditions are false", () => {
    triggerField.value = "on";
    targetField.value = "invalid";
    expect(
      noneAreTrue({
        value: "invalid",
        allFields,
        ...allAreTrueExample
      })
    ).toBeUndefined();
  });
});
