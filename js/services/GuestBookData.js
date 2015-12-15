'use strict';

gbApp.factory('guestBookData', function ($resource, $http){
    var rsc = $resource('/api/gb/:id', {id: '@id'},
        {
            update: {
                method: 'PUT'
            }
        }
    );

    return {
        getEntry: function (entryId) {
            return rsc.get({id:entryId});
        },
        getAllEntries: function () {
            return rsc.query()
        },
        newEntry: function (entry) {
            return rsc.save(entry);
        },
        updateEntry: function (entry) {
            return rsc.update({id:entry.id}, entry);
        },
        deleteEntry: function (entryId) {
            return rsc.delete({id:entryId});
        }
    }
});