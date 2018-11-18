// @flow
import type {
  AllAreTrue,
  ComparedTo,
  Condition,
  FallsWithinNumericalRange,
  FieldDef,
  IsNotValue,
  IsValue,
  LengthIsGreaterThan,
  LengthIsLessThan,
  MatchesRegEx,
  NoneAreTrue,
  SomeAreTrue,
  Value,
  ValidateField,
  ValidateAllFields,
  ValidationRules
} from "../types";

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
      } else if (target.visible === true) {
        // TODO: Only comparing against visible fields at the moment, but is there a case where
        //       you might want to hide a value in a hidden field?
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

  if (
    typeof value === "undefined" ||
    value === null ||
    (typeof value === "string" && !value.length)
  ) {
    return undefined;
  }

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

export const isNotValue: IsNotValue = ({ value, values, message }) => {
  if (values.some(currValue => currValue === value)) {
    return message || "Unacceptable value provided";
  }
};

export const isValue: IsValue = ({ value, values, message }) => {
  if (!values.some(currValue => currValue === value)) {
    return message || "Unacceptable value provided";
  }
};

export const runValidator = (
  validatorKey: string,
  validWhen: Condition,
  valueToTest: Value,
  allFields: FieldDef[]
): boolean => {
  const validator = validators[validatorKey];
  if (typeof validator === "function") {
    const validatorConfig = {
      ...validWhen[validatorKey],
      value: valueToTest,
      allFields
    };
    const message = validator(validatorConfig);
    return message === undefined;
  } else {
    return false;
  }
};

export const checkConditions = (
  condition: Condition,
  value: Value,
  allFields: FieldDef[],
  type: "some" | "all"
) => {
  let valueToTest; // Don't initialise to current field value in case field doesn't exist
  if (condition.field) {
    const targetField = allFields.find(field => condition.field === field.id);
    if (targetField) {
      valueToTest = targetField.value;
    }
  } else {
    valueToTest = value;
  }

  const { field, ...validWhen } = condition;
  switch (type) {
    case "some": {
      return Object.keys(validWhen).some(validatorKey =>
        runValidator(validatorKey, condition, valueToTest, allFields)
      );
    }

    default: {
      return Object.keys(validWhen).every(validatorKey =>
        runValidator(validatorKey, condition, valueToTest, allFields)
      );
    }
  }
};

export const noneAreTrue: NoneAreTrue = ({
  value,
  allFields,
  message,
  conditions
}): string | void => {
  const allConditionsPass = conditions.some(condition =>
    checkConditions(condition, value, allFields, "some")
  );

  return allConditionsPass ? message : undefined;
};

export const someAreTrue: SomeAreTrue = ({
  value,
  allFields,
  message,
  conditions
}) => {
  const allConditionsPass = conditions.some(condition =>
    checkConditions(condition, value, allFields, "some")
  );

  return allConditionsPass ? undefined : message;
};

export const allAreTrue: AllAreTrue = ({
  value,
  allFields,
  message,
  conditions
}): string | void => {
  const allConditionsPass = conditions.every(condition =>
    checkConditions(condition, value, allFields, "all")
  );

  return allConditionsPass ? undefined : message;
};

export const validators = {
  allAreTrue,
  comparedTo,
  fallsWithinNumericalRange,
  is: isValue,
  isNot: isNotValue,
  lengthIsGreaterThan,
  lengthIsLessThan,
  matchesRegEx,
  noneAreTrue,
  someAreTrue
};

export const hasValue = (value: Value): boolean => {
  const valueIsEmptyArray = Array.isArray(value) && value.length === 0;
  const hasValue =
    (value || value === 0 || value === false) && !valueIsEmptyArray;
  return hasValue;
};

export const getValueFromField = (field: FieldDef): Value => {
  const { trimValue = false, value } = field;
  let trimmedValue = value;
  if (trimValue && trimmedValue && typeof trimmedValue.trim === "function") {
    trimmedValue = trimmedValue.trim();
  }
  return trimmedValue;
};

export const validateField: ValidateField = (
  field,
  fields,
  showValidationBeforeTouched,
  validationHandler,
  parentContext
) => {
  const { required, visible, validWhen = {}, touched = false } = field;
  let isValid = true;
  let errorMessages = [];
  if (visible) {
    const value = getValueFromField(field);
    const valueProvided = hasValue(value);
    if (required) {
      if (!valueProvided) {
        isValid = valueProvided;
        const { missingValueMessage = "A value must be provided" } = field;
        errorMessages.push(missingValueMessage);
      }
    } else if (!valueProvided) {
      // do not run all validations if the field is empty
      return Object.assign({}, field, {
        isValid: true,
        isDiscretelyInvalid: !isValid,
        errorMessages: errorMessages.length ? errorMessages.join(", ") : ""
      });
    }

    isValid =
      Object.keys(validWhen).reduce((allValidatorsPass, validator) => {
        if (typeof validators[validator] === "function") {
          let validationConfig = {
            ...validWhen[validator],
            value,
            allFields: fields
          };
          // $FlowFixMe - covered by tests
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
