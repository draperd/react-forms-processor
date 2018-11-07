// @flow
import set from "lodash/set";
import { validateAllFields } from "../utilities/validation";
import type {
  CalculateFormValue,
  CreateFieldDef,
  DetermineChangedValues,
  EvaluateRule,
  EvaluateAllRules,
  FieldDef,
  FormComponentState,
  GetMissingItems,
  GetNextStateFromProps,
  GetTouchedStateForField,
  JoinDelimitedValue,
  MapFieldsById,
  OmitFieldValue,
  Options,
  ProcessFields,
  ProcessOptions,
  RegisterField,
  RegisterFields,
  SplitDelimitedValue,
  UpdateFieldTouchedState,
  UpdateFieldValue,
  Value
} from "../types";

// Because this function can be passed with the state of a component form
// it is not mutating the supplied fields array but returning a new instance
// each time, this is less efficient (when passing entire fieldDef arrays to the
// form) but safer when children of forms are registering themselves
export const registerField: RegisterField = (field, fields, formValue) => {
  if (fieldDefIsValid(field, fields)) {
    const { defaultValue, name, value, valueDelimiter } = field;
    field.defaultValue = getFirstDefinedValue(
      formValue[name],
      value,
      defaultValue
    );
    field.value = splitDelimitedValue(value, valueDelimiter);
    return fields.concat(field);
  }
  return fields.slice();
};

export const registerFields: RegisterFields = (fieldsToValidate, formValue) => {
  const fields = [];
  fieldsToValidate.forEach(field => {
    if (fieldDefIsValid(field, fields)) {
      const { defaultValue, name, value, valueDelimiter } = field;
      const initialValue = getFirstDefinedValue(
        formValue[name],
        value,
        defaultValue
      );

      const fieldToRegister = {
        ...field,
        value: splitDelimitedValue(initialValue, valueDelimiter)
      };
      fields.push(fieldToRegister);
    }
  });
  return fields;
};

export const getNextStateFromFields: GetNextStateFromProps = (
  fields,
  showValidationBeforeTouched,
  formIsDisabled,
  resetTouchedState,
  optionsHandler,
  validationHandler,
  parentContext
) => {
  fields = processFields(fields, !!formIsDisabled, resetTouchedState);
  if (optionsHandler) {
    fields = processOptions(fields, optionsHandler, parentContext);
  }

  fields = validateAllFields(
    fields,
    showValidationBeforeTouched,
    validationHandler,
    parentContext
  );

  const value = calculateFormValue(fields);
  const isValid = fields.every(field => field.isValid);
  const isDiscretelyInvalid = fields.some(field => field.isDiscretelyInvalid);
  const nextState = {
    fields,
    value,
    isValid: isValid && !isDiscretelyInvalid
  };
  return nextState;
};

export const setOptionsInFieldInState = (
  prevState: FormComponentState,
  field: FieldDef,
  options: Options
) => {
  const fieldIndex = prevState.fields.findIndex(
    prevField => prevField.id === field.id
  );

  field.options = options;
  field.pendingOptions = undefined;

  const { fields: prevFields } = prevState;
  return {
    fields: [
      ...prevFields.slice(0, fieldIndex),
      field,
      ...prevFields.slice(fieldIndex + 1)
    ]
  };
};

// A field definition is valid if a field with the same id does not already exist in
// the supplied form state.
// We are assuming that typing takes care that all required attributes are present
export const fieldDefIsValid = (field: FieldDef, fields: FieldDef[]) => {
  return !fields.some(currentField => currentField.id === field.id);
};

export const valuesMatch = (a: Value, b: Value) => {
  if (a && b) {
    return a.toString() === b.toString();
  } else {
    return a === b;
  }
};

export const evaluateRule: EvaluateRule = (rule = {}, targetValue) => {
  const { is = [], isNot = [] } = rule;
  let hasValidValue = is.length === 0;
  let hasInvalidValue = !!rule.isNot && rule.isNot.length > 0;

  if (hasInvalidValue) {
    hasInvalidValue = isNot.some(invalidValue => {
      if (invalidValue.hasOwnProperty("value")) {
        return valuesMatch(invalidValue.value, targetValue);
      } else {
        return valuesMatch(invalidValue, targetValue);
      }
    });
  }

  if (!hasInvalidValue && !hasValidValue) {
    if (rule.is && rule.is.length) {
      hasValidValue = rule.is.some(validValue => {
        if (validValue.hasOwnProperty("value")) {
          return valuesMatch(validValue.value, targetValue);
        } else {
          return valuesMatch(validValue, targetValue);
        }
      });
    }
  }
  return hasValidValue && !hasInvalidValue;
};

export const evaluateAllRules: EvaluateAllRules = (
  rules = [],
  fieldsById = {},
  defaultResult = true
) => {
  let rulesPass = defaultResult;
  if (rules.length) {
    rulesPass = rules.some(rule => {
      if (rule.field && fieldsById.hasOwnProperty(rule.field)) {
        return evaluateRule(rule, fieldsById[rule.field].value);
      } else {
        return defaultResult;
      }
    });
  }
  return rulesPass;
};

export const getTouchedStateForField: GetTouchedStateForField = (
  currentState,
  resetState
) => {
  if (resetState === true) {
    return false;
  }
  return currentState;
};

