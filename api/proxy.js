export default async function handler(req, res) {
  const { ticker } = req.query;
  
  if (!ticker) {
    return res.status(400).json({ error: 'Ticker is required' });
  }

  try {
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?range=3y&interval=1d`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Upstream API blocked or ticker not found' });
    }

    const data = await response.json();
    
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
