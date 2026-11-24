function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(id));
}

async function testDummy() {
  try {
    const res = await fetchWithTimeout('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyDummyTest', {}, 3000);
    const data = await res.json();
    console.log('Result status:', data.error?.status);
  } catch(e) {
    console.log('Error:', e.name, e.message);
  }
}

testDummy();
