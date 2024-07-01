// This component is used to show a snackbar message on the screen whenever Cesium fails to load a resource.
// I've specifically created this component for backgroundlayers. Whenever backgroundlayers fail to load from the ikarta server and the Cesium API fails to load the resource.
// The snackbar message will inform the user that the page needs to be reloaded which will then load the fallback URL.

var originalLoadWithXhr = Cesium.Resource._Implementations.loadWithXhr;
Cesium.Resource._Implementations.loadWithXhr = function (
  url,
  responseType,
  method,
  data,
  headers,
  deferred,
  overrideMimeType
) {
  var originalReject = deferred.reject;
  deferred.reject = function (error) {
    Snackbar.show({
      text: "Fel! Var vänlig och ladda om sidan (Ctrl + R)",
      actionText: "x",
      pos: "top-left",
      duration: 10000,
    });
    originalReject.call(deferred, error);
  };
  return originalLoadWithXhr.call(
    this,
    url,
    responseType,
    method,
    data,
    headers,
    deferred,
    overrideMimeType
  );
};
