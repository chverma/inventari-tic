var appModule = angular.module('angularTIC', []);
appModule.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);

/* Auxiliar methods */
function successMessage(msg) {
    $('.alert-success').css("display", "block")
    $('#success-message').text(msg)
    setTimeout(function() { $('.alert-success').css("display", "none"); }, 10000);
}

function errorMessage(msg) {
    $('.alert-danger').css("display", "block")
    $('#error-message').text(msg)
    setTimeout(function() { $('.alert-danger').css("display", "none"); }, 10000);
}

/* Index page controller */
function indexController($scope, $http) {
    $scope.isCreateInventory = false;
    $scope.isListInventory = false;
    $scope.isCreateLocation = false;
    $scope.isListLocation = false;
}

/* Navbar controller */
function navBarController($scope, $http) {
    $http.get('/user')
        .success(function(data) {
            console.log(data)
            $scope.avatarImg = data.avatar;
            $scope.email = data.email;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
}

/**************************************
 * Inventory
 * 
 **************************************/
function createInventoryController($scope, $http) {
    // Set navbar menu option active (in use)
    $scope.isCreateInventory = true;
    $scope.isListInventory = false;
    $scope.isCreateLocation = false;
    $scope.isListLocation = false;

    // Get all locations
    $http.get('/location/')
        .success(function(data) {
            $scope.locations = data;
        })
        .error(function(data) {
            console.log('Error: ', data);
        });

    // Get all types
    $http.get('/type')
        .success(function(data) {
            $scope.types = data;
        })
        .error(function(data) {
            console.log('Error: ', data);
        });

    // When new entry is created, send it to the backend API
    $scope.createInventory = function() {
        $http.post('/inventory', $scope.formData)
            .success(function(data) {
                //$scope.formData = {};
                $scope.inventory = data;
                console.log("*********DATA")
                console.log(data)
                if (data.code) {
                    errorMessage('Ha ocorregut un error al crear l\'entrada d\'inventari.' + data.sqlMessage)
                } else {
                    successMessage('Entrada d\'inventari creada!');
                    setTimeout(function() { window.location.assign('/detallInventari.html?inventory_id=' + data.inventory_id) }, 2000);
                }
            })
            .error(function(data) {
                console.log(data)
                if (data.error) {
                    data = ": " + data.message.sqlMessage;
                } else {
                    data = "";
                }
                errorMessage('Ha ocorregut un error al crear l\'entrada d\'inventari' + data)
            });
    };
}

/* Detail inventory entry controller: Returns one entry by id */
function getDetailInventoryController($scope, $http, $location) {
    // Set navbar menu option active (in use)
    $scope.isCreateInventory = false;
    $scope.isListInventory = false;
    $scope.isCreateLocation = false;
    $scope.isListLocation = false;

    $scope.formData = {};
    $scope.parameters = $location.search();
    // Get the types
    $http.get('/type/')
        .success(function(data) {
            $scope.types = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // Get the locations
    $http.get('/location')
        .success(function(data) {
            $scope.locations = data;
        })
        .error(function(data) {
            console.log('Error: ', data);
        });

    // When the page is loadead, get from the API the inventory
    $http.get('/inventory/' + $scope.parameters.inventory_id)
        .success(function(data) {
            $scope.formData = data[0];
        })
        .error(function(data) {
            console.log('Error: ' + data);
            errorMessage('Ha ocorregut un error. ' + data)
        });

    $scope.modifyInventory = function() {
        $http.put('/inventory/' + $scope.formData.inventory_id, $scope.formData)
            .success(function(data) {
                //$scope.formData = {};
                $scope.inventory = data;
                successMessage('Modificat correctament')
            })
            .error(function(data) {
                console.log('Error:' + data);
                errorMessage('Error al modificar ' + data)
            });
    };

    // Delete an incidence
    $scope.deleteIncidence = function() {
        var id = $scope.formData.incidence_id;
        $http.delete('/inventory/' + id)
            .success(function(data) {
                $scope.inventory = data;
                successMessage('Entrada d\'inventori borrada correctament.')
                setTimeout(function() { window.location.assign('/consultarInventari.html') }, 2000)
            })
            .error(function(data) {
                console.log('Error:' + data);
                errorMessage('Entrada d\'inventori no borrada. Ha ocorregut un error.')
            });
    };

    $scope.previousPage = function() {
        window.history.back();
    }
}

/* List inventory entries controller: Returns all entries */
function getAllController($scope, $http) {
    // Set navbar menu option active (in use)
    $scope.isCreateInventory = false;
    $scope.isListInventory = false;
    $scope.isCreateLocation = true;
    $scope.isListLocation = false;

    // When the page is loadead, get from the API the incidences
    $http.get('/incidences')
        .success(function(data) {
            $scope.incidences = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // Delete an incidence
    $scope.deleteIncidence = function(id) {
        $http.delete('/incidences/' + id)
            .success(function(data) {
                location.reload();
            })
            .error(function(data) {
                console.log('Error:' + data);
                errorMessage('Incidència no borrada. Ha ocorregut un error.')
            });
    };
}

/**************************************
 * LOCATION
 * 
 **************************************/

/* Create location entry */
function createLocationController($scope, $http) {
    // Set navbar menu option active (in use)
    $scope.isCreateInventory = false;
    $scope.isListInventory = false;
    $scope.isCreateLocation = true;
    $scope.isListLocation = false;

    $scope.formData = {}

    // When new location entry is created, send it to the backend API
    $scope.createLocation = function() {
        $http.post('/location', $scope.formData)
            .success(function(data) {
                //$scope.formData = {};
                $scope.location = data;
                console.log("*********DATA")
                console.log(data)
                if (data.code) {
                    errorMessage('Ha ocorregut un error al crear el lloc.' + data.sqlMessage)
                } else {
                    successMessage('Entrada de lloc creada!');
                    setTimeout(function() { window.location.assign('/detallLloc.html?location_id=' + data.location_id) }, 2000);
                }
            })
            .error(function(data) {
                console.log(data)
                if (data.error) {
                    data = ": " + data.message.sqlMessage;
                } else {
                    data = "";
                }
                errorMessage('Ha ocorregut un error al crear l\'entrada de lloc' + data)
            });
    };
}

/* Get one location */
function getLocationController($scope, $http, $location) {
    // Set navbar menu option active (in use)
    $scope.isCreateInventory = false;
    $scope.isListInventory = false;
    $scope.isCreateLocation = false;
    $scope.isListLocation = false;

    $scope.formData = {};
    $scope.parameters = $location.search();

    // When the page is loadead, get from the API the location
    $http.get('/location/' + $scope.parameters.location_id)
        .success(function(data) {
            $scope.formData = data[0];
        })
        .error(function(data) {
            console.log('Error: ' + data);
            errorMessage('Ha ocorregut un error. ' + data)
        });

    $scope.modifyLocation = function() {
        $http.put('/location/' + $scope.formData.location_id, $scope.formData)
            .success(function(data) {
                $scope.location = data;
                successMessage('Modificat correctament')
            })
            .error(function(data) {
                console.log('Error:' + data);
                errorMessage('Error al modificar ' + data)
            });
    };

    // Delete location
    $scope.deleteLocation = function() {
        var id = $scope.formData.location_id;
        $http.delete('/location/' + id)
            .success(function(data) {
                $scope.location = data;
                successMessage('Lloc borrat correctament.')
                setTimeout(function() { window.location.assign('/consultarLloc.html') }, 2000)
            })
            .error(function(data) {
                console.log('Error:' + data);
                errorMessage('Lloc no borrat. Ha ocorregut un error.')
            });
    };

    $scope.previousPage = function() {
        window.history.back();
    }
}

/* List all location entries controller: Returns all entries */
function getAllLocationController($scope, $http) {
    // Set navbar menu option active (in use)
    $scope.isCreateInventory = false;
    $scope.isListInventory = false;
    $scope.isCreateLocation = false;
    $scope.isListLocation = false;

    // When the page is loadead, get from the API the location
    $http.get('/location')
        .success(function(data) {
            $scope.location = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // Delete a location
    $scope.deleteLocation = function(id) {
        $http.delete('/location/' + id)
            .success(function(data) {
                location.reload();
            })
            .error(function(data) {
                console.log('Error:' + data);
                errorMessage('Lloc no borrat. Ha ocorregut un error.')
            });
    };
}