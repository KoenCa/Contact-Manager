//List submodule callback
//Name of submodule, application object, Backbone, Backbone.Marionette, jQuery, Underscore
ContactManager.module('ContactsApp.List', function (List, ContactManager, Backbone, Marionette, $, _) {

    //Controller that handles the data and rendering of our views
    List.Controller = {
        //Function that handles our contacts list view
        listContacts: function () {

            //Artificial loading view to show the user that something is happening
            var loadingView = new ContactManager.Common.Views.Loading();
            ContactManager.regions.main.show(loadingView);

            //Request the data from Entities module in contact.js
            var fetchingContacts = ContactManager.request('contact:entities');

            var contactsListLayout = new List.Layout();
            var contactsListPanel = new List.Panel();

            $.when(fetchingContacts).done(function (contacts) {
                var contactsListView = new List.Contacts({
                    collection: contacts
                });

                contactsListLayout.on('show', function () {
                    contactsListLayout.panelRegion.show(contactsListPanel);
                    contactsListLayout.contactsRegion.show(contactsListView);
                });

                //Function to remove a contact from the collection
                //This can only be triggered from the childView of our CompositeView
                contactsListView.on('childview:contact:delete', function (childView, args) {
                    args.model.destroy();
                });

                contactsListView.on('childview:contact:show', function (childView, args) {
                    ContactManager.trigger('contact:show', args.model.get('id')); //Trigger an event in our router
                });

                contactsListView.on('childview:contact:edit', function (childView, args) {
                    var model = args.model;
                    var view = new ContactManager.ContactsApp.Edit.Contact({
                        model: model,
                        asModal: true
                    });

                    view.on('form:submit', function (data) {
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

                //When new contact button is clicked
                contactsListPanel.on('contact:new', function () {
                    var newContact = new ContactManager.Entities.Contact();

                    //Define a new contact view to be displayed as modal
                    var view = new ContactManager.ContactsApp.New.Contact({
                        model: newContact,
                        asModal: true
                    });

                    //When the modal is submitted
                    view.on('form:submit', function (data) {
                        //Calculate the new id of the contact
                        if (contacts.length > 0) {
                            var highestId = contacts.max(function (c) { return c.id; }).get('id');
                            data.id = highestId + 1;
                        } else {
                            data.id = 1;
                        }

                        //Save the contact or show errors if data is invalid
                        if (newContact.save(data)) {
                            contacts.add(newContact);
                            ContactManager.regions.dialog.empty(); //Hide the modal 
                            contactsListView.children.findByModel(newContact).flash('success'); //Shows which contact has been added
                        } else {
                            view.triggerMethod('form:data:invalid', newContact.validationError);
                        }
                    });

                    ContactManager.regions.dialog.show(view);
                });
            });

            //Load our contacts layout view in to the main region of our main layout view
            ContactManager.regions.main.show(contactsListLayout);
        }
    };
});