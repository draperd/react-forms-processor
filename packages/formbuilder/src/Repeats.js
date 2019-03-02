// @flow
import React, { Component, type Node } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import uniqueId from "lodash/uniqueId";
import get from "lodash/get";
import Button from "@atlaskit/button";
import { Form, FormContext } from "react-forms-processor";
import type { FieldDef, OnFormChange } from "react-forms-processor";
import { Expander } from "react-forms-processor-atlaskit";
import { Field as AkField } from "@atlaskit/form";

type Item = {
  id: string,
  data: Object
};

type Props = {
  label?: string,
  idAttribute?: string,
  addButtonLabel?: string,
  unidentifiedLabel?: string,
  noItemsMessage?: string,
  defaultValue: any,
  fields: FieldDef[],
  onChange?: any => void
};

type State = {
  value: Object[],
  items: Item[]
};

type CreateFormChangeHandler = (index: number) => OnFormChange;

const createFormForItem = (
  item: Object,
  targetIndex: number,
  fieldsForForm: FieldDef[],
  formChangeHandler: OnFormChange
): Node => {
  const mappedFields = fieldsForForm.map(field => ({
    ...field,
    id: `${field.id}_${targetIndex}_FIELDS`
  }));
  return (
    <FormContext.Consumer>
      {context => {
        const { renderer, optionsHandler, validationHandler } = context;
        return (
          <Form
            parentContext={context}
            key={`FIELD_${targetIndex}`}
            defaultFields={mappedFields}
            renderer={renderer}
            value={item}
            optionsHandler={optionsHandler}
            validationHandler={validationHandler}
            onChange={formChangeHandler}
          />
        );
      }}
    </FormContext.Consumer>
  );
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey"
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "white",

  // styles we need to apply on draggables
  ...draggableStyle
});

export default class Repeats extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { fields, defaultValue = [], onChange } = props;

    // Map the supplied array to an Item[] in order to give each piece of data an id for drag-and-drop
    const items: Item[] = defaultValue.map(data => ({ id: uniqueId(), data }));
    this.state = {
      value: defaultValue,
      items
    };
  }

  addItem() {
    let { items } = this.state;
    items = [...items, { id: uniqueId(), data: {} }];
    // this.updateItemState(items);
    this.setState({
      items
    });
  }

  removeItem(id: string) {
    let { items } = this.state;
    items = items.filter(item => item.id !== id);
    this.updateItemState(items);
  }

  createFormChangeHandler(index: number): OnFormChange {
    return (value, isValid) => {
      const { items } = this.state;
      items[index].data = value;
      this.updateItemState(items);
    };
  }

  updateItemState(items: Item[]) {
    this.setState(
      {
        items
      },
      () => {
        const { onChange } = this.props;
        const { items } = this.state;
        const value = items.map(item => item.data);
        onChange && onChange(value);
      }
    );
  }

  onDragEnd(result: any) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.updateItemState(items);
  }

  getForms() {
    const { items } = this.state;
    const {
      fields,
      idAttribute = "id",
      label = "Item",
      onChange,
      unidentifiedLabel = "Unidentified item"
    } = this.props;

    return (
      <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {items.map((item, index) => {
                const formChangeHandler = this.createFormChangeHandler(index);
                const form = createFormForItem(
                  item.data,
                  index,
                  fields,
                  formChangeHandler
                );
                const label = get(item.data, idAttribute, unidentifiedLabel);
                return (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <Expander
                          key={`exp_${item.id}`}
                          label={label}
                          remove={() => {
                            this.removeItem(item.id);
                          }}
                        >
                          {form}
                        </Expander>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  render() {
    const {
      label = "Item",
      // description,
      addButtonLabel = "Add item",
      noItemsMessage = "No items yet"
    } = this.props;
    const { items } = this.state;
    const noItems = <span className="no-items">{noItemsMessage}</span>;

    return (
      <div>
        <AkField label={label} name="formBuilder">
          {() => <div>{items.length > 0 ? this.getForms() : noItems}</div>}
        </AkField>
        <Button onClick={() => this.addItem()}>{addButtonLabel}</Button>
      </div>
    );
  }
}
