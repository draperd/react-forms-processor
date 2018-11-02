// @flow
import type {
  Field,
  FieldDef,
  FormContextData,
  FormValue,
  OnFormChange,
  FieldRenderer,
  OptionsHandler,
  ValidationHandler
} from "../types";

export type FormComponentProps = {
  defaultFields?: FieldDef[],
  value?: FormValue,
  onChange?: OnFormChange,
  renderer?: FieldRenderer,
  optionsHandler?: OptionsHandler,
  validationHandler?: ValidationHandler,
  children?: Node,
  parentContext?: FormContextData,
  showValidationBeforeTouched?: boolean,
  conditionalUpdate?: boolean,
  disabled?: boolean
};

export type FormComponentState = {
  fields: FieldDef[],
  value: FormValue,
  valueByFieldId: FormValue,
  isValid: boolean,
  defaultFields: [],
  disabled: boolean,
  showValidationBeforeTouched: boolean
};

export type FormFragmentComponentProps = {
  defaultFields: FieldDef[]
};

export type FormFragmentComponentWithContextProps = FormContextData &
  FormFragmentComponentProps;

export type FieldWrapperComponentProps = Field & {
  children: Node
};

export type FieldWrapperComponentWithContextProps = FormContextData &
  FieldWrapperComponentProps;
