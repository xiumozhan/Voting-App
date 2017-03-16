testApp.controller('pollController', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
    const pollId = $routeParams.id;
    const getAllOptions = () => {
        if(pollId) {
            $http({
                method: 'GET',
                url: `/api/poll/${pollId}`,
            })
            .then((poll) => {
                console.log('the newly created poll:');
                console.log(poll);
                const pollObj = poll.data;
                $scope.title = pollObj.question;
                $scope.options = pollObj.options;
            }, (fail) => {
                console.log(fail);
            })
            .catch((err) => {
                console.log(err);
            });
        }
    };

    getAllOptions();

    $scope.vote = function(optionId) {
        $http({
            method: 'PUT',
            url: `/api/option/${optionId}`
        })
        then((option) => {
            const optionObj = option.data;
            console.log(optionObj);
        }, (fail) => {
            console.log(fail);
        })
        .catch((err) => {
            console.log(err);
        });
    };
}]);
