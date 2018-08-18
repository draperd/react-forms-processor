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
  field: string,
  fields: FieldDef[],
  is: "SMALLER" | "BIGGER" | "LONGER" | "SHORTER",
  message: string
}) => void | string;

export const comparedTo: ComparedTo = ({
  value,
  field = "",
  fields = [],
  is = "BIGGER",
  message
}) => {
  const target = fields.find(currField => currField.id === field);
  if (!target) {
    console.warn(`Could not find field ${field} to compare to`);
    return;
  }

  const targetValue = target.value;
  const targetLabel = target.label || "";

  switch (is) {
    case "BIGGER": {
      return targetValue < value
        ? undefined
        : message || `Not bigger than ${targetLabel}`;
    }

    case "SMALLER": {
      return targetValue > value
        ? undefined
        : message || `Not smaller than ${targetLabel}`;
    }

    case "LONGER": {
      return targetValue.length < value.length
        ? undefined
        : message || `Not longer than ${targetLabel}`;
    }

    case "SHORTER": {
      return targetValue.length > value.length
        ? undefined
        : message || `Not longer than ${targetLabel}`;
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
  fallsWithinNumericalRange
};

export const validateField: ValidateField = (field, fields) => {
  const { required, visible, value, validWhen = {} } = field;
  let isValid = true;
  let errorMessages = [];
  if (visible) {
    if (required) {
      const valueIsEmptyArray = Array.isArray(value) && value.length === 0;
      isValid = (value || value === 0 || value === false) && !valueIsEmptyArray;
    }

    isValid =
      Object.keys(validWhen).reduce((allValidatorsPass, validator) => {
        if (typeof validators[validator] === "function") {
          let validationConfig = {
            // $FlowFixMe
            ...validWhen[validator],
            value,
            fields
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
  return Object.assign({}, field, {
    isValid,
    errorMessages: errorMessages.join(", ")
  });
};

export const validateAllFields: ValidateAllFields = fields => {
  const validatedFields = fields.map(field => validateField(field, fields));
  return validatedFields;
};
