testApp.controller('mainController', ['$scope', '$location', '$http', function($scope, $location, $http) {
    $scope.goToPolls = () => {
        $location.path('/polls');
    };

    $scope.goToRandomPoll = () => {

        $http({
            method: 'GET',
            url: 'api/random-poll'
        })
        .then((response) => {

            const pollId = response.data[0]._id;
            $location.path(`/poll/${pollId}`);

        }, (fail) => {
            console.log(fail);
        })
        .catch((err) => {
            console.log(err);
        });
        
    };

}]);
