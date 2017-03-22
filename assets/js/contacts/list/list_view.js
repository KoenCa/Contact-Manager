//List submodule callback
//Name of submodule, application object, Backbone, Backbone.Marionette, jQuery, Underscore
ContactManager.module('ContactsApp.List', function (List, ContactManager, Backbone, Marionette, $, _) {

    List.Layout = Marionette.LayoutView.extend({
        template: '#contact-list-layout',

        regions: {
            panelRegion: '#panel-region',
            contactsRegion: '#contacts-region'
        },
    });

    List.Panel = Marionette.ItemView.extend({
        template: '#contact-list-panel',

        triggers: {
            'click button.js-new': 'contact:new'
        }
    });

    List.Contact = Marionette.ItemView.extend({
        tagName: 'tr',
        template: '#contact-list-item',

        //Triggers hash prevents default event action (like submitting) and stops the event propagation.
        //The trigger handler ( in controller) will receive a single argument containing the view, model, and collection if applicable
        triggers: {
            'click td a.js-show': 'contact:show',
            'click td a.js-edit': 'contact:edit',
            'click button.js-delete': 'contact:delete',
        },

        events: {
            'click': 'highlightName',
        },

        highlightName: function (e) {
            //Prevents the event from bubbling up the DOM tree (row doesn't get highlighted when the button is clicked)
            e.stopPropagation();
            this.$el.toggleClass('warning');
            this.trigger('contact:print:model', this.model); //exercise
        },

        //Marionette calls this function when the model corresponding to this childView is removed
        remove: function () {
            var self = this;
            this.$el.fadeOut(function () {
                //Calls original remove function as we hadn't redefined it.
                Marionette.ItemView.prototype.remove.call(self);
            });
        },

        //Make the contact flash green
        flash: function (cssClass) {
            var $view = this.$el;
            $view.hide().toggleClass(cssClass).fadeIn(800, function () {
                setTimeout(function () {
                    $view.toggleClass(cssClass);
                }, 500);
            });
        }
    });

    //Use a CompositeView if you need to wrap your CollectionView
    List.Contacts = Marionette.CompositeView.extend({
        tagName: 'table',
        className: 'table table-hover',
        template: '#contact-list',
        childView: List.Contact,
        childViewContainer: 'tbody',

        //Restoure default behavior of attachHtml for if the collection is reset
        initialize: function () {
            this.listenTo(this.collection, 'reset', function () {
                this.attachHtml = function (collectionView, childView, index) {
                    collectionView.$el.append(childView.el);
                };
            });
        },

        //Overwrite attachtHtl so when a new contact is added it needs to appear at the top of the list
        onRenderCollection: function () {
            this.attachHtml = function (collectionView, childView, index) {
                collectionView.$el.prepend(childView.el);
            };
        }
    });
});