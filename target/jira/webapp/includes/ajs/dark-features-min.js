(function($){var featuresArray=ENABLED_DARK_FEATURES_SUBSTITUTION;var features={};$.each(featuresArray,function(){features[this]=true});AJS.DarkFeatures={isEnabled:function(key){return !!features[key]}}})(AJS.$);