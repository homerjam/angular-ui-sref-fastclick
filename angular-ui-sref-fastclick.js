(function() {
    'use strict';

    angular.module('hj.uiSrefFastclick', [])
        .directive('uiSref', ['$document',
            function($document) {
                return {
                    restrict: 'A',
                    priority: 999,
                    link: function($scope, $element, $attrs) {
                        var trackTouch, touchTarget, touchStartX, touchStartY, lastClickTime,
                            boundary = 10,
                            tapDelay = 200;

                        var touchMove = function(e) {
                            if (Math.abs(e.targetTouches[0].pageX - touchStartX) > boundary || Math.abs(e.targetTouches[0].pageY - touchStartY) > boundary) {
                                trackTouch = false;
                            }
                        };

                        $document.on("touchmove", touchMove);

                        $element.on('$destroy', function() {
                            $document.off("touchmove", touchMove);
                        });

                        $element.bind("touchstart", function(e) {
                            if (e.targetTouches.length > 1) {
                                return;
                            }

                            touchTarget = e.target;

                            touchStartX = e.targetTouches[0].pageX;
                            touchStartY = e.targetTouches[0].pageY;

                            trackTouch = true;

                            if ((e.timeStamp - lastClickTime) < tapDelay) {
                                e.preventDefault();
                            }
                        });

                        $element.bind("touchend", function(e) {
                            if (!trackTouch) {
                                return;
                            }

                            if (e.target !== touchTarget) {
                                return;
                            }

                            if (Math.abs(e.changedTouches[0].pageX - touchStartX) > boundary || Math.abs(e.changedTouches[0].pageY - touchStartY) > boundary) {
                                return;
                            }

                            lastClickTime = e.timeStamp;

                            $element.triggerHandler('click');

                            e.preventDefault();
                        });
                    }
                };
            }
        ]);

})();
