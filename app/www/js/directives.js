angular.module('directives', [])

.directive("dbTimeline", function(CardService) {
  return {
    restrict: 'E',
    // template: "<div class='db-timeline'></div>",
    templateUrl: "templates/infoView.html",
    link: function(scope, element, attrs) {
      console.log("dbTimeline directive loaded");
      var numberOfElements = 0;

      scope.$watch("infoCards", function(val) {
        // $(".db-timeline").append("<div class='db-timeline-element'>" + val + "</div>");
        console.log("watch triggered");
        numberOfElements++;
        newElementValue = val;
        appendElement(newElementValue);
      }, true)

      $(".infoview-content").css("height", (window.innerHeight * 0.4));

      function appendElement(newElementValue) {
        $(".infoview-content").css("width", (window.innerWidth * numberOfElements) + "px");
        $(".infoview-content").append("<div class='infoview-element'>" + newElementValue + "</div>");
      }

    }
  }
});
