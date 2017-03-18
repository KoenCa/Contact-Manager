ContactManager.module('ContactsApp', function (ContactsApp, ContactManager, Backbone, Marionette, $, _) {
    //Defining the router in ContactsApp module because it will handle the routes for all the sub-modules.
    ContactsApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
            // URL fragments : callback method
            'contacts': 'listContacts'
        }
    });

    var API = {
        listContacts: function () {
            ContactsApp.List.Controller.listContacts();
        }
    };

    ContactManager.on('contacts:list', function () {
        //Setting the url to contain #contacts, this doesn't load the list of contacts
        //Its only purpose is to change the URL so the user can for example bookmark it
        ContactManager.navigate('contacts');
        API.listContacts();
    });

    ContactsApp.on('start', function () {
        new ContactsApp.Router({
            controller: API
        });
    });
});