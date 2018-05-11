// @flow
import type { Node } from "react";

export type Value = any;

export type Rule = {
  field: string,
  is?: Value[],
  isNot?: Value[]
};

export type OnFieldChange = (id: string, value: any) => void;

export type ValidatorId =
  | "lengthIsGreaterThan"
  | "lengthIsLessThan"
  | "matchesRegEx"
  | "fallsWithinNumericalRange";

export type ValidationConfig = any;

export type ValidationRules = {
  [key: ValidatorId]: ValidationConfig
};

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
) => Options | null;

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
  disabled?: boolean,
  disabledWhen?: Rule[],
  visibleWhen?: Rule[],
  requiredWhen?: Rule[],
  validWhen?: ValidationRules,
  isValid?: boolean,
  errorMessages?: string,
  omitWhenHidden?: boolean,
  omitWhenValueIs?: Value[],
  useChangesAsValues?: boolean,
  valueDelimiter?: string,
  addedSuffix?: string,
  removedSuffix?: string,
  options?: Options,
  misc?: {
    [string]: any
  },
  trimValue?: boolean
};

export type Field = FieldDef & {
  fields: FieldDef[],
  onFieldChange: OnFieldChange,
  registerField?: FieldDef => void
};

export type FieldRenderer = (FieldDef, OnFieldChange) => any;

export type FormValue = {
  [string]: Value
};

export type OnFormChange = (FormValue, boolean) => void;

export type FormComponentProps = {
  defaultFields?: FieldDef[],
  value?: FormValue,
  onChange?: OnFormChange,
  renderer?: FieldRenderer,
  optionsHandler?: OptionsHandler,
  children?: Node,
  parentContext?: FormContextData
};

export type FormComponentState = {
  fields: FieldDef[],
  value: FormValue,
  isValid: boolean,
  defaultFields: []
};

export type EvaluateRule = (rule?: Rule, targetValue: Value) => boolean;

export type FieldsById = {
  [string]: FieldDef
};

export type EvaluateAllRules = (
  rules: Rule[],
  fieldsById: FieldsById,
  defaultResult: boolean
) => boolean;

export type ProcessFields = (FieldDef[]) => FieldDef[];
export type ProcessOptions = (
  FieldDef[],
  OptionsHandler,
  ?FormContextData
) => FieldDef[];

export type ValidationResult = {
  isValid: boolean,
  errorMessages: string
};

export type ValidateField = FieldDef => FieldDef;

export type ValidateAllFields = (FieldDef[]) => FieldDef[];

export type CreateFieldDef = ($Shape<FieldDef>) => FieldDef;

export type MapFieldsById = (FieldDef[]) => FieldsById;

export type RegisterField = (FieldDef, FieldDef[], FormValue) => FieldDef[];
export type RegisterFields = (FieldDef[], FormValue) => FieldDef[];

export type UpdateFieldValue = (string, Value, FieldDef[]) => FieldDef[];

export type SplitDelimitedValue = (Value, ?string) => string[] | string;
export type JoinDelimitedValue = (Value, ?string) => string | Value[];
export type GetMissingItems<T> = (Array<T>, Array<T>) => Array<T>;
export type DetermineChangedValues = FieldDef => Array<{
  name: string,
  value: Value
}>;

export type GetNextStateFromProps = (
  FieldDef[],
  ?OptionsHandler,
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
  registerField: any,
  renderer: FieldRenderer,
  onFieldChange: OnFieldChange,
  parentContext?: FormContextData
};
