// @flow
import {
  comparedTo,
  fallsWithinNumericalRange,
  getDefaultNumericalRangeErrorMessages,
  lengthIsGreaterThan,
  lengthIsLessThan,
  matchesRegEx,
  validateField
} from "./validation";
import { createField } from "./utils.js";
import type {
  FieldDef,
  ValidateField,
  ValidateAllFields
} from "../../../../types";

const field1 = createField({
  id: "one",
  name: "name",
  value: "value"
});

describe("validateField", () => {
  test("visible, optional field is always valid", () => {
    const testField = {
      ...field1,
      visible: true,
      required: false
    };
    expect(validateField(testField, [testField]).isValid).toBe(true);
  });

  test("visible, required field with empty string value is valid", () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: ""
    };
    expect(validateField(testField, [testField]).isValid).toBe(false);
  });

  test("visible, required field with numberical value 0 is valid", () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: 0
    };
    expect(validateField(testField, [testField]).isValid).toBe(true);
  });

  test("visible, required field with false value is valid", () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: false
    };
    expect(validateField(testField, [testField]).isValid).toBe(true);
  });

  test("visible, required field with string value is valid", () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: "test"
    };
    expect(validateField(testField, [testField]).isValid).toBe(true);
  });

  test("visible, required field with empty array value is valid", () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: []
    };
    expect(validateField(testField, [testField]).isValid).toBe(false);
  });

  test("visible, required field with populated array value is valid", () => {
    const testField = {
      ...field1,
      visible: true,
      required: true,
      value: [1]
    };
    expect(validateField(testField, [testField]).isValid).toBe(true);
  });
});

describe("lengthIsGreaterThan validator", () => {
  test("with valid value", () => {
    expect(
      lengthIsGreaterThan({
        value: "test",
        length: 3,
        message: "Fail"
      })
    ).toBeUndefined();
  });

  test("with invvalid value", () => {
    expect(
      lengthIsGreaterThan({
        value: "te",
        length: 3,
        message: "Fail"
      })
    ).toBe("Fail");
  });
});

describe("lengthIsLessThan validator", () => {
  test("with valid value", () => {
    expect(
      lengthIsLessThan({
        value: "te",
        length: 3,
        message: "Fail"
      })
    ).toBeUndefined();
  });

  test("with invvalid value", () => {
    expect(
      lengthIsLessThan({
        value: "test",
        length: 3,
        message: "Fail"
      })
    ).toBe("Fail");
  });
});

describe("matchesRegEx validator", () => {
  test("fails when letters provided for numbers only pattern", () => {
    expect(
      matchesRegEx({ value: "12a3", pattern: "^[\\d]+$", message: "Fail" })
    ).toBe("Fail");
  });

  test("succeeds when numbers provided for numbers only pattern", () => {
    expect(
      matchesRegEx({ value: "1234", pattern: "^[\\d]+$", message: "Fail" })
    ).toBeUndefined();
  });
});

describe("getDefaultNumericalRangeErrorMessages", () => {
  test("for min and max", () => {
    expect(getDefaultNumericalRangeErrorMessages(1, 5)).toEqual(
      "Value cannot be less than 1 or greater than 5"
    );
  });
  test("for just min", () => {
    expect(getDefaultNumericalRangeErrorMessages(1)).toEqual(
      "Value cannot be less than 1"
    );
  });
  test("for just max", () => {
    expect(getDefaultNumericalRangeErrorMessages(undefined, 5)).toEqual(
      "Value cannot be greater than 5"
    );
  });
});

describe("fallsWithinNumericalRange", () => {
  test("fails when given a non-numerical number", () => {
    expect(
      fallsWithinNumericalRange({ value: "abc", min: 5, message: "Fail" })
    ).toBe("Fail");
  });

  test("succeeds with just a min", () => {
    expect(
      fallsWithinNumericalRange({
        value: "5",
        min: 1,
        message: "Fail"
      })
    ).toBeUndefined();
  });

  test("succeeds with just a max", () => {
    expect(
      fallsWithinNumericalRange({
        value: 6,
        max: 10,
        message: "Fail"
      })
    ).toBeUndefined();
  });

  test("fails with just a min", () => {
    expect(
      fallsWithinNumericalRange({
        value: "5",
        min: 10,
        message: "Fail"
      })
    ).toBe("Fail");
  });

  test("fails with just a max", () => {
    expect(
      fallsWithinNumericalRange({
        value: 6,
        max: 5,
        message: "Fail"
      })
    ).toBe("Fail");
  });
});

describe("comparedTo", () => {
  const bigField = createField({
    id: "BIGGEST",
    name: "big",
    value: 500
  });
  const smallField = createField({
    id: "SMALLEST",
    name: "small",
    value: 10
  });
  const longField = createField({
    id: "LONGEST",
    name: "long",
    value: "Really, really long"
  });
  const shortField = createField({
    id: "SHORTEST",
    name: "short",
    value: "short"
  });

  const fields: FieldDef[] = [bigField, smallField, longField, shortField];

  test("150 is not bigger than BIGGEST field", () => {
    expect(
      comparedTo({
        value: 150,
        field: "BIGGEST",
        fields,
        is: "BIGGER",
        message: "Fail"
      })
    ).toBe("Fail");
  });

  test("600 is bigger than BIGGEST field", () => {
    expect(
      comparedTo({
        value: 600,
        field: "BIGGEST",
        fields,
        is: "BIGGER",
        message: "Fail"
      })
    ).toBeUndefined();
  });

  test("150 is not smaller than SMALLEST field", () => {
    expect(
      comparedTo({
        value: 150,
        field: "SMALLEST",
        fields,
        is: "SMALLER",
        message: "Fail"
      })
    ).toBe("Fail");
  });

  test("5 is smaller than SMALLEST field", () => {
    expect(
      comparedTo({
        value: 5,
        field: "SMALLEST",
        fields,
        is: "SMALLER",
        message: "Fail"
      })
    ).toBeUndefined();
  });

  test("'bob' is not longer than LONGEST field", () => {
    expect(
      comparedTo({
        value: "bob",
        field: "LONGEST",
        fields,
        is: "LONGER",
        message: "Fail"
      })
    ).toBe("Fail");
  });

  test("'sizeable' is longer than SHORTEST field", () => {
    expect(
      comparedTo({
        value: "sizeable",
        field: "SHORTEST",
        fields,
        is: "LONGER",
        message: "Fail"
      })
    ).toBeUndefined();
  });

  test("'medium' is not shorter than SHORTEST field", () => {
    expect(
      comparedTo({
        value: "medium",
        field: "SHORTEST",
        fields,
        is: "SHORTER",
        message: "Fail"
      })
    ).toBe("Fail");
  });

  test("'bob' is shorter than SHORTEST field", () => {
    expect(
      comparedTo({
        value: "bob",
        field: "SHORTEST",
        fields,
        is: "SHORTER",
        message: "Fail"
      })
    ).toBeUndefined();
  });
});
