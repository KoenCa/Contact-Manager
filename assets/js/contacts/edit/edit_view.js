ContactManager.module('ContactsApp.Edit', function (Edit, ContactManager, Backbone, Marionette, $, _) {
    Edit.Contact = Marionette.ItemView.extend({
        template: '#contact-form',

        initialize: function () {
            this.title = 'Edit ' + this.model.get('firstName') + ' ' + this.model.get('lastName');
        },

        events: {
            'click button.js-submit': 'submitClicked'
        },

        submitClicked: function (e) {
            e.preventDefault();
            var data = Backbone.Syphon.serialize(this); //Plugin that sets the view in JSON with input names as keys
            this.trigger('form:submit', data);
        },

        //We only want the title to show when it the view isn't a modal
        onRender: function () {
            if (!this.options.asModal) {
                var $title = $('<h1>', { text: this.title });
                this.$el.prepend($title);
            }
        },

        onShow: function () {
            //Check if it is for the modal
            if (this.options.asModal) {
                this.$el.dialog({
                    modal: true,
                    title: this.title
                });
            }
        },

        //Marionette executes this function when in our controller 'form:data:invalid' is triggered
        onFormDataInvalid: function (errors) {
            var $view = this.$el;

            //Function to clear errors because page doesn't refresh so error would otherwise stack up
            var clearFormErrors = function () {
                var $form = $view.find('form');
                $form.find('.alert.alert-danger').each(function () {
                    $(this).remove();
                });
            };

            //Display an error by the correct input field so user knows what he did wrong
            var markErrors = function (value, key) {
                var $controlGroup = $view.find('#contact-' + key).parent(); //Get the form-group for label/input
                var $errorEl = $('<div>', { class: 'alert alert-danger', text: value }); //Create DOM element for the error message
                $controlGroup.append($errorEl); //Add error DOM to the form-group
            };

            clearFormErrors(); //Clear our form errors before adding new ones

            _.each(errors, markErrors); //For every error add an error message on the form
        },
    });
});