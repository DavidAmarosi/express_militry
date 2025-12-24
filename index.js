import { error } from "console";
import express from "express";
import fs from "fs/promises";

const app = express();
const PORT = 8000;

async function readTasks() {
  const data = await fs.readFile('data/tasks.json', 'utf-8');
  return JSON.parse(data);
}

// Helper function לשמירת משימות
async function writeTasks(tasks) {
  await fs.writeFile('data/tasks.json', JSON.stringify(tasks, null, 2));
}
app.use(express.json());



// app.get("/users", async (req, res) => {
//   try {
//     const data = await fs.readFile("users.json", "utf-8");
//     const users = JSON.parse(data);
//     res.status(200).json(users);
//   } catch {
//     res.status(500).json({ status: "users not" });
//   }
// });
// app.get("/users/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const intId = parseInt(id);
//     const data = await fs.readFile("users.json", "utf-8");
//     const users = JSON.parse(data);
//     const dataByid = users.find((u) => u.id === intId);
//     if (!dataByid) {
//       return res.status(404).json({ message: "User not found" });
//     } else {
//       res.status(200).json(dataByid);
//     }
//   } catch {
//     res.status(500).json({ message: "error" });
//   }
// });

// app.get("/users/search", async (req, res) => {
//   try {
//     const city = req.query.city;
//     console.log(city);
//     const data = await fs.readFile("users.json", "utf-8");
//     const users = JSON.parse(data);
//     const dataByCity = users.filter((u) => u.city === city);
//     console.log(dataByCity);
//     if (!dataByCity) {
//       return res.status(404).json({ message: "Users not found" });
//     } else {
//       res.status(200).json(dataByCity);
//     }
//   } catch {
//     res.status(500).json({ message: "error" });
//   }
// });

// app.post("/users", async (req, res) => {
//   try {
//     const data = await fs.readFile("users.json", "utf-8");
//     const users = JSON.parse(data);
//     const maxId = users.length > 0 ? Math.max(...users.map((u) => u.id)) : 0;
//     const newUser = { id: maxId + 1, ...req.body };
//     users.push(newUser);
//     await fs.writeFile("users.json", JSON.stringify(users, null, 2));
//   } catch {
//     res.status(500).json({ message: "error" });
//   }
// });
// app.put("/users/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const intId = parseInt(id);
//     const data = await fs.readFile("users.json", "utf-8");
//     const users = JSON.parse(data);
//     const index = users.findIndex((u) => u.id === intId);
//     console.log(index);
//     if (index === -1) {
//       return res.status(404).json({ message: "User not found" });
//     } else {
//       users[index] = { intId, ...req.body };
//     }
//     await fs.writeFile("users.json", JSON.stringify(users, null, 2));
//     res.status(200).json(users);
//   } catch {
//     res.status(500).json({ message: "error" });
//   }
// });

// app.delete("/users/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const intId = parseInt(id);
//     const data = await fs.readFile("users.json", "utf-8");
//     const users = JSON.parse(data);
//     const filteredUsers = users.filter(u => u.id !== intId);

//     if (filteredUsers.length === users.length) {
//       return res.status(404).json({ message: "User not found" });
//     } else {
//       res.status(200).json(filteredUsers);
//     }
//     await fs.writeFile("users.json", JSON.stringify(filteredUsers, null, 2));
//   } catch {
//     res.status(500).json({ message: "error" });
//   }
// });

// app.get("/tasks", async (req, res) => {
//   try{
//     const tasks = await readTasks()
//     console.log(tasks)
//     res.status(200).json({data: tasks})
//   }catch{res.status(500).json({"error": error})}
// })
// app.get("/tasks/:id", async (req,res) => {
//   try{
//     const id = req.params.id
//     const data = await readTasks()
//     for (let index = 0; index < data.length; index++) {
//       if (data[index].id == id){
//         res.status(200).json({data: data[index]})
//       }
      
//     }
//   }catch{res.status(500).json({"error": error})}
// })


app.get("/tasks/filter",async (req,res) => {
  try{
    const data = await readTasks()
    const { completed } = req.query;
    console.log(completed)
    console.log(data)
    const data2 = data.filter((f) => String(f.completed) == completed)
    res.status(200).json({data: data2})
  }catch{
    res.status(500).json({"error": error})}
})

app.get("/tasks/filter",async (req,res) => {
  try{
    const data = await readTasks()
    const { priority } = req.query;
    const data2 = data.filter((f) => String(f.priority) == priority)
    res.status(200).json({data: data2})
  }catch{
    res.status(500).json({"error": error})}
})
app.post("/tasks", async (req,res) =>{
  try{
    const data = await readTasks()
    const body = req.body
    console.log(body)
    if (+body.id <= data[data.length -1].id){return res.status(404).json({"error": "id out of range"})}
    data.push(body)
    await writeTasks(data)
    console.log(data)
    res.status(200).json({data: data})

  }catch{ res.status(500).json({"error": error})}
})

app.put("/tasks/:id", async (req,res) => {
  try{
    const id = req.params.id;
    const body = req.body;
    const data = await readTasks()
    for (let index = 0; index < data.length; index++) {
      if (data[index].id == id){
        const data2 = data[index]
        data[index].completed = body.completed
        data[index].priority = body.priority
        data[index].title = body.title
        res.status(200).json({data: data2})
      }
    }
    writeTasks(data)
  }catch{ res.status(500).json({"error": error})}
})
app.patch("/tasks/:id/toggle", async (req, res) => {
  try{
    const id = req.params.id;
    const body = req.body;
    const data = await readTasks()
    for (let index = 0; index < data.length; index++) {
      if (data[index].id == id){
        const data2 = data[index]
        data[index].completed = body.completed
        res.status(200).json({data: data2})
      }
    }
    writeTasks(data)
  }catch{res.status(500).json({"error": error})}
})

app.delete("/tasks/:id", async (req, res) => {
  try{
    const id = req.params.id;
    const body = req.body;
    const data = await readTasks()
    for (let index = 0; index < data.length; index++) {
      if (data[index].id == id){
        const filterdata = data.filter((data) => data.id != id)
        writeTasks(filterdata)
      }}
  }catch{res.status(500).json({"error": error})}
})







// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
