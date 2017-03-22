ContactManager.module('ContactsApp.Edit', function (Edit, ContactManager, Backbone, Marionette, $, _) {

    Edit.Controller = {
        editContact: function (id) {
            var loadingView = new ContactManager.Common.Views.Loading({
                title: 'Artificial Loading Delay',
                message: 'Data loading is delayed to demonstrate using a loading view'
            });

            ContactManager.regions.main.show(loadingView);

            var fetchingContact = ContactManager.request('contact:entity', id);
            $.when(fetchingContact).done(function (contact) {
                var view;
                if (contact !== undefined) {
                    view = new Edit.Contact({
                        model: contact
                    });

                    //Data from the syphon plugin gets saved in our contact
                    view.on('form:submit', function (data) {
                        contact.save(data);
                        ContactManager.trigger('contact:show', contact.get('id')); //Go back to the show view after the contact is saved
                    });

                } else {
                    view = new ContactManager.ContactsApp.Show.MissingContact();
                }

                ContactManager.regions.main.show(view);
            });
        },
    };
});