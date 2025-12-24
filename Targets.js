import express from "express";
import fs from "fs/promises";
import { join } from "path";

const app = express();
const PORT = process.env.PORT || 8000;


app.use((req,res,next) =>{
  const serverStartTime = new Date().toISOString();

  // req.headers["X-Server-Start-Time"] = serverStartTime
  res.set("X-Server-Start-Time", serverStartTime)
  
  next();
})

app.get("/ealth", (req, res, next) => {
  try {
    res.status(200).json({
      " status": "ok",
      serverTime: "ISO_TIMESTAMP ",
    });
  } catch {
    console.error(error);
    res.status(500).json({ msg: "error" });
  }
});
app.get("/briefing", (req, res, next) => {
  try {
    const headers = req.headers;
    console.log(headers["client-unit"]);
    if (headers["client-unit"] === 0 || headers["client-unit"] != "golani") {
      res.status(400).json({
        msg: {
          unit: "Golani",
          message: "briefing delivered",
        },
      });
    } else {
      res.send(headers["client-unit"]);
    }
  } catch {
    console.error(error);
    res.status(500).json({ msg: "error" });
  }
});
app.get("/targets/:id", async (req, res) => {
  try {
    const id = +req.params.id;
    const data = await fs.readFile("data/targets.json", "utf-8");
    const dataJson = JSON.parse(data);
    const targets = dataJson.targets;
    const findId = targets.find((target) => target.id == id);
    if (!findId) {
      res.status(404).json({ message: "not found id" });
    }
    res.send(findId, null, 2);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

app.get("/targets", async (req, res) => {
  try {
    const data = await fs.readFile("data/targets.json", "utf-8");
    const dataJson = JSON.parse(data);
    const { region, status, minPriority } = req.query;
    const targets = dataJson.targets;
    let data2 = []
    for (let index = 0; index < targets.length; index++) {
      if (
        targets[index].region == region ||
        targets[index].status == status ||
        targets[index].priority == minPriority
      ) { data2.push(targets[index])
    }
}
    res.status(200).json({ massege: "data ", data: data2 });
  } catch {
    res.status(500).json({ massege: "data not ", data: "null" });
  }
});
app.get("/targets/:id/brief", async (req, res) => {
  
  try {
    const id = +req.params.id;
    const data = await fs.readFile("data/targets.json", "utf-8");
    const dataJson = JSON.parse(data);
    const targets = dataJson.targets;
    const findId = targets.find((target) => target.id == id);
    if (!findId) {
      res.status(404).json({ message: "not found id" });
    }
    res.send(findId, null, 2);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});
// app.get("/intel/ping", async (req, res) => {
//     try{
//     const header = req.headers;
//     const data = await fs.readFile("data/targets.json", "utf-8");
//     const dataJson = JSON.parse(data);
//     const targets = dataJson.targets;
    
//     }catch{}
// })
// app.use((req,res,next) => {
//   console.log(
//     {method: req.method,
//       path: req.path,
//       timestamp: new Date()
//     }) 
// });



app.get("/",  (req,res)=>{
  res.json({headers: req.headers})
})
app.use(express.json());
app.post("/targets",async (req,res)=>{
  try{
  const  body  = req.body;
  const data = await fs.readFile("data/targets.json", "utf-8");
  const dataJson = JSON.parse(data);
  const targets = dataJson.targets;
  console.log(req.body)
  console.log(typeof(body))
  if (typeof(body) === `object`){
  dataJson.targets.push(body)
  const data2 = JSON.stringify(dataJson, null , 2)
  await fs.writeFile("data/targets.json", data2 ,"utf-8");
  res.status(200).json({ message: "server sucsses" });
  }else{res.status(500).json({ message: "server error" })}
   } catch{res.status(404).json({ message: "error" })}
})

app.put("/targets/:id", async (req,res) => {
    try{
    const id = req.params.id;
    const body = req.body;
    console.log(body)
    console.log(id)
    const data = await fs.readFile("data/targets.json", "utf-8");
    const dataJson = JSON.parse(data);
    const targets = dataJson.targets;
    for (let index = 0; index < targets.length; index++) {
      if (targets[index].id == id){
          if (body.codeName != targets[index].codeName){
            targets[index].codeName = body.codeName}
          if (body.region != targets[index].region){
            targets[index].region = body.region}
          if (body.priority != targets[index].priority){
            targets[index].priority = body.priority}
          if (body.status != targets[index].status){
            targets[index].status = body.status}
          const data2 = JSON.stringify(dataJson, null , 2)
          await fs.writeFile("data/targets.json", data2 ,"utf-8");
          res.status(200).json({ message: "server sucsses"})
      }
      
    }}catch{res.status(404).json({ message: "error" })}
    
})
app.post("/targets/:id/status", async (req,res) => {
  try{

  }catch{}
})





// app.listen(PORT, () => {
//   console.log(`Server is ranning on port ${PORT}...`);
// });
