//Entities Module callback
//Name of module, application object, Backbone, Backbone.Marionette, jQuery, Underscore
ContactManager.module('Entities', function (Entities, ContactManager, Backbone, Marionette, $, _) {
    //Attaching the model and collection to the module so they are publicly accessible

    Entities.Contact = Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage('contacts-list'),

        defaults: {
            firstName: '',
            lastName: '',
            phoneNumber: ''
        },

        //Validation that backbone will execute when a model is saved
        validate: function (attrs, options) {
            var errors = {};

            //Validate firstName
            if (!attrs.firstName) {
                errors.firstName = "Can't be blank";
            }

            //Validate lastName
            if (!attrs.lastName) {
                errors.lastName = "Can't be blank";
            } else if (attrs.lastName.length < 2) {
                errors.lastName = "Is too short";
            }

            //Check if there are errors
            if (! _.isEmpty(errors)) {
                return errors;
            }
        }
    });

    //Entities.configureStorage("ContactManager.Entities.Contact");

    Entities.ContactCollection = Backbone.Collection.extend({
        model: Entities.Contact,

        localStorage: new Backbone.LocalStorage('contacts-list'),

        //Sort on first name and last name
        comparator: function (contact) { //Model of the collection gets past in
            return contact.get('firstName') + ' ' + contact.get('lastName');
        }
    });

    var contacts;

    var API = {
        //Call this function use only requests
        //A deffered object's promise is basically saying 'I promise I'll do something, and I'll update you as things progress
        getContactEntities: function () {
            var contacts = new Entities.ContactCollection();
            var defer = $.Deferred();

            contacts.fetch({
                success: function (data) {
                    defer.resolve(data);
                },
            });

            var promise = defer.promise();

            return promise;
        },

        //A deffered object's promise is basically saying 'I promise I'll do something, and I'll update you as things progress
        getContactEntity: function (contactId) {
            var contact = new Entities.Contact({ id: contactId });
            var defer = $.Deferred();

            setTimeout(function () {
                contact.fetch({
                    success: function (data) {
                        defer.resolve(data);
                    },
                    error: function (data) {
                        defer.resolve(undefined);
                    }
                });
            }, 2000);
            return defer.promise();
        }
    };

    //Request handler to get the contacts using the 'request-response' system that is availabe for the whole application
    ContactManager.reqres.setHandler("contact:entities", function () {
        return API.getContactEntities();
    });

    //Request handler to get a single contact from the localstorage
    ContactManager.reqres.setHandler("contact:entity", function (id) {
        return API.getContactEntity(id);
    });
});