//List submodule callback
//Name of submodule, application object, Backbone, Backbone.Marionette, jQuery, Underscore
ContactManager.module('ContactsApp.List', function (List, ContactManager, Backbone, Marionette, $, _) {

    List.Contact = Marionette.ItemView.extend({
        tagName: 'tr',
        template: '#contact-list-item',

        events: {
            'click': 'highlightName',
            'click button.js-delete': 'deleteClicked',
            'click td a.js-show': 'showClicked'
            //'click td': 'displayContent'
        },

        highlightName: function (e) {
            //Prevents the evevnt from bubbling up the DOM tree (row doesn't get highlighted when the button is clicked)
            e.stopPropagation(); 
            this.$el.toggleClass('warning');
            this.trigger('contact:print:model', this.model); //exercise
        },

        //Delete the contact from our collection by triggering the event in our controller
        deleteClicked: function (e) {
            e.stopPropagation();
            this.trigger('contact:delete', this.model);
        },

        showClicked: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.trigger('contact:show', this.model);
        },

        //Marionette calls this function when the model corresponding to this childView is removed
        remove: function() {
            var self = this;
            this.$el.fadeOut(function() {
                //Calls original remove function as we hadn't redefined it.
                Marionette.ItemView.prototype.remove.call(self);
            });
        }

    /*
        displayContent: function(e) {
            var target = e.target;
            var targetContent = $(target).text();
            alert(targetContent);
        },
    */
    });

    //Use a CompositeView if you need to wrap your CollectionView
    List.Contacts = Marionette.CompositeView.extend({
        tagName: 'table',
        className: 'table table-hover',
        template: '#contact-list',
        childView: List.Contact,
        childViewContainer: 'tbody'
    });
});