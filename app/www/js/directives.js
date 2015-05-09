angular.module('directives', [])

.directive("dbTimeline", function(CardService, ShareService, $rootScope, $ionicScrollDelegate) {
  return {
    restrict: 'E',
    // template: "<div class='db-timeline'></div>",
    templateUrl: "templates/infoView.html",
    link: function(scope, element, attrs) {
      console.log("dbTimeline directive loaded");
      var numberOfElements = 0;

      // scope.$watch("infoCards", function(val) {
        $rootScope.$on("cardUpdated", function() {
        // $(".db-timeline").append("<div class='db-timeline-element'>" + val + "</div>");
          console.log("cardUpdated");
          numberOfElements++;
          newElementValue = ShareService.getMessage();
          appendElement(newElementValue);
        })
      // }, true)

      $(".infoview-content").css("height", (window.innerHeight * 0.4));

      function appendElement(newElementValue) {
        $(".infoview-content").css("width", (window.innerWidth * numberOfElements) + "px");
        var newInfoElement = $("<div class='infoview-element'><div class='inner-ele'><p class='inner-ele-title'>" + newElementValue.values_.name + "</div></div></div>");
        $(".infoview-content").append(newInfoElement);
        newInfoElement.velocity({
          opacity: 1
        }, {
          duration: 500
        })
        console.log(newInfoElement);
        $(".infoview-element").css("width", window.innerWidth);
        $ionicScrollDelegate.$getByHandle('infoViewScroller').resize();
        $ionicScrollDelegate.$getByHandle('infoViewScroller').scrollBy(window.innerWidth, 0, true);
      }

    }
  }
});
