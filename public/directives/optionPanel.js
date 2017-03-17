testApp.directive('optionPanel', function() {
    return {
        restrict: 'E',
        templateUrl: '../templates/optionPanel.html',
        controller: 'optionPanelController',
        replace: true,
        scope: {
            name: '=',
            id: '=',
            count: '=',
        }
    }
});
