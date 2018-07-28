// @flow
import React, { Component, type Node } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import uniqueId from "lodash/uniqueId";
import get from "lodash/get";
import Button from "@atlaskit/button";
import { Form, FormContext } from "react-forms-processor";
import Expander from "../Expander";
import type { FieldDef, OnFormChange } from "../../../../../types";

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
  return (
    <FormContext.Consumer>
      {context => {
        const { renderer, optionsHandler } = context;
        return (
          <Form
            parentContext={context}
            key={`FIELD_${targetIndex}`}
            defaultFields={fieldsForForm}
            renderer={renderer}
            value={item}
            optionsHandler={optionsHandler}
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
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 400
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

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
    const { items } = this.state;
    this.setState({
      items: [...items, { id: uniqueId(), data: {} }]
    });
  }

  removeItem(id: string) {
    const { items } = this.state;
    this.setState({
      items: items.filter(item => item.id !== id)
    });
  }

  createFormChangeHandler(index: number): OnFormChange {
    return (value, isValid) => {
      const { items } = this.state;
      items[index].data = value;
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
    };
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
                  item,
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
      addButtonLabel = "Add item",
      noItemsMessage = "No items yet"
    } = this.props;
    const { items } = this.state;
    const noItems = <span className="no-items">{noItemsMessage}</span>;

    return (
      <div>
        <div>{items.length > 0 ? this.getForms() : noItems}</div>
        <Button onClick={() => this.addItem()}>{addButtonLabel}</Button>
      </div>
    );
  }
}
