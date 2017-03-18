ContactManager.module('ContactsApp.Show', function (Show, ContactManager, Backbone, Marionette, $, _) {

    //Show controller that manages our show view for a contact
    Show.Controller = {
        showContact: function (id) {
            var contacts = ContactManager.request('contact:entities');
            var model = contacts.get(id);
            var contactView;

            //Check if the contact exists
            if (model !== undefined) {
                contactView = new Show.Contact({
                    model: model
                });
            } else {
                contactView = new Show.MissingContact();
            }

            ContactManager.regions.main.show(contactView);
        },
    };
});