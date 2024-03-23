window.onload = async () => {
  if (navigator.serviceWorker) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      console.log('register :>> ', reg);
    } catch (error) {
      console.log('error register SWW :>> ', error);
    }
  }
}