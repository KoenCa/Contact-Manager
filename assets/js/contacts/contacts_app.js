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

    ContactsApp.on('start', function () {
        new ContactsApp.Router({
            controller: API
        });
    });
});