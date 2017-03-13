testApp.controller('registerController', ['$scope', '$http', function($scope, $http) {
    $scope.username;
    $scope.email;
    $scope.password;

    $scope.register = function() {
        $http({
            method: 'POST',
            url: '/api/users',
            data: {
                name: $scope.username,
                email: $scope.email,
                password: $scope.password
            }
        })
        .then((response) => {
            console.log(response);
        }, (response) => {
            console.log(response);
        });
    }
}]);
