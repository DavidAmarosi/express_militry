import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

app.use(express.json());

async function readProducts() {
  const data = await fs.readFile('data/products.json', 'utf-8');
  return JSON.parse(data);
}

async function writeProducts(products) {
  await fs.writeFile('data/products.json', JSON.stringify(products, null, 2));
}

 app.get("/products", async (req, res) => {
  try{
    const tasks = await readProducts()
    console.log(tasks)
    res.status(200).json({data: tasks})
  }catch{res.status(500).json({"error": error})}
})
app.get("/products/:id", async (req,res) => {
  try{
    const id = req.params.id
    const data = await readProducts()
    for (let index = 0; index < data.length; index++) {
      if (data[index].id == id){
        res.status(200).json({data: data[index]})
      }
      
    }
  }catch{res.status(500).json({"error": error})}
})
app.post("/products", async (req,res) =>{
  try{
    const data = await readProducts();
    const body = req.body;
    console.log(body)
    const maxId = data[data.length -1].id +1
    const newproject = {id: maxId, ...body} 
    console.log(newproject)     
    data.push(newproject)
    await writeProducts(data)
    console.log(data)
    res.status(200).json({data: data})

  }catch{ res.status(500).json({"error": error})}
})

app.put("/products/:id", async (req,res) => {
  try{
    const id = req.params.id;
    console.log(id)
    const body = req.body;
    console.log(body)
    const data = await readProducts()
    for (let index = 0; index < data.length; index++) {
      if (data[index].id == id){
        const data2 = data[index]
        data[index].name = body.name
        data[index].price = body.price
        data[index].category = body.category
        data[index].stock = body.stock
        res.status(200).json({data: data2})
      }
    }
    writeProducts(data)
  }catch{ res.status(500).json({error: "error"})}
})
app.delete("/products/:id", async (req, res) => {
  try{
    const id = req.params.id;
    const body = req.body;
    const data = await readProducts()
    for (let index = 0; index < data.length; index++) {
      if (data[index].id == id){
        const filterdata = data.filter((data) => data.id != id)
        writeProducts(filterdata)
      }}
  }catch{res.status(500).json({"error": error})}
})

app.get("/products/search", async (req, res) => {
    try{
    const data = await readProducts()
    const { category } = req.query;
    const data2 = data.filter((f) => String(f.category) == category)
    res.status(200).json({data: data2})
    }catch{res.status(500).json({"error": error})}
})

app.get("/products/search", async (req, res) => {
    try{
    const data = await readProducts()
    const  minPrice  = req.query.minPrice;
    const  maxPrice  = req.query.maxPrice;
    console.log(typeof(minPrice))
    const data2 = data.filter((f) => f.price > minPrice || f.price < maxPrice)
    res.status(200).json({data: data2})
    }catch{res.status(500).json({"error": error})}
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});