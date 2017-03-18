testApp.controller('pollsController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    const loadAllPolls = () => {
        $http({
            method: 'GET',
            url: '/api/polls'
        })
        .then((polls) => {
            $scope.polls = polls.data;
        }, (fail) => {
            console.log(fail);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    loadAllPolls();

    $scope.goToPoll = (id) => {
        $location.path(`/poll/${id}`);
    };
}]);
