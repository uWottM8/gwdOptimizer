export default (req, res) => {
    const body = req.body;
    //const fileValue = JSON.parse(body);
    console.log(body);
    res.statusCode = 200
    res.json({ name: JSON.stringify(body) });
  }