// create a worker whose code is defined in the file passed as parameter
const worker = new Worker("worker.js");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/worker.js")
    .then(serviceWorker => {
      console.log("Service Worker registered: ", serviceWorker);
    })
    .catch(error => {
      console.error("Error registering the Service Worker: ", error);
    });
}
