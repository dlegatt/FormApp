'use strict';

gbApp.controller('GuestBookController',
    function GuestBookController($scope, guestBookData) {
        $scope.entry = {};
        $scope.errors = {};
        $scope.deleted = null;
        $scope.notFound = null;
        $scope.entries = guestBookData.getAllEntries();
        $scope.refreshTable = function () {
            $scope.entries = guestBookData.getAllEntries();
        };
        $scope.clickMe = function (entry) {
            guestBookData.getEntry(36)
                .$promise.then(
                function (response) {
                    console.log(response);
                },
                function (response) {
                    console.log('failure', response);
                }
            )
        };
        $scope.editEntry = function (entry) {
            guestBookData.getEntry(entry.id)
                .$promise.then(
                function () {
                    $scope.editing = JSON.parse(JSON.stringify(entry));
                },
                function (response) {
                    $scope.notFound = entry;
                    $scope.refreshTable();
                }
            )
        };
        $scope.cancelEdit = function (entry) {
            guestBookData.getEntry(entry.id)
                .$promise.then(
                function () {
                    var idx = $scope.entries.indexOf(entry);
                    $scope.entries[idx] = $scope.editing;
                    $scope.editing = '';
                    $scope.editErrors = {};
                },
                function () {
                    $scope.notFound = entry;
                    $scope.refreshTable();
                }
            )
        };
        $scope.save = function(entry) {
            $scope.editErrors = {};
            guestBookData.updateEntry(entry)
                .$promise.then(
                function (response){
                    $scope.editing = null;
                },
                function (response) {
                    if (response.data !== null && response.status !== 404) {
                        for (var error in response.data.errors) {
                            $scope.editErrors[response.data.errors[error].field] =
                                response.data.errors[error].message;
                        }
                    }
                    if (response.data !== null && response.status === 404) {
                        $scope.notFound = entry;
                        $scope.refreshTable();
                    }
                }
            )
        };
        $scope.sign = function (entry) {
            $scope.errors = {};
            guestBookData.newEntry(entry)
                .$promise.then(
                function(response) {
                    $scope.refreshTable();
                    $scope.entry = null;
                },
                function(response) {
                    console.log('failure', response);
                    if (response.data !== null) {
                        for (var error in response.data.errors) {
                            $scope.errors[response.data.errors[error].field] =
                                response.data.errors[error].message;
                        }
                    }
                }
            )
        };
        $scope.delete = function(entry) {
            guestBookData.deleteEntry(entry.id)
                .$promise.then(
                function (response) {
                    $scope.deleted = response;
                    $scope.refreshTable();
                },
                function (response) {
                    $scope.notFound = entry;
                    $scope.refreshTable();
                }
            );
        };
        $scope.undoDelete = function() {
            var undo = {
                first_name: $scope.deleted.first_name,
                last_name: $scope.deleted.last_name,
                email: $scope.deleted.email
            };
            $scope.sign(undo);
            $scope.deleted = null;
        }
    }
);