module.exports = async function handler(req, res) {
  const { ticker } = req.query;
  
  if (!ticker) {
    return res.status(400).json({ error: 'Ticker is required' });
  }

  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=3y&interval=1d`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?range=3y&interval=1d`
  ];

  for (let url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Origin': 'https://finance.yahoo.com',
          'Referer': 'https://finance.yahoo.com/'
        }
      });

      if (response.ok) {
        const data = await response.json();
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json(data);
      }
    } catch (err) {
      console.error('Node failed, trying next...');
    }
  }

  return res.status(502).json({ error: 'Upstream market data blocked or unavailable' });
};
