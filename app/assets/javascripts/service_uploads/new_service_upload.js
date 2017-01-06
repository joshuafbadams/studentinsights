(function() {
  window.shared || (window.shared = {});
  var dom = window.shared.ReactHelpers.dom;
  var createEl = window.shared.ReactHelpers.createEl;
  var merge = window.shared.ReactHelpers.merge;
  var Datepicker = window.shared.Datepicker;
  var ServiceTypeDropdown = window.shared.ServiceTypeDropdown;

  var NewServiceUpload = window.shared.NewServiceUpload = React.createClass({

    propTypes: {
      // Actions
      onClickUploadButton: React.PropTypes.func.isRequired,
      onSelectStartDate: React.PropTypes.func.isRequired,
      onSelectEndDate: React.PropTypes.func.isRequired,
      onSelectFile: React.PropTypes.func.isRequired,
      onUserTypingServiceType: React.PropTypes.func.isRequired,
      onUserSelectServiceType: React.PropTypes.func.isRequired,

      // Form validation states
      lasidAuthorizationError: React.PropTypes.bool.isRequired,
      studentLasidsReceivedFromBackend: React.PropTypes.bool.isRequired,
      incorrectLasids: React.PropTypes.array.isRequired,
      missingLasidHeader: React.PropTypes.bool.isRequired,
      missingRequiredFields: React.PropTypes.bool.isRequired,
      formData: React.PropTypes.object.isRequired,
      serverSideErrors: React.PropTypes.array.isRequired,
      uploadingInProgress: React.PropTypes.bool.isRequired,
    },

    render: function () {
      return dom.div({
        style: {
          marginLeft: 80,
        }
      },
        dom.h1({}, 'Upload new services file'),
        dom.div({ style: { marginTop: 30 } }, 'Start Date'),
        this.renderDatepicker(this.props.onSelectStartDate),
        dom.div({ style: { marginTop: 20 } }, 'End Date'),
        this.renderDatepicker(this.props.onSelectEndDate),
        createEl(ServiceTypeDropdown, {
          onUserTypingServiceType: this.props.onUserTypingServiceType,
          onUserSelectServiceType: this.props.onUserSelectServiceType
        }),
        dom.input({
          type: 'file',
          id: 'fileUpload',
          onChange: this.props.onSelectFile,
          style: {
            display: 'none'
          }
        }),
        dom.label({
          style: {
            width: 300,
            minHeight: 180,
            padding: '50px 0',
            border: '1px dashed gray',
            marginTop: 30,
            textAlign: 'center',
            cursor: 'pointer'
          },
          htmlFor: 'fileUpload'
        },
          dom.span({
            className: 'btn',
            style: {
              fontSize: 16,
              width: 210,
              textAlign: 'center',
              margin: 'auto'
            }
          }, 'Select CSV to Upload'),
          dom.br({}),
          dom.br({}),
          dom.div({ style: { fontSize: 14, padding: '14px 28px' } },
            this.renderCSVValidationMessages()
          )
        ),
        dom.br({}),
        dom.br({}),
        dom.div({ style: { width: 300, textAlign: 'center' } },
          dom.button({
            className: 'btn',
            onClick: this.props.onClickUploadButton,
            disabled: this.props.missingRequiredFields,
            title: this.renderConfimationButtonHelptext(),
            style: {
              fontSize: 18,
              background: (this.props.missingRequiredFields) ? '#ccc' : undefined,
              textAlign: 'center'
            }
          }, this.uploadButtonText()),
          dom.br({}),
          this.renderServerSideErrors()
        )
      );
    },

    uploadButtonText: function () {
      if (this.props.uploadingInProgress) {
        return 'Uploading...';
      } else if (this.props.serverSideErrors.length > 0) {
        return 'Error Uploading';
      } else {
        return 'Confirm Upload';
      };
    },

    renderServerSideErrors: function () {
      if (!this.props.serverSideErrors.length === 0) return null;

      return dom.div({
          style: {
            fontSize: 14, padding: '28px 14px', color: 'red', textAlign: 'left'
          }
        },
        this.props.serverSideErrors.map(function (error) {
          return dom.div({ margin: 10 }, error);
        })
      );
    },

    renderConfimationButtonHelptext: function () {
      if (this.props.missingRequiredFields === false) return 'Ready to upload!';

      var formFieldsToNames = {
        'file_name': 'file name',
        'student_lasids': 'student LASIDs from the CSV',
        'date_started': 'start date',
        'service_type_id': 'service type',
      };

      var formFields = Object.keys(formFieldsToNames);

      var formData = this.props.formData;

      var missingFormFieldNames = [];

      formFields.map(function (formField) {
        if (formData[formField] === undefined) {
          missingFormFieldNames.push(formFieldsToNames[formField]);
        };
      });

      return 'Oooh, we are missing ' + missingFormFieldNames.join(' ');
    },

    renderCSVValidationMessages: function () {
      if (this.props.missingLasidHeader) {
        return dom.div({ style: { color: 'red' }}, 'The first column should be "LASID".');
      } else if (this.props.lasidAuthorizationError) {
        return dom.div({ style: { color: 'red' }}, 'Hm, looks like there was some kind of authorization error.');
      } else if (this.props.incorrectLasids.length > 0) {
        return dom.div({ style: { color: 'red', textAlign: 'left' }},
          'The following LASIDs do not match with any students in Insights:',
          dom.br({}),
          dom.ul({},
            this.props.incorrectLasids.map(function(lasid) {
              return dom.li({}, lasid)
            }.bind(this))
          )
        );
      } else if (this.props.studentLasidsReceivedFromBackend &&
                 this.props.incorrectLasids.length === 0) {
        return dom.div({ style: { color: 'blue' }}, 'All LASIDs match!');
      } else {
        return dom.div({}, "The first CSV column should be the LASID one.");
      };
    },

    renderDatepicker: function (onChangeFn) {
      return createEl(Datepicker, {
        styles: { input: {
          fontSize: 14,
          padding: 5,
          width: '50%'
        } },
        onChange: onChangeFn,
        datepickerOptions: {
          showOn: 'both',
          dateFormat: 'mm/dd/yy',
          minDate: undefined
        }
      });
    },

  });

})();

