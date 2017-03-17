testApp.controller('pollController', ['$scope', '$routeParams', '$http', '$window', '$timeout', function($scope, $routeParams, $http, $window, $timeout) {
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

    $scope.voted = $window.localStorage['voted'] || false;
    $scope.added = [];
    $scope.selection = {
        selected: undefined
    }

    $scope.$watch('voted', (newValue, oldValue) => {
        $timeout(() => {
            $scope.voted = false;
            $window.localStorage['voted'] = false;
        }, 10 * 1000);
    });

    $scope.addOption = (option) => {
        $scope.added.push(option);
    };

    $scope.submitAddedOptions = () => {
        if($scope.added.length > 0) {
            let added;
            if($scope.added.length === 1) {
                added = $scope.added[0];
            } else {
                added = $scope.added;
            }

            $http({
                method: 'POST',
                url: `/api/poll/${pollId}`,
                data: {
                    options: added
                }
            })
            .then((poll) => {
                const pollObj = poll.data.poll;
                $scope.options = pollObj.options;
                $scope.added = [];
            }, (fail) => {
                console.log(fail);
                $scope.errorMessage = fail;
            })
            .catch((err) => {
                console.log(err);
            });
        }
    };

    $scope.vote = function() {
        const index = $scope.selection.selected;
        const id = $scope.options[index]._id;
        $http({
            method: 'PUT',
            url: `/api/option/${id}`
        })
        .then((option) => {
            const optionObj = option.data;
            const newCount = optionObj.count;
            console.log(newCount);

            $scope.options[index].count = newCount;

            $window.localStorage['voted'] = true;
            $scope.voted = true;
            $scope.selection.selected = undefined;
        }, (fail) => {
            console.log(fail);
        })
        .catch((err) => {
            console.log(err);
        });
    };
}]);
