//List submodule callback
//Name of submodule, application object, Backbone, Backbone.Marionette, jQuery, Underscore
ContactManager.module('ContactsApp.List', function (List, ContactManager, Backbone, Marionette, $, _) {

    //Controller that handles the data and rendering of our views
    List.Controller = {
        //Function that handles our contacts list view
        listContacts: function () {
            var contactsListView; //Initialze the variable for our listview, otherwise we get an error

            //Artificial loading view to show the user that something is happening
            var loadingView = new ContactManager.Common.Views.Loading();
            ContactManager.regions.main.show(loadingView);

            //Request the data from Entities module in contact.js
            var fetchingContacts = ContactManager.request('contact:entities');

            var contactsListLayout = new List.Layout();
            var contactsListPanel = new List.Panel();

            //Define a new CompositeView from list_view.js
            $.when(fetchingContacts).done(function (contacts) {
                contactsListView = new List.Contacts({
                    collection: contacts
                });
            });

            contactsListLayout.on('show', function () {
                contactsListLayout.panelRegion.show(contactsListPanel);
                contactsListLayout.contactsRegion.show(contactsListView);
            });

            //Function to remove a contact from the collection
            //This can only be triggered from the childView of our CompositeView
            contactsListView.on('childview:contact:delete', function (childView, model) {
                model.destroy();
            });

            contactsListView.on('childview:contact:show', function (childView, model) {
                ContactManager.trigger('contact:show', model.get('id')); //Trigger an event in our router
            });

            contactsListView.on('childview:contact:edit', function (childView, model) {
                var view = new ContactManager.ContactsApp.Edit.Contact({
                    model: model,
                    asModal: true
                });

                view.on('form:submit', function(data) {
                    if (model.save(data)) {
                        childView.render(); //re-render the table
                        ContactManager.regions.dialog.empty();
                        childView.flash('success');
                    } else {
                        view.triggerMethod('form:data:invalid', model.validationError);
                    }
                });

                ContactManager.regions.dialog.show(view);
            });

            contactsListView.on('childview:contact:print:model', function (childview, model) {
                console.log('Highlighting toggled on model: ' + model);
            });

            //Render our CompositeView in our main LayoutView defined in app.js
            ContactManager.regions.main.show(contactsListLayout);
        }
    };
});