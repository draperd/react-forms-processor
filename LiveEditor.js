"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactFormsProcessor = require("react-forms-processor");

var _reactFormsProcessorAtlaskit = require("react-forms-processor-atlaskit");

var _definitions = require("./definitions");

var _brace = require("brace");

var _brace2 = _interopRequireDefault(_brace);

var _reactAce = require("react-ace");

var _reactAce2 = _interopRequireDefault(_reactAce);

require("brace/mode/json");

require("brace/theme/monokai");

var _reactMarkdown = require("react-markdown");

var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

require("./LiveEditor.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var editorOptions = {
  lineNumbers: true,
  mode: "json"
};

var LiveEditor = function (_Component) {
  _inherits(LiveEditor, _Component);

  function LiveEditor(props) {
    _classCallCheck(this, LiveEditor);

    var _this = _possibleConstructorReturn(this, (LiveEditor.__proto__ || Object.getPrototypeOf(LiveEditor)).call(this, props));

    var defaultDefinition = props.defaultDefinition;

    _this.state = {
      definition: defaultDefinition,
      fields: JSON.parse(defaultDefinition)
    };
    return _this;
  }

  _createClass(LiveEditor, [{
    key: "updateDefinition",
    value: function updateDefinition(definition) {
      this.setState({
        definition: definition
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          definition = _state.definition,
          value = _state.value;
      var renderer = this.props.renderer;
      var _props = this.props,
          _props$editorTitle = _props.editorTitle,
          editorTitle = _props$editorTitle === undefined ? "Editor" : _props$editorTitle,
          _props$editorDescript = _props.editorDescription,
          editorDescription = _props$editorDescript === undefined ? "Try experimenting with the form definition in the editor and see how it updates the form rendered in the preview." : _props$editorDescript,
          _props$previewTitle = _props.previewTitle,
          previewTitle = _props$previewTitle === undefined ? "Preview" : _props$previewTitle,
          _props$previewDescrip = _props.previewDescription,
          previewDescription = _props$previewDescrip === undefined ? "The form defintion will be rendered here - if the definition is invalid then the form will not be displayed" : _props$previewDescrip,
          _props$formValueTitle = _props.formValueTitle,
          formValueTitle = _props$formValueTitle === undefined ? "Value" : _props$formValueTitle,
          _props$formValueDescr = _props.formValueDescription,
          formValueDescription = _props$formValueDescr === undefined ? "This shows the current value of the form in the preview" : _props$formValueDescr,
          optionsHandler = _props.optionsHandler;


      var fieldsToRender = void 0,
          prettyDefinition = void 0;
      try {
        fieldsToRender = JSON.parse(definition);
        prettyDefinition = JSON.stringify(fieldsToRender, null, "\t");
      } catch (e) {
        prettyDefinition = definition;
      }

      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(
          "div",
          { className: "live-editor" },
          _react2.default.createElement(
            "div",
            { className: "editor" },
            _react2.default.createElement(
              "h2",
              null,
              editorTitle
            ),
            _react2.default.createElement(_reactMarkdown2.default, { source: editorDescription }),
            _react2.default.createElement(_reactAce2.default, {
              width: "800px",
              value: prettyDefinition,
              mode: "json",
              theme: "monokai",
              onChange: function onChange(definition) {
                return _this2.updateDefinition(definition);
              },
              name: "EDITOR",
              editorProps: { $blockScrolling: true },
              wrapEnabled: true
            })
          ),
          _react2.default.createElement(
            "div",
            { className: "preview" },
            _react2.default.createElement(
              "h2",
              null,
              previewTitle
            ),
            _react2.default.createElement(
              "p",
              null,
              previewDescription
            ),
            _react2.default.createElement(
              _reactFormsProcessor.Form,
              {
                renderer: renderer,
                onChange: function onChange(value) {
                  _this2.setState({ value: value });
                }
                // value={value}
                , defaultFields: fieldsToRender,
                optionsHandler: optionsHandler
              },
              _react2.default.createElement(_reactFormsProcessorAtlaskit.FormButton, { label: "Preview" })
            )
          ),
          _react2.default.createElement(
            "div",
            { className: "value" },
            _react2.default.createElement(
              "h2",
              null,
              formValueTitle
            ),
            _react2.default.createElement(
              "p",
              null,
              formValueDescription
            ),
            _react2.default.createElement(
              "pre",
              null,
              JSON.stringify(value, null, "\t")
            )
          )
        )
      );
    }
  }]);

  return LiveEditor;
}(_react.Component);

exports.default = LiveEditor;