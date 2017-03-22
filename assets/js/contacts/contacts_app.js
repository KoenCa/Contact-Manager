ContactManager.module('ContactsApp', function (ContactsApp, ContactManager, Backbone, Marionette, $, _) {
    //Defining the router in ContactsApp module because it will handle the routes for all the sub-modules.
    ContactsApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
            // URL fragments : callback method
            'contacts': 'listContacts',
            'contacts/:id': 'showContact',
            'contacts/:id/edit': 'editContact'
        }
    });

    //External
    var API = {
        listContacts: function () {
            ContactsApp.List.Controller.listContacts();
        },
        
        showContact: function (id) {
            ContactsApp.Show.Controller.showContact(id);
        },

        editContact: function (id) {
            ContactsApp.Edit.Controller.editContact(id);
        }
    };

    //Internal
    ContactManager.on('contacts:list', function () {
        //Setting the url to contain #contacts, this doesn't load the list of contacts
        //Its only purpose is to change the URL so the user can for example bookmark it
        ContactManager.navigate('contacts');
        API.listContacts(); //This loads the view with the list of contacts
    });

    ContactManager.on('contact:show', function(id) {
        //Setting the url to contain #contacts/:id
        //Its only purpose is to change the URL so the user can for example bookmark it
        ContactManager.navigate('contacts/' + id);
        API.showContact(id); //This loads the view
    });

    ContactManager.on('contact:edit', function(id) {
        //Setting the url to contain #contacts/:id/edit
        //Its only purpose is to change the URL so the user can for example bookmark it
        ContactManager.navigate('contacts/' + id + '/edit');
        API.editContact(id); //This loads the view
    });

    ContactsApp.on('start', function () {
        new ContactsApp.Router({
            controller: API
        });
    });
});