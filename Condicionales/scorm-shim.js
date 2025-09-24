(function(){
  function available(){ return (typeof window.pipwerks !== "undefined" && pipwerks && pipwerks.SCORM); }

  window.doInitialize = function(){
    if (!available()) return false;
    try {
      // asegure versión para SCORM 1.2
      pipwerks.SCORM.version = "1.2";
    } catch(e){}
    return pipwerks.SCORM.init();
  };

  window.doTerminate = function(){
    if (!available()) return false;
    return pipwerks.SCORM.quit();
  };

  window.doGetValue = function(element){
    if (!available()) return "";
    return pipwerks.SCORM.get(element);
  };

  window.doSetValue = function(element, value){
    if (!available()) return false;
    return pipwerks.SCORM.set(element, value);
  };

  window.doCommit = function(){
    if (!available()) return false;
    return pipwerks.SCORM.save();
  };
})();