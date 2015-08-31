import Ember from 'ember';
import Store from 'js/store';
import { test, module } from 'qunit';

const Person = Ember.Object.extend();
const Cat = Ember.Object.extend();

var store, registry, container;

module('store unit tests', {
    beforeEach: function() {
        registry = new Ember.Registry();
        registry.register('store:main', Store);
        registry.register('model:person', Person);
        registry.register('model:cat', Cat);
        container = registry.container();
        store = container.lookup('store:main');
    },
    afterEach: function() {
        store = null;
        container = null;
        registry = null;
    }
});

test('push will add model to the store', function(assert) {
    store.push('person', {
        id: 1,
        name: 'toran'
    });
    var person = store.find('person', 1);
    assert.equal(person.get('id'), 1);
    assert.equal(person.get('name'), 'toran');
});

test('push should return the created object', function(assert) {
    var person = store.push('person', {
        id: 1,
        name: 'toran'
    });
    assert.equal(person.get('id'), 1);
    assert.equal(person.get('name'), 'toran');
});

test('push will update any existing object', function(assert) {
    var first = store.push('person', {
        id: 1,
        name: 'toran'
    });
    var last = store.push('person', {
        id: 1,
        name: 'updated'
    });
    assert.equal(last.get('name'), 'updated');
    assert.equal(first.get('name'), 'updated');
});

test('push will respect diff model types', function(assert) {
    store.push('person', {
        id: 1,
        name: 'toran'
    });
    store.push('cat', {
        id: 1,
        name: 'wat'
    });

    var person = store.find('person', 1);
    assert.equal(person.get('name'), 'toran');

    var cat = store.find('cat', 1);
    assert.equal(cat.get('name'), 'wat');
});

test('push will create a rich ember model object', function(assert) {
    var person = store.push('person', {
        id: 1,
        name: 'toran'
    });
    assert.equal(person instanceof Person, true);
    var cat = store.push('cat', {
        id: 1,
        name: 'toran'
    });
    assert.equal(cat instanceof Cat, true);
});

test('find will return all models for a given type', function(assert) {
    store.push('person', {
        id: 1,
        name: 'toran'
    });
    store.push('person', {
        id: 2,
        name: 'brandon'
    });
    store.push('cat', {
        id: 1,
        name: 'wat'
    });
    var all = store.find('person');
    assert.equal(all.length, 2);
});
