//Entities Module callback
//Name of module, application object, Backbone, Backbone.Marionette, jQuery, Underscore
ContactManager.module('Entities', function (Entities, ContactManager, Backbone, Marionette, $, _) {
    //Attaching the model and collection to the module so they are publicly accessible

    Entities.Contact = Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage('contacts-list'),
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

    var initializeContacts = function () {
        contacts = new Entities.ContactCollection([
            {
                id: 1,
                firstName: 'Alice',
                lastName: 'Arten',
                phoneNumber: '555-0184'
            },
            {
                id: 2,
                firstName: 'Bob',
                lastName: 'Brigham',
                phoneNumber: '555-0163'
            },
            {
                id: 3,
                firstName: 'Charlie',
                lastName: 'Campbell',
                phoneNumber: '555-0129'
            },
        ]);

        contacts.forEach(function (contact) {
            contact.save();
        });

        return contacts;
    };

    var API = {
        //Call this function use only requests
        getContactEntities: function () {
            var contacts = new Entities.ContactCollection();
            contacts.fetch();

            if (contacts.length === 0) {
                return initializeContacts();
            }

            return contacts;
        },

        getContactEntity: function (contactId) {
            var contact = new Entities.Contact({ id: contactId });
            contact.fetch();
            return contact;
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