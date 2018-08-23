"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _tabs = require("@atlaskit/tabs");

var _tabs2 = _interopRequireDefault(_tabs);

var _reactFormsProcessor = require("react-forms-processor");

var _reactFormsProcessorFormbuilder = require("react-forms-processor-formbuilder");

var _reactFormsProcessorAtlaskit = require("react-forms-processor-atlaskit");

var _reactFormsProcessorMaterialUi = require("react-forms-processor-material-ui");

var _LiveEditor = require("./LiveEditor");

var _LiveEditor2 = _interopRequireDefault(_LiveEditor);

var _Tutorial = require("./tutorial/Tutorial");

var _Tutorial2 = _interopRequireDefault(_Tutorial);

require("./App.css");

var _definitions = require("./definitions");

var _SwapiOptionsHandler = require("./SwapiOptionsHandler");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var teamFormOptionsHandler = function teamFormOptionsHandler(fieldId, fields, parentContext) {
  switch (fieldId) {
    case "ISSUE_SOURCE":
      var options = [{
        items: [{
          label: "Board 1",
          value: "BOARD1"
        }, {
          label: "Project A",
          value: "PROJ_A"
        }]
      }];
      return options;
    case "MEMBERS":
      return (0, _SwapiOptionsHandler.getOptions)();
    default:
      {
        return null;
      }
  }
};

var repeatingFields = [{
  id: "ID",
  name: "id",
  label: "An id",
  type: "text"
}];

var getTabs = function getTabs(renderer) {
  var tabs = [{
    label: "Tab1",
    content: _react2.default.createElement(
      "div",
      null,
      _react2.default.createElement(_reactFormsProcessor.FormFragment, { defaultFields: _definitions.frag1 })
    )
  }, {
    label: "Tab2",
    content: _react2.default.createElement(_reactFormsProcessor.FormFragment, { defaultFields: _definitions.frag2 })
  }];

  return [{
    label: "Tutorial",
    content: _react2.default.createElement(_Tutorial2.default, { renderer: renderer })
  }, {
    label: "Live editor",
    content: _react2.default.createElement(_LiveEditor2.default, {
      defaultDefinition: JSON.stringify(_definitions.form1),
      renderer: renderer
    })
  }, {
    label: "Single Definition",
    content:
    // Keep this as a span to avoid content between tabs "bleeding" - there seems to be some strange behaviour with the tab component
    // If all tabs have the same root element then form context is shared
    _react2.default.createElement(
      "span",
      null,
      _react2.default.createElement(
        "p",
        null,
        "This is an example of the Form component given a single form definition"
      ),
      _react2.default.createElement(
        _reactFormsProcessor.Form,
        {
          defaultFields: _definitions.createTeamForm,
          optionsHandler: teamFormOptionsHandler,
          renderer: renderer
        },
        _react2.default.createElement(_reactFormsProcessorAtlaskit.FormButton, {
          onClick: function onClick(value) {
            return console.log("Definition button value", value);
          }
        })
      )
    )
  }, {
    label: "Field components",
    content: _react2.default.createElement(
      "div",
      null,
      _react2.default.createElement(
        "p",
        null,
        "This is an example of a Form component with Field component children. These will always be displayed as Atlaskit fields because those are the components that have been specifically used."
      ),
      _react2.default.createElement(
        _reactFormsProcessor.Form,
        { renderer: renderer },
        _react2.default.createElement(_reactFormsProcessorAtlaskit.FieldText, {
          id: "NAME",
          name: "name",
          placeholder: "Who are you?",
          value: "",
          label: "Name",
          description: "Tell me a bit about yourself",
          required: true,
          visibleWhen: [{ field: "SHOW", is: ["YES"] }]
        }),
        _react2.default.createElement(_reactFormsProcessorAtlaskit.FieldText, {
          id: "SHOW",
          name: "show",
          placeholder: "Show the name field?",
          value: "YES",
          label: "Show"
        }),
        _react2.default.createElement(_reactFormsProcessorAtlaskit.FormButton, {
          label: "Save",
          onClick: function onClick(value) {
            return console.log("Inline button value", value);
          }
        })
      )
    )
  }, {
    label: "Multiple definitions as fragments",
    content:
    // Needs to be different element to prevent tab bleed (in this case to prevent the form being disabled because of bleed from tab 1)
    _react2.default.createElement(
      "section",
      null,
      _react2.default.createElement(
        "p",
        null,
        "This is an example of a Form component with FormFragment components (each with their own definition) nested within a Tab container layout component."
      ),
      _react2.default.createElement(
        _reactFormsProcessor.Form,
        { renderer: renderer },
        _react2.default.createElement(_tabs2.default, { tabs: tabs }),
        _react2.default.createElement(_reactFormsProcessorAtlaskit.FormButton, {
          label: "Frags",
          onClick: function onClick(value) {
            return console.log("Multi fragment form button value", value);
          }
        })
      )
    )
  }, {
    label: "Form builder",
    content: _react2.default.createElement(
      "div",
      { style: { width: "100%" } },
      _react2.default.createElement(
        "p",
        null,
        "This is an example the FormBuilder component that can be used to dynamically build forms"
      ),
      _react2.default.createElement(_reactFormsProcessorFormbuilder.FormBuilder, { renderer: renderer })
    )
  }];
};

var App = function (_Component) {
  _inherits(App, _Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      renderer: _reactFormsProcessorAtlaskit.renderer,
      selectedTab: null
    };
    return _this;
  }

  _createClass(App, [{
    key: "setRenderer",
    value: function setRenderer(value) {
      var renderer = _reactFormsProcessorAtlaskit.renderer;
      if (value.renderer) {
        switch (value.renderer) {
          case "NATIVE":
            renderer = undefined;
            break;
          case "ATLASKIT":
            renderer = _reactFormsProcessorAtlaskit.renderer;
            break;

          case "MATERIALUI":
            renderer = _reactFormsProcessorMaterialUi.renderer;
            break;
        }
      }
      this.setState({
        renderer: renderer
      });
    }
  }, {
    key: "handleUpdate",
    value: function handleUpdate(selectedTab) {
      this.setState({ selectedTab: selectedTab.label });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          renderer = _state.renderer,
          selectedTab = _state.selectedTab;

      var tabs = getTabs(renderer);
      return _react2.default.createElement(
        "article",
        null,
        _react2.default.createElement(
          "section",
          { className: "header" },
          _react2.default.createElement(
            "div",
            null,
            _react2.default.createElement(
              "h1",
              null,
              "React Forms Processor Demo"
            ),
            _react2.default.createElement(
              "a",
              {
                href: "https://github.com/draperd/react-forms-processor",
                target: "_blank"
              },
              "GitHub Project Link"
            )
          ),
          _react2.default.createElement(_reactFormsProcessor.Form, {
            defaultFields: _definitions.rendererChoice,
            renderer: renderer,
            onChange: function onChange(value, isValid) {
              return _this2.setRenderer(value);
            }
          })
        ),
        _react2.default.createElement(_tabs2.default, {
          tabs: tabs,
          onSelect: function onSelect(selectedTab) {
            return _this2.handleUpdate(selectedTab);
          },
          isSelectedTest: function isSelectedTest(selected, tab) {
            return selectedTab === tab.label;
          }
        })
      );
    }
  }]);

  return App;
}(_react.Component);

exports.default = App;