export const processFields: ProcessFields = (
  fields,
  formIsDisabled,
  resetTouchedState = false
) => {
  const fieldsById = mapFieldsById(fields);
  const updatedFields = fields.map(field => {
    const {
      defaultValue,
      value,
      visible,
      required,
      defaultDisabled,
      trimValue,
      touched = false,
      visibleWhen = [],
      requiredWhen = [],
      disabledWhen = []
    } = field;

    let processedValue = typeof value !== "undefined" ? value : defaultValue;

    return {
      ...field,
      touched: getTouchedStateForField(touched, resetTouchedState),
      value: processedValue,
      visible: evaluateAllRules(visibleWhen, fieldsById, visible !== false),
      required: evaluateAllRules(requiredWhen, fieldsById, !!required),
      disabled:
        formIsDisabled ||
        evaluateAllRules(disabledWhen, fieldsById, !!defaultDisabled)
    };
  });
  return updatedFields;
};

export const processOptions: ProcessOptions = (
  fields,
  optionsHandler,
  parentContext
) => {
  return fields.map(field => {
    const { id, options } = field;
    if (!options) {
      const handlerOptions = optionsHandler(id, fields, parentContext);
      if (handlerOptions instanceof Promise) {
        field.options = [];
        field.pendingOptions = handlerOptions;
      } else if (handlerOptions) {
        field.options = handlerOptions;
        field.pendingOptions = undefined;
      }
    }
    return field;
  });
};

export const mapFieldsById: MapFieldsById = fields => {
  return fields.reduce((map, field) => {
    map[field.id] = field;
    return map;
  }, {});
};

// NOTE: Just used for test purposes...
// TODO: Move to test file...
export const createField: CreateFieldDef = field => {
  const {
    id = "",
    name = "",
    type = "",
    placeholder = "",
    value = undefined,
    visible = true,
    required = false,
    disabled = false,
    visibleWhen = [],
    requiredWhen = [],
    disabledWhen = [],
    validWhen = {},
    isValid = true,
    errorMessages = "",
    touched = false
  } = field;
  return {
    id,
    name,
    type,
    placeholder,
    value,
    visible,
    required,
    disabled,
    visibleWhen,
    requiredWhen,
    disabledWhen,
    isValid,
    validWhen,
    errorMessages,
    touched
  };
};

export const getFirstDefinedValue = (...values: Value) => {
  let valueToReturn;
  values.some(value => {
    if (typeof value !== "undefined") {
      valueToReturn = value;
      return true;
    }
    return false;
  });
  return valueToReturn;
};

export const updateFieldTouchedState: UpdateFieldTouchedState = (
  id,
  touched,
  fields
) => {
  const fieldsById = mapFieldsById(fields);
  const field = fieldsById[id];
  field.touched = touched;
  return fields;
};

export const updateFieldValue: UpdateFieldValue = (id, value, fields) => {
  const fieldsById = mapFieldsById(fields);
  const updateValue = typeof value !== "undefined" && value;
  const field = fieldsById[id];
  if (field.omitWhenHidden && !field.visible) {
    console.log("Not updating field value for", field);
  } else {
    field.value = updateValue;
  }
  return fields;
};

export const splitDelimitedValue: SplitDelimitedValue = (
  value,
  valueDelimiter
) => {
  if (valueDelimiter) {
    if (typeof value === "string") {
      value = value.split(valueDelimiter);
    } else {
      value = [];
    }
  }
  return value;
};

export const joinDelimitedValue: JoinDelimitedValue = (
  value,
  valueDelimiter
) => {
  if (Array.isArray(value) && valueDelimiter) {
    value = value.join(valueDelimiter);
  }
  return value;
};

export const getMissingItems: GetMissingItems<Value> = (
  missingFrom,
  foundIn
) => {
  return foundIn.reduce((missingItems, item) => {
    !missingFrom.includes(item) && missingItems.push(item);
    return missingItems;
  }, []);
};

export const determineChangedValues: DetermineChangedValues = field => {
  const {
    name,
    defaultValue,
    value,
    valueDelimiter,
    addedSuffix = "_added",
    removedSuffix = "_removed"
  } = field;
  const outputValues = [];

  let initialValue = splitDelimitedValue(defaultValue, valueDelimiter);
  if (Array.isArray(initialValue) && Array.isArray(value)) {
    let added = getMissingItems(initialValue, value);
    let removed = getMissingItems(value, initialValue);

    added = joinDelimitedValue(added, valueDelimiter);
    removed = joinDelimitedValue(removed, valueDelimiter);

    outputValues.push(
      {
        name: name + (addedSuffix || "_added"),
        value: added
      },
      {
        name: name + (removedSuffix || "_removed"),
        value: removed
      }
    );
  }
  return outputValues;
};

export const shouldOmitFieldValue: OmitFieldValue = field => {
  const { omitWhenHidden, omitWhenValueIs = [], visible, value } = field;
  return (
    (omitWhenHidden && !visible) ||
    (omitWhenValueIs.length !== 0 &&
      omitWhenValueIs.some(currValue => value === currValue))
  );
};

export const calculateFormValue: CalculateFormValue = fields => {
  return fields.reduce((formValue, field) => {
    const { name, value, trimValue, useChangesAsValues } = field;
    if (shouldOmitFieldValue(field)) {
      return formValue;
    } else if (useChangesAsValues) {
      determineChangedValues(field).forEach(({ name, value }) =>
        set(formValue, name, value)
      );
    } else {
      let processedValue = value;
      if (
        trimValue &&
        processedValue &&
        typeof processedValue.trim === "function"
      ) {
        processedValue = processedValue.trim();
      }
      set(formValue, name, processedValue);
    }

    return formValue;
  }, {});
};
