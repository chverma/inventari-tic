var appModule = angular.module('angularTIC', ['ui.bootstrap']);
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
appModule.controller('indexController', function($scope, $http) {
    $scope.isCreateInventory = false;
    $scope.isListInventory = false;
    $scope.isCreateLocation = false;
    $scope.isListLocation = false;
    $scope.isCreateType = false;
    $scope.isListType = false;
});

/* Navbar controller */
appModule.controller('navBarController', function($scope, $http) {
    $http.get('/user')
        .success(function(data) {
            console.log(data)
            $scope.avatarImg = data.avatar;
            $scope.email = data.email;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
});

/**************************************
 * Inventory
 * 
 **************************************/
appModule.controller('createInventoryController', function($scope, $http) {
    // Set navbar menu option active (in use)
    $scope.isCreateInventory = true;
    $scope.isListInventory = false;
    $scope.isCreateLocation = false;
    $scope.isListLocation = false;
    $scope.isCreateType = false;
    $scope.isListType = false;

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
});

/* Detail inventory entry controller: Returns one entry by id */
appModule.controller('getDetailInventoryController', function getDetailInventoryController($scope, $http, $location) {
    // Set navbar menu option active (in use)
    $scope.isCreateInventory = false;
    $scope.isListInventory = false;
    $scope.isCreateLocation = false;
    $scope.isListLocation = false;
    $scope.isCreateType = false;
    $scope.isListType = false;

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

    // Delete an inventory
    $scope.deleteInventory = function() {
        var id = $scope.formData.inventory_id;
        $http.delete('/inventory/' + id)
            .success(function(data) {
                $scope.inventory = data;
                successMessage('Entrada d\'inventori borrada correctament.')
                setTimeout(function() { window.location.assign('/consultarInventari.html') }, 2000)
            })
            .error(function(data) {
                console.log('Error:' + data);
                errorMessage('Entrada d\'inventari no borrada. Ha ocorregut un error.')
            });
    };

    $scope.previousPage = function() {
        window.history.back();
    }
});

appModule.filter('startFrom', function() {
    return function(items, start) {
        if (items) {
            start = +start;
            return items.slice(start);
        }
        return [];
    };
});

appModule.filter('dateRange', function() {
    return function(items, fromDate, toDate) {
        var filtered = [];

        if (fromDate) {
            var from_date = Date.parse(fromDate);
            angular.forEach(items, function(item) {
                if (Date.parse(item.created_at) > from_date) {
                    filtered.push(item);
                }
            });
        }

        if (toDate) {
            toDate.setHours(23);
            toDate.setMinutes(59);
            var to_date = Date.parse(toDate);
            if (filtered.length == 0) {
                filtered = Array.from(items);
            }
            for (let i = 0; i < filtered.length; i++) {
                if (Date.parse(filtered[i].created_at) > to_date) {
                    filtered.splice(i, 2);
                }
            }
        }

        if (filtered.length == 0)
            return items;
        else
            return filtered;
    };
});

/* List inventory entries controller: Returns all entries */
appModule.controller('getAllInventoryController', ['$scope', '$http', 'filterFilter', 'dateRangeFilter', function($scope, $http, filterFilter, dateRange) {
    // Set navbar menu option active (in use)
    $scope.isCreateInventory = false;
    $scope.isListInventory = true;
    $scope.isCreateLocation = false;
    $scope.isListLocation = false;
    $scope.isCreateType = false;
    $scope.isListType = false;

    // Create empty array
    $scope.itemsToGenerateLabels = [];
    $scope.search = {};
    $scope.from_date = undefined;
    $scope.to_date = undefined;

    // Modal confirmation
    $scope.openModalRemove = function(id) {
        $('#modalRemove').modal('show')
        $scope.itemToRemove = id;
    };

    $scope.okModalRemove = function() {
        $('#modalRemove').modal('hide');
        $scope.deleteInventory($scope.itemToRemove);
    };

    // When the page is loadead, get from the API the incidences
    $http.get('/inventory')
        .success(function(data) {
            $scope.inventory = data;

            $scope.currentPage = 1
            $scope.itemsPerPage = 16;
            $scope.maxSize = 5;
            $scope.totalItems = $scope.inventory.length;

            $scope.numOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);

            // $watch search to update pagination
            $scope.$watch('search', function(newVal, oldVal) {
                $scope.filter(newVal);
            }, true);

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

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
    // Delete an incidence
    $scope.deleteInventory = function(id) {
        $http.delete('/inventory/' + id)
            .success(function(data) {
                location.reload();
            })
            .error(function(data) {
                console.log('Error:' + data);
                errorMessage('Entrada d\'inventari no borrada. Ha ocorregut un error.')
            });
    };
    // Add item in order to generate labels
    document.getElementById('check-all').checked = false;
    $scope.addItemToGenerateLabel = function(id, event) {
        if (id == -1) {
            let val = document.getElementById('check-all').checked;
            // Select all entries
            let elems = document.getElementsByClassName('check_label');
            for (let i = 0; i < elems.length; i++) {
                elems[i].checked = val;
                if (val) {
                    $scope.itemsToGenerateLabels.push(elems[i].value);
                } else {
                    $scope.itemsToGenerateLabels.splice($scope.itemsToGenerateLabels.indexOf(elems[i].value), 2);
                }

            }
        } else {
            if (event.currentTarget.checked) {
                $scope.itemsToGenerateLabels.push(id);
            } else {
                $scope.itemsToGenerateLabels.splice($scope.itemsToGenerateLabels.indexOf(id), 2);
            }
        }
    };

    // File upload
    $scope.fileName = undefined;
    $scope.fileUploadClick = function(event) {
        event.preventDefault();
        document.getElementById('fileUpload').click();
    };

    $scope.onFileSelected = function() {
        let file = document.getElementById('fileUpload').files[0];
        if (file) {
            let formFile = new FormData();
            formFile.append("upload", file);
            $http.post("/inventory_sai/parse_inventory", formFile, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            });
            $scope.fileName = '';
        }
    };

    $scope.clearFilter = function() {
        $scope.search = {};
        $scope.from_date = '';
        $scope.to_date = '';
    }

    // Order by function
    $scope.propertyName = 'aula';
    $scope.reverse = true;

    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
        $scope.filter($scope.search);
        dateRange($scope.filtered, $scope.from_date, $scope.to_date)
    };

    // Filter function
    $scope.filter = function(newVal) {
        $scope.filtered = filterFilter($scope.inventory, newVal);
        $scope.totalItems = $scope.filtered.length;
        $scope.numOfPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
        $scope.currentPage = 1;
    }

}]);

/**************************************
 * LOCATION
 * 
 **************************************/

/* Create location entry */
appModule.controller('createLocationController', function createLocationController($scope, $http) {
    // Set navbar menu option active (in use)
    $scope.isCreateInventory = false;
    $scope.isListInventory = false;
    $scope.isCreateLocation = true;
    $scope.isListLocation = false;
    $scope.isCreateType = false;
    $scope.isListType = false;

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
});

/* Get one location */
appModule.controller('getLocationController', function($scope, $http, $location) {
    // Set navbar menu option active (in use)
    $scope.isCreateInventory = false;
    $scope.isListInventory = false;
    $scope.isCreateLocation = false;
    $scope.isListLocation = false;
    $scope.isCreateType = false;
    $scope.isListType = false;

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
});

/* List all location entries controller: Returns all entries */
appModule.controller('getAllLocationController', function($scope, $http) {
    // Set navbar menu option active (in use)
    $scope.isCreateInventory = false;
    $scope.isListInventory = false;
    $scope.isCreateLocation = false;
    $scope.isListLocation = true;
    $scope.isCreateType = false;
    $scope.isListType = false;

    // When the page is loadead, get from the API the location
    $http.get('/location')
        .success(function(data) {
            $scope.location = data;
            for (const key in $scope.location) {
                $http.get(`/inventory/count?search={"location_id":${$scope.location[key].location_id}, "type_id":0 }&from_date=&to_date=`)
                    .success(function(data) {
                        $scope.location[key].num_pc = data.length;
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });
                $http.get(`/inventory/count?search={"location_id":${$scope.location[key].location_id}, "type_id":1 }&from_date=&to_date=`)
                    .success(function(data) {
                        $scope.location[key].num_monitors = data.length;
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });
                $http.get(`/inventory/count?search={"location_id":${$scope.location[key].location_id}, "type_id":2 }&from_date=&to_date=`)
                    .success(function(data) {
                        $scope.location[key].num_projectors = data.length;
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });
                $http.get(`/inventory/count?search={"location_id":${$scope.location[key].location_id}, "type_id":3 }&from_date=&to_date=`)
                    .success(function(data) {
                        $scope.location[key].num_switch = data.length;
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });

                $http.get(`/inventory/count?search={"location_id":${$scope.location[key].location_id}, "type_id":12 }&from_date=&to_date=`)
                    .success(function(data) {
                        $scope.location[key].num_pissarres = data.length;
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });
            }


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

    // Modal confirmation
    $scope.openModalRemove = function(id) {
        $('#modalRemove').modal('show')
        $scope.itemToRemove = id;
    };

    $scope.okModalRemove = function() {
        $('#modalRemove').modal('hide');
        $scope.deleteLocation($scope.itemToRemove);
    };
});

/**************************************
 * TYPE
 * 
 **************************************/

/* Create type entry */
appModule.controller('createTypeController', function($scope, $http) {
    // Set navbar menu option active (in use)
    $scope.isCreateInventory = false;
    $scope.isListInventory = false;
    $scope.isCreateLocation = false;
    $scope.isListLocation = false;
    $scope.isCreateType = true;
    $scope.isListType = false;

    $scope.formData = {}

    // When new location entry is created, send it to the backend API
    $scope.createType = function() {
        $http.post('/type', $scope.formData)
            .success(function(data) {
                //$scope.formData = {};
                $scope.location = data;
                console.log("*********DATA")
                console.log(data)
                if (data.code) {
                    errorMessage('Ha ocorregut un error al crear el tipus.' + data.sqlMessage)
                } else {
                    successMessage('Entrada de tipus creada!');
                    setTimeout(function() { window.location.assign('/detallTipus.html?type_id=' + data.type_id) }, 2000);
                }
            })
            .error(function(data) {
                console.log(data)
                if (data.error) {
                    data = ": " + data.message.sqlMessage;
                } else {
                    data = "";
                }
                errorMessage('Ha ocorregut un error al crear l\'entrada de tipus' + data)
            });
    };
});

/* Get one type */
appModule.controller('getTypeController', function($scope, $http, $location) {
    // Set navbar menu option active (in use)
    $scope.isCreateInventory = false;
    $scope.isListInventory = false;
    $scope.isCreateLocation = false;
    $scope.isListLocation = false;
    $scope.isCreateType = false;
    $scope.isListType = false;

    $scope.formData = {};
    $scope.parameters = $location.search();

    // When the page is loadead, get from the API the type
    $http.get('/type/' + $scope.parameters.type_id)
        .success(function(data) {
            $scope.formData = data[0];
        })
        .error(function(data) {
            console.log('Error: ' + data);
            errorMessage('Ha ocorregut un error. ' + data)
        });

    $scope.modifyType = function() {
        $http.put('/type/' + $scope.formData.type_id, $scope.formData)
            .success(function(data) {
                $scope.type = data;
                successMessage('Modificat correctament')
            })
            .error(function(data) {
                console.log('Error:' + data);
                errorMessage('Error al modificar ' + data)
            });
    };

    // Delete type
    $scope.deleteType = function() {
        var id = $scope.formData.type_id;
        $http.delete('/type/' + id)
            .success(function(data) {
                $scope.type = data;
                successMessage('Tipus borrat correctament.')
                setTimeout(function() { window.location.assign('/consultarTipus.html') }, 2000)
            })
            .error(function(data) {
                console.log('Error:' + data);
                errorMessage('Lloc no borrat. Ha ocorregut un error.')
            });
    };

    $scope.previousPage = function() {
        window.history.back();
    }
});

/* List all type entries controller: Returns all entries */
appModule.controller('getAllTypeController', function($scope, $http) {
    // Set navbar menu option active (in use)
    $scope.isCreateInventory = false;
    $scope.isListInventory = false;
    $scope.isCreateLocation = false;
    $scope.isListLocation = false;
    $scope.isCreateType = false;
    $scope.isListType = true;

    // When the page is loadead, get from the API the type
    $http.get('/type')
        .success(function(data) {
            $scope.type = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // Delete a type
    $scope.deleteType = function(id) {
        $http.delete('/type/' + id)
            .success(function(data) {
                location.reload();
            })
            .error(function(data) {
                console.log('Error:' + data);
                errorMessage('Lloc no borrat. Ha ocorregut un error.')
            });
    };

    // Modal confirmation
    $scope.openModalRemove = function(id) {
        $('#modalRemove').modal('show')
        $scope.itemToRemove = id;
    };

    $scope.okModalRemove = function() {
        $('#modalRemove').modal('hide');
        $scope.deleteType($scope.itemToRemove);
    };
});