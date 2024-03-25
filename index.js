window.onload = async () => {
  if (navigator.serviceWorker) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
    } catch (error) {
      console.log('error register SWW :>> ', error);
    }
  }
}