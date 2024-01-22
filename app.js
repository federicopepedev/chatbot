const express = require("express");
const OpenAI = require("openai");
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');

const openai = new OpenAI({
    apiKey: 'OPENAI_API_KEY',
  });

let messages = [];
let items = [];

app.get("/", (req, res) => {
    res.render('chat',  {newItems: items, newMessages: messages});
});


app.post("/converse", async (req, res) => {
    const message = req.body.message;
    messages.push(message);

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: message }
            ],
            model: "gpt-3.5-turbo",
        });
        
        items.push(completion.choices[0].message.content);
    } catch (e) {
        console.log(e);
    }
    
    res.redirect('/');
});

app.listen(3000, () => {
  console.log("OpenAI assistant listening on port 3000!");
});