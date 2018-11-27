// @flow
import type { Node } from "react";
import type { FormComponentState } from "./types/components";

export type {
  FormComponentState,
  FormComponentProps,
  FormFragmentComponentProps,
  FormFragmentComponentWithContextProps,
  FieldWrapperComponentProps,
  FieldWrapperComponentWithContextProps
} from "./types";

export type FormButtonProps = {
  label?: string,
  onClick: (value: FormValue) => void,
  value?: FormValue,
  isValid?: boolean
};

export type Value = any;

export type Rule = {
  field: string,
  is?: Value[],
  isNot?: Value[]
};

export type OnFieldFocus = (id: string) => void;

export type OnFieldChange = (id: string, value: any) => void;

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

export type IsNotValue = ({
  value: Value,
  values: Array<Value>,
  message: string
}) => void | string;

export type IsValue = ({
  value: Value,
  values: Array<Value>,
  message: string
}) => void | string;

export type ComparedTo = ({
  value: Value,
  fields: string[],
  allFields: FieldDef[],
  is: "SMALLER" | "BIGGER" | "LONGER" | "SHORTER",
  message: string
}) => void | string;

export type LengthIsGreaterThanConfig = {|
  length: number,
  message?: string
|};

export type LengthIsLessThanConfig = {|
  length: number,
  message?: string
|};

export type MatchesRegExConfig = {|
  pattern: string,
  message?: string
|};

export type FallsWithinNumericalRangeConfig = {|
  min?: number,
  max?: number,
  required?: boolean,
  message?: string
|};

export type ComparedToConfig = {|
  fields: string[],
  is: "SMALLER" | "BIGGER" | "LONGER" | "SHORTER",
  message?: string
|};

export type IsValueConfig = {|
  values: Array<any>,
  message?: string
|};

export type IsNotValueConfig = {|
  values: Array<any>,
  message?: string
|};

export type CoreValidationRules = {|
  lengthIsGreaterThan?: LengthIsGreaterThanConfig,
  lengthIsLessThan?: LengthIsLessThanConfig,
  matchesRegEx?: MatchesRegExConfig,
  fallsWithinNumericalRange?: FallsWithinNumericalRangeConfig,
  comparedTo?: ComparedToConfig,
  isNot?: IsNotValueConfig,
  is?: IsValueConfig
|};

export type Condition = {|
  field?: string,
  ...CoreValidationRules
|};

export type ComplexValidationConfig = {|
  message?: string,
  conditions: Array<Condition>
|};

export type ComplexValidation = ({
  value: Value,
  allFields: FieldDef[],
  message: string,
  ...ComplexValidationConfig
}) => string | void;

export type AllAreTrue = ComplexValidation;
export type SomeAreTrue = ComplexValidation;
export type NoneAreTrue = ComplexValidation;

export type ValidationRules = {|
  ...CoreValidationRules,
  allAreTrue?: ComplexValidationConfig,
  someAreTrue?: ComplexValidationConfig,
  noneAreTrue?: ComplexValidationConfig
|};

export type Option =
  | {
      label?: string,
      value: Value,
      misc?: any
    }
  | string;

export type OptionGroup = {
  heading?: string,
  items: Option[]
};

export type Options = OptionGroup[];

export type OptionsHandler = (
  string,
  FieldDef[],
  ?FormContextData
) => Options | null | Promise<Options>;

export type ValidationHandler = (
  FieldDef,
  FieldDef[],
  ?FormContextData
) => string | null; // TODO: Add this return type!!!  | Promise<string>;

export type FieldDef = {
  id: string,
  name: string,
  label?: string,
  description?: string,
  placeholder?: string,
  type?: string,
  defaultValue?: void | string | number | boolean | Array<any>,
  value?: void | string | number | boolean | Array<any>,
  visible?: boolean,
  required?: boolean,
  missingValueMessage?: string,
  defaultDisabled?: boolean,
  disabled?: boolean,
  disabledWhen?: Rule[],
  visibleWhen?: Rule[],
  requiredWhen?: Rule[],
  validWhen?: ValidationRules,
  isValid?: boolean,
  isDiscretelyInvalid?: boolean,
  errorMessages?: string,
  omitWhenHidden?: boolean,
  omitWhenValueIs?: Value[],
  useChangesAsValues?: boolean,
  valueDelimiter?: string,
  addedSuffix?: string,
  removedSuffix?: string,
  options?: Options,
  pendingOptions?: Promise<Options>,
  misc?: {
    [string]: any
  },
  trimValue?: boolean,
  touched?: boolean // TODO: Should this actually be on field?
};

export type Field = FieldDef & {
  fields: FieldDef[],
  onFieldChange: OnFieldChange,
  onFieldFocus: OnFieldFocus,
  registerField?: FieldDef => void
};

export type FieldRenderer = (FieldDef, OnFieldChange, OnFieldFocus) => any;

export type FormValue = {
  [string]: Value
};

export type OnFormChange = (FormValue, boolean) => void;

export type OnFormFocus = (fieldId: string) => void;

export type EvaluateRule = (rule?: Rule, targetValue: Value) => boolean;

export type FieldsById = {
  [string]: FieldDef
};

export type EvaluateAllRules = (
  rules: Rule[],
  fieldsById: FieldsById,
  defaultResult: boolean
) => boolean;

export type ProcessFields = (FieldDef[], boolean, boolean) => FieldDef[];
export type ProcessOptions = (
  FieldDef[],
  OptionsHandler,
  ?FormContextData
) => FieldDef[];

export type ValidationResult = {
  isValid: boolean,
  errorMessages: string
};

export type ValidateField = (
  FieldDef,
  FieldDef[],
  boolean,
  ?ValidationHandler,
  ?FormContextData
) => FieldDef;

export type ValidateAllFields = (
  FieldDef[],
  boolean,
  ?ValidationHandler,
  ?FormContextData
) => FieldDef[];

export type CreateFieldDef = ($Shape<FieldDef>) => FieldDef;

export type MapFieldsById = (FieldDef[]) => FieldsById;

export type RegisterField = (FieldDef, FieldDef[], FormValue) => FieldDef[];
export type RegisterFields = (FieldDef[], FormValue) => FieldDef[];

export type UpdateFieldValue = (string, Value, FieldDef[]) => FieldDef[];
export type UpdateFieldTouchedState = (
  string,
  boolean,
  FieldDef[]
) => FieldDef[];

export type SplitDelimitedValue = (Value, ?string) => string[] | string;
export type JoinDelimitedValue = (Value, ?string) => string | Value[];
export type GetMissingItems<T> = (Array<T>, Array<T>) => Array<T>;
export type DetermineChangedValues = FieldDef => Array<{
  name: string,
  value: Value
}>;

export type GetTouchedStateForField = (boolean, boolean) => boolean;

export type GetNextStateFromProps = (
  FieldDef[],
  boolean,
  boolean,
  boolean,
  ?OptionsHandler,
  ?ValidationHandler,
  ?FormContextData
) => $Shape<FormComponentState>;

export type CalculateFormValue = (FieldDef[]) => FormValue;

export type OmitFieldValue = FieldDef => boolean;

export type FormContextData = {
  fields: FieldDef[],
  value: FormValue,
  isValid: boolean,
  options: {
    [string]: Options
  },
  optionsHandler?: OptionsHandler,
  validationHandler?: ValidationHandler,
  registerField: FieldDef => void,
  renderer: FieldRenderer,
  onFieldChange: OnFieldChange,
  onFieldFocus: OnFieldFocus,
  parentContext?: FormContextData,
  showValidationBeforeTouched: boolean,
  conditionalUpdate: boolean,
  disabled: boolean
};
