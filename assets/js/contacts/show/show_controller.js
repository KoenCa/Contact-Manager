ContactManager.module('ContactsApp.Show', function (Show, ContactManager, Backbone, Marionette, $, _) {

    //Show controller that manages our show view for a contact
    Show.Controller = {
        showContact: function (id) {
            var fetchingContact = ContactManager.request('contact:entity', id);

            //Wait for the promise to return the data.
            $.when(fetchingContact).done(function (contact) {
                var contactView;

                //Check if the contact exists
                if (contact !== undefined && contact !== null) {
                    contactView = new Show.Contact({
                        model: contact
                    });
                } else {
                    contactView = new Show.MissingContact();
                }

                ContactManager.regions.main.show(contactView);
            });
        },
    };
});