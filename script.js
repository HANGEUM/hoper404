async function loadStatus() {
  const res = await fetch('/api/status');
  const data = await res.json();
  document.getElementById('server-status').textContent = data.status;
  document.getElementById('cpu-usage').textContent = data.cpu;
}

async function restartServer() {
  const res = await fetch('/api/restart', { method: 'POST' });
  const result = await res.json();
  alert(result.message);
  loadStatus();
}

loadStatus();
