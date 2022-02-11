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

/* Controller for create inventory entry */
function createInventoryController($scope, $http) {
    // Set navbar menu option active (in use)
    $scope.isCreate = true;
    $scope.isList = false;

    // Get all locations
    $http.get('/location/')
        .success(function(data) {
            $scope.location = data;
        })
        .error(function(data) {
            console.log('Error: ', data);
        });

    $scope.formData = {}
    $http.get('/user')
        .success(function(data) {
            $scope.formData.email = data.email;
        })
        .error(function(data) {
            console.log('Error: ', data);
        });

    // When new entry is created, send it to the backend API
    $scope.createIncidence = function() {
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
                    setTimeout(function() { window.location.assign('/detall.html?inventory_id=' + data.inventory_id) }, 2000);
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
function getDetailController($scope, $http, $location) {
    $scope.isCreate = false;
    $scope.isList = false;

    $scope.formData = {};
    $scope.parameters = $location.search();
    // Get the faults
    $http.get('/faults/')
        .success(function(data) {
            $scope.faults = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // Get the proposals
    $http.get('/proposals')
        .success(function(data) {
            $scope.proposals = data;
        })
        .error(function(data) {
            console.log('Error: ', data);
        });

    // When the page is loadead, get from the API the incidences
    $http.get('/incidences/' + $scope.parameters.incidence_id)
        .success(function(data) {
            $scope.formData = data[0];
            //$('#dataihora').val(parseDate($scope.formData.data, true));
            // http://eonasdan.github.io/bootstrap-datetimepicker/#view-mode
            var dateTime1 = $('#datetimepicker1').datetimepicker({
                locale: 'ca',
                format: 'DD-MM-YYYY HH:mm',
                defaultDate: new Date($scope.formData.data),
            });

            // Date Picker for dia_com_pares
            var dateTime = $('#datetimepicker2').datetimepicker({
                locale: 'ca',
                format: 'DD-MM-YYYY',
                defaultDate: new Date($scope.formData.dia_com_pares),
            });

            //$('#dia_com_pares').val(parseDate($scope.formData.dia_com_pares, false));
        })
        .error(function(data) {
            console.log('Error: ' + data);
            errorMessage('Ha ocorregut un error. ' + data)
        });

    $scope.modifyIncidence = function() {
        $scope.formData.data = formatDate($('#dataihora').val());
        if ($('#dia_com_pares').val() === '') {
            $scope.formData.dia_com_pares = undefined;
        } else {
            $scope.formData.dia_com_pares = formatDate($('#dia_com_pares').val());
        }
        $http.put('/incidences/' + $scope.formData.incidence_id, $scope.formData)
            .success(function(data) {
                //$scope.formData = {};
                $scope.incidences = data;
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
        $http.delete('/incidences/' + id)
            .success(function(data) {
                $scope.incidences = data;
                successMessage('Incidència borrada correctament.')
                setTimeout(function() { window.location.assign('/consultar.html') }, 2000)
            })
            .error(function(data) {
                console.log('Error:' + data);
                errorMessage('Incidència no borrada. Ha ocorregut un error.')
            });
    };

    $scope.previousPage = function() {
        window.history.back();
    }
}

/* List inventory entries controller: Returns all entries */
function getAllController($scope, $http) {
    // Set navbar active
    $scope.isCreate = false;
    $scope.isList = true;
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