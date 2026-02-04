(function setupHMR() {
  const eventsource = new EventSource('/events');
  eventsource.onmessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.type === 'reload') {
      window.location.reload();
    }
  };
  eventsource.onerror = () => {
    eventsource.close();
  };
})();