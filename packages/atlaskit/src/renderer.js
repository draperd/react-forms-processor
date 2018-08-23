// @flow
import React from "react";
import FieldText from "./components/fields/FieldText";
import FieldTextArea from "./components/fields/FieldTextArea";
import Checkbox from "./components/fields/Checkbox";
import RadioGroup from "./components/fields/RadioGroup";
import Select from "./components/fields/Select";
import MultiSelect from "./components/fields/MultiSelect";
import RepeatingFormField from "./components/fields/Repeats";
import type { FieldRenderer, FieldDef, OnFieldChange } from "../../../types";

const renderer: FieldRenderer = (field: FieldDef, onChange: OnFieldChange) => {
  const { defaultValue = [], id, type, label, misc = {} } = field;
  switch (type) {
    case "text":
      return <FieldText key={id} {...field} />;

    case "textarea":
      return <FieldTextArea key={id} {...field} />;

    case "checkbox":
      return <Checkbox key={id} {...field} />;

    case "select":
      return <Select key={id} {...field} />;

    case "multiselect":
      return <MultiSelect key={id} {...field} />;

    case "radiogroup":
      return <RadioGroup key={id} {...field} />;

    case "repeating":
      const fields: FieldDef[] = misc.fields || [];
      const addButtonLabel: string = misc.addButtonLabel;
      const unidentifiedLabel: string = misc.unidentifiedLabel;
      const noItemsMessage: string = misc.noItemsMessage;
      const idAttribute: string = misc.idAttribute;
      return (
        <RepeatingFormField
          key={id}
          addButtonLabel={addButtonLabel}
          defaultValue={defaultValue}
          label={label}
          onChange={value => onChange(id, value)}
          fields={fields}
          unidentifiedLabel={unidentifiedLabel}
          noItemsMessage={noItemsMessage}
          idAttribute={idAttribute}
        />
      );

    default:
      return <div>No mapped field</div>;
  }
};

export default renderer;
