// @flow
import {
  comparedTo,
  fallsWithinNumericalRange,
  findFieldsToCompareTo,
  getDefaultNumericalRangeErrorMessages,
  isBigger,
  isLonger,
  isShorter,
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

describe("isBigger", () => {
  const fieldOne = createField({
    id: "ONE",
    name: "one",
    value: "5"
  });
  test("number strings are parsed to numbers", () => {
    expect(isBigger("6", fieldOne)).toBe(true);
  });

  test("returns false if one field has a non-numeric string value", () => {
    fieldOne.value = "bob";
    expect(isBigger(2, fieldOne)).toBe(false);
  });

  test("numbers are correctly handled - 6 is bigger than 5", () => {
    fieldOne.value = 5;
    expect(isBigger(6, fieldOne)).toBe(true);
  });

  test("numbers are correctly handled - 2 is not bigger than 5", () => {
    fieldOne.value = 5;
    expect(isBigger(2, fieldOne)).toBe(false);
  });
});

describe("isLonger", () => {
  const field = createField({
    id: "ONE",
    name: "one",
    value: "a value"
  });

  test("null value is never longer", () => {
    expect(isLonger(null, field)).toBe(false);
  });

  test("undefined field values are never shorter", () => {
    field.value = undefined;
    expect(isLonger("bob", field)).toBe(false);
  });

  test("numbers are converted to strings", () => {
    field.value = "bob";
    expect(isLonger(1234, field)).toBe(true);
  });

  test("string values are compared correctly - 1234 is longer than bob", () => {
    expect(isLonger("1234", field)).toBe(true);
  });

  test("string values are compared correctly - 12 is not longer than bob", () => {
    expect(isLonger("12", field)).toBe(false);
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

  const allFields: FieldDef[] = [bigField, smallField, longField, shortField];

  test("finds available fields", () => {
    expect(
      findFieldsToCompareTo(["BIGGEST", "NOPE", "SHORTEST", "NAH"], allFields)
    ).toMatchSnapshot();
  });

  test("150 is not bigger than BIGGEST field", () => {
    expect(
      comparedTo({
        value: 150,
        fields: ["BIGGEST"],
        allFields,
        is: "BIGGER",
        message: "Fail"
      })
    ).toBe("Fail");
  });

  test("600 is bigger than BIGGEST field", () => {
    expect(
      comparedTo({
        value: 600,
        fields: ["BIGGEST"],
        allFields,
        is: "BIGGER",
        message: "Fail"
      })
    ).toBeUndefined();
  });

  test("150 is not smaller than SMALLEST field", () => {
    expect(
      comparedTo({
        value: 150,
        fields: ["SMALLEST"],
        allFields,
        is: "SMALLER",
        message: "Fail"
      })
    ).toBe("Fail");
  });

  test("5 is smaller than SMALLEST field", () => {
    expect(
      comparedTo({
        value: 5,
        fields: ["SMALLEST"],
        allFields,
        is: "SMALLER",
        message: "Fail"
      })
    ).toBeUndefined();
  });

  test("'bob' is not longer than LONGEST field", () => {
    expect(
      comparedTo({
        value: "bob",
        fields: ["LONGEST"],
        allFields,
        is: "LONGER",
        message: "Fail"
      })
    ).toBe("Fail");
  });

  test("'sizeable' is longer than SHORTEST field", () => {
    expect(
      comparedTo({
        value: "sizeable",
        fields: ["SHORTEST"],
        allFields,
        is: "LONGER",
        message: "Fail"
      })
    ).toBeUndefined();
  });

  test("'medium' is not shorter than SHORTEST field", () => {
    expect(
      comparedTo({
        value: "medium",
        fields: ["SHORTEST"],
        allFields,
        is: "SHORTER",
        message: "Fail"
      })
    ).toBe("Fail");
  });

  test("'bob' is shorter than SHORTEST field", () => {
    expect(
      comparedTo({
        value: "bob",
        fields: ["SHORTEST"],
        allFields,
        is: "SHORTER",
        message: "Fail"
      })
    ).toBeUndefined();
  });
});
