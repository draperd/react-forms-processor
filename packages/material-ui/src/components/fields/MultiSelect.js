// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "../../../../../types";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing.unit / 4
  }
});

class MaterialUiMultiSelect extends React.Component<Field> {
  render() {
    // $FlowFixMe - HOC adds this class
    const classes = this.props.classes;
    const {
      disabled,
      id,
      isValid,
      name,
      options = [],
      placeholder,
      required,
      value = [],
      label,
      onFieldChange
    } = this.props;

    const items = options.reduce((itemsSoFar, option) => {
      return itemsSoFar.concat(
        option.items.map(item => {
          if (typeof item === "string") {
            return <MenuItem value={item}>{item}</MenuItem>;
          } else {
            return (
              <MenuItem value={item.value}>{item.label || item.value}</MenuItem>
            );
          }
        })
      );
    }, []);

    return (
      <div key={id}>
        <FormControl
          key={id}
          disabled={disabled}
          className={classes.formControl}
        >
          <InputLabel htmlFor={id}>{label}</InputLabel>
          <Select
            multiple
            value={value}
            onChange={evt => {
              onFieldChange(id, evt.target.value);
            }}
            input={<Input name={name} id={id} />}
            renderValue={selected => (
              <div className={classes.chips}>
                {selected.map(value => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
          >
            {items}
          </Select>
        </FormControl>
      </div>
    );
  }
}

const StyledMaterialUiMultiSelect = withStyles(styles)(MaterialUiMultiSelect);

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <StyledMaterialUiMultiSelect />
  </FieldWrapper>
);
