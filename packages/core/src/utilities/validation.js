// @flow
import type {
  FieldDef,
  Value,
  ValidateField,
  ValidateAllFields
} from "../../../../types";

export type LengthIsGreaterThan = ({
  value: Value,
  length: number,
  message: string
}) => void | string;

export type LengthIsLessThan = ({
  value: Value,
  length: number,
  message: string
}) => void | string;

export type MatchesRegEx = ({
  value: Value,
  pattern: string,
  message: string
}) => void | string;

export type FallsWithinNumericalRange = ({
  value: Value,
  min?: number,
  max?: number,
  required?: boolean,
  message: string
}) => void | string;

export type ComparedTo = ({
  value: Value,
  fields: string[],
  allFields: FieldDef[],
  is: "SMALLER" | "BIGGER" | "LONGER" | "SHORTER",
  message: string
}) => void | string;

export const findFieldsToCompareTo = (
  fieldsToFind: string[],
  allFields: FieldDef[]
): FieldDef[] => {
  const targetFields = [];

  typeof fieldsToFind.forEach === "function" &&
    fieldsToFind.forEach(targetField => {
      const target = allFields.find(currField => targetField === currField.id);
      if (!target) {
        console.warn(`Could not find field ${targetField} to compare against`);
      } else {
        targetFields.push(target);
      }
    });

  return targetFields;
};

export const isBigger = (value: Value, comparedTo: FieldDef) =>
  compareSize(value, comparedTo, "BIGGER");

export const isSmaller = (value: Value, comparedTo: FieldDef) =>
  compareSize(value, comparedTo, "SMALLER");

export const compareSize = (
  value: Value,
  comparedTo: FieldDef,
  type: "BIGGER" | "SMALLER"
): boolean => {
  const targetValue = parseFloat(value);
  const compareValue = parseFloat(comparedTo.value);
  if (targetValue === NaN || compareValue === NaN) {
    return false;
  } else if (type === "BIGGER") {
    return targetValue > compareValue;
  } else {
    return targetValue < compareValue;
  }
};

export const isLonger = (value: Value, comparedTo: FieldDef) =>
  compareLength(value, comparedTo, "LONGER");
export const isShorter = (value: Value, comparedTo: FieldDef) =>
  compareLength(value, comparedTo, "SHORTER");

export const compareLength = (
  value: Value,
  comparedTo: FieldDef,
  type: "LONGER" | "SHORTER"
): boolean => {
  const valueLength = value ? value.toString().length : undefined;
  const compareLength = comparedTo.value
    ? comparedTo.value.toString().length
    : undefined;
  if (valueLength === undefined || compareLength === undefined) {
    return false;
  } else if (type === "LONGER") {
    return valueLength > compareLength;
  } else {
    return valueLength < compareLength;
  }
};

export const comparedTo: ComparedTo = ({
  value,
  fields = [],
  allFields = [],
  is = "BIGGER",
  message
}) => {
  const targetFields = findFieldsToCompareTo(fields, allFields);

  switch (is) {
    case "BIGGER": {
      return targetFields.every(targetField => isBigger(value, targetField))
        ? undefined
        : message || `Not the biggest field`;
    }

    case "SMALLER": {
      return targetFields.every(targetField => isSmaller(value, targetField))
        ? undefined
        : message || `Not the smallest field`;
    }

    case "LONGER": {
      return targetFields.every(targetField => isLonger(value, targetField))
        ? undefined
        : message || `Not the longer field`;
    }

    case "SHORTER": {
      return targetFields.every(targetField => isShorter(value, targetField))
        ? undefined
        : message || `Not the shortest field`;
    }

    default:
      return;
  }
};

export const lengthIsGreaterThan: LengthIsGreaterThan = ({
  value,
  length,
  message
}) => {
  if (isNaN(length) || (value || "").length > length) {
    return;
  } else {
    return message || `Should have more than ${length} characters`;
  }
};

export const lengthIsLessThan: LengthIsLessThan = ({
  value,
  length,
  message
}) => {
  if (isNaN(length) || (value || "").length < length) {
    return;
  } else {
    return message || `Should have more than ${length} characters`;
  }
};

// TODO: Consider option for inverting rule...
export const matchesRegEx: MatchesRegEx = ({
  value,
  pattern = ".*",
  message
}) => {
  const regExObj = new RegExp(pattern);
  if (!regExObj.test(value)) {
    return message || "Invalid input provided"; // <= Terrible message!
  }
};

export const getDefaultNumericalRangeErrorMessages = (
  min: number | void,
  max: number | void
) => {
  if (typeof min !== "undefined" && typeof max !== "undefined") {
    return `Value cannot be less than ${min} or greater than ${max}`;
  } else if (typeof min !== "undefined") {
    return `Value cannot be less than ${min}`;
  } else if (typeof max !== "undefined") {
    return `Value cannot be greater than ${max}`;
  }
};

export const fallsWithinNumericalRange: FallsWithinNumericalRange = ({
  value,
  min,
  max,
  required,
  message
}) => {
  const parsedValue = parseFloat(value);
  if (isNaN(parsedValue)) {
    return message || "Value must be a number";
  }
  if (typeof min !== "undefined" && value < min) {
    return message || getDefaultNumericalRangeErrorMessages(min, max);
  }
  if (typeof max !== "undefined" && value > max) {
    return message || getDefaultNumericalRangeErrorMessages(min, max);
  }
};

export const validators = {
  lengthIsGreaterThan,
  lengthIsLessThan,
  matchesRegEx,
  fallsWithinNumericalRange,
  comparedTo
};

export const validateField: ValidateField = (
  field,
  fields,
  showValidationBeforeTouched,
  validationHandler,
  parentContext
) => {
  const { required, visible, value, validWhen = {}, touched = false } = field;
  let isValid = true;
  let errorMessages = [];
  if (visible) {
    if (required) {
      const valueIsEmptyArray = Array.isArray(value) && value.length === 0;
      isValid = (value || value === 0 || value === false) && !valueIsEmptyArray;
      errorMessages.push("A value must be provided");
    }

    isValid =
      Object.keys(validWhen).reduce((allValidatorsPass, validator) => {
        if (typeof validators[validator] === "function") {
          let validationConfig = {
            // $FlowFixMe
            ...validWhen[validator],
            value,
            allFields: fields
          };

          let message = validators[validator](validationConfig);
          if (message) {
            allValidatorsPass = false;
            errorMessages.push(message);
          }
        } else {
          console.warn("The requested validator does not exist", validator);
        }

        return allValidatorsPass;
      }, isValid) && isValid;
  }
  if (validationHandler) {
    let message = validationHandler(field, fields, parentContext);
    if (message) {
      isValid = false;
      errorMessages.push(message);
    }
  }

  if (!showValidationBeforeTouched && !touched) {
    return Object.assign({}, field, {
      isValid: true,
      isDiscretelyInvalid: !isValid,
      errorMessages: ""
    });
  }

  return Object.assign({}, field, {
    isValid,
    isDiscretelyInvalid: !isValid,
    errorMessages: errorMessages.join(", ")
  });
};

export const validateAllFields: ValidateAllFields = (
  fields,
  showValidationBeforeTouched,
  validationHandler,
  parentContext
) => {
  const validatedFields = fields.map(field =>
    validateField(
      field,
      fields,
      showValidationBeforeTouched,
      validationHandler,
      parentContext
    )
  );
  return validatedFields;
};
