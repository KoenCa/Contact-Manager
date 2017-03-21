ContactManager.module('ContactsApp.Show', function (Show, ContactManager, Backbone, Marionette, $, _) {

    //Show controller that manages our show view for a contact
    Show.Controller = {
        showContact: function (id) {
            var contact = ContactManager.request('contact:entity', id);
            var contactView;

            //Check if the contact exists
            if (contact !== undefined) {
                contactView = new Show.Contact({
                    model: contact
                });
            } else {
                contactView = new Show.MissingContact();
            }

            ContactManager.regions.main.show(contactView);
        },
    };
});