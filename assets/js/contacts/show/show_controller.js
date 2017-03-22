ContactManager.module('ContactsApp.Show', function (Show, ContactManager, Backbone, Marionette, $, _) {

    //Show controller that manages our show view for a contact
    Show.Controller = {
        showContact: function (id) {
            //Artificial loading view to show the user that something is happening
            var loadingView = new ContactManager.Common.Views.Loading({
                title: 'Artificial Loading Delay',
                message: 'Data loading is delayed to demonstrate using a loading view'
            });
            ContactManager.regions.main.show(loadingView);

            var fetchingContact = ContactManager.request('contact:entity', id);

            //Wait for the promise to return the data.
            $.when(fetchingContact).done(function (contact) {
                var contactView;

                //Check if the contact exists
                if (contact !== undefined && contact !== null) {
                    contactView = new Show.Contact({
                        model: contact
                    });

                    //Gets triggered in view
                    contactView.on('contact:edit', function(contact) {
                        ContactManager.trigger('contact:edit', contact.get('id')); //Trigger our router
                    });

                } else {
                    contactView = new Show.MissingContact();
                }

                ContactManager.regions.main.show(contactView);
            });
        },
    };
});