(function(window, document, undefined) {

  var module = angular.module('ngui.slider', []);

  module.directive('uiSlider', ['$timeout',
    function($timeout) {

      return  {
        restrict: 'A',

        scope: true,

        controller: function() {

          var lastSwitched = 0;
          var ctrl = this;
          var timeoutId = null;

          ctrl.slides = [];
          ctrl.timeout = 0;

          ctrl.activate = function(slide) {
            if (Date.now() - lastSwitched < 500)
              return;
            console.log('Activating %s', slide.index);
            ctrl.slides.forEach(function(slide) {
              slide.active = false;
            });
            slide.active = true;
            lastSwitched = Date.now();
            ctrl.start();
          };

          ctrl.add = function(slide) {
            if (ctrl.slides.length == 0)
              ctrl.activate(slide);
            ctrl.slides.push(slide);
          };

          ctrl.getActiveIndex = function() {
            for (var i = 0; i < ctrl.slides.length; i++)
              if (ctrl.slides[i].active)
                return i;
            return -1;
          };

          ctrl.getNextIndex = function() {
            return (ctrl.getActiveIndex() + 1) % ctrl.slides.length;
          };

          ctrl.getPrevIndex = function() {
            return (ctrl.getActiveIndex() + ctrl.slides.length - 1) %
              ctrl.slides.length;
          };

          ctrl.next = function() {
            ctrl.activate(ctrl.slides[ctrl.getNextIndex()]);
          };

          ctrl.prev = function() {
            ctrl.activate(ctrl.slides[ctrl.getPrevIndex()]);
          };

          ctrl.start = function() {
            if (timeoutId) {
              $timeout.cancel(timeoutId);
              timeoutId = null;
            }
            if (ctrl.timeout) {
              timeoutId = $timeout(function() {
                ctrl.next();
              }, ctrl.timeout);
            }
          };

        },

        controllerAs: 'slider',

        link: function($scope, $element, $attrs) {
          $scope.slider.timeout = parseInt($attrs.uiSlider) || 0;
          $scope.slider.start();
        }
      };

    }
  ]);

  module.directive('uiSlide', function() {
    return {
      require: '^uiSlider',
      transclude: true,
      replace: true,
      scope: {},
      template: '<div ng-transclude ng-class="classes()"></div>',
      restrict: 'A',
      link: function($scope, $element, $attrs, slider) {
        $scope.index = slider.slides.length;
        slider.add($scope);
        $scope.activate = function() {
          slider.activate($scope);
        };
        $scope.classes = function() {
          return {
            active: $scope.active,
            next: $scope.index == slider.getNextIndex(),
            prev: $scope.index == slider.getPrevIndex()
          };
        };
      }
    }
  });

})(window, document);

