import Ember from 'ember';

var typedArray = function(type, store) {
    var typedArray = store.array[type] || [];
    store.array[type] = typedArray;
    return typedArray;
};

var Store = Ember.Object.extend({
    init: function() {
        this.array = [];
    },
    find: function(type, options) {
        if(typeof options === 'undefined') {
            return typedArray(type, this);
        }
        return this.getById(type, options);
    },
    push: function(type, data) {
        var record = this.getById(type, data.id);
        if(record) {
            record.setProperties(data);
        }else{
            var factory = this.container.lookupFactory('model:' + type);
            record = factory.create(data);
            typedArray(type, this).push(record);
        }
        return record;
    },
    getById: function(type, id) {
        return typedArray(type, this).filter(function(model) {
            return model.get('id') === id;
        })[0];
    }
});

export default Store;
