testApp.controller('pollsController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    let fullPollList = [];

    const loadAllPolls = () => {
        $http({
            method: 'GET',
            url: '/api/polls'
        })
        .then((polls) => {
            $scope.polls = polls.data;
            fullPollList = $scope.polls;
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

    $scope.clearSearchString = () => {
        $scope.searchString = undefined;
        $scope.polls = fullPollList;
    };

    $scope.searchPoll = () => {
        let escaped;
        escaped = $scope.searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        escaped = escaped.replace(/\s+/g, '.*$&');
        const searchExp = new RegExp(escaped, 'gi');
        $scope.polls = fullPollList.filter((poll) => {
            return searchExp.test(poll.question) === true;
        });
    }
}]);
