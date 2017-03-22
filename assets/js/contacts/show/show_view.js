ContactManager.module('ContactsApp.Show', function(Show, ContactManager, Backbone, Marionette, $, _) {
    Show.Contact = Marionette.ItemView.extend({
        template: '#contact-view',

        events: {
            'click a.js-list-contacts': 'backToContactsList',
            'click a.js-edit': 'editClicked'
        },

        backToContactsList: function(e) {
            e.preventDefault();
            ContactManager.trigger('contacts:list'); //Let the router handle it
        },

        editClicked: function (e) {
            e.preventDefault();
            this.trigger('contact:edit', this.model);
        },
    });

    Show.MissingContact = Marionette.ItemView.extend({
        template: '#missing-contact-view'
    });
});