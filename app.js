const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const { Configuration, OpenAIApi } = require("openai");
const readlineSync = require("readline-sync");
require("dotenv").config();


app.engine("handlebars", handlebars({defaultLayout:"main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended:false}))
app.set(bodyParser.json())

app.get("/",function(req,res){
    res.render("first_page")
})

app.post("/req",function(req,res){
    (async () => {
        const configuration = new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
      
        const history = [];
      
        const user_input ="9 sinônimos da palavra "+req.body.word+", exiba uma barra no final de cada sinônimo, escreva também apenas o significado da palavra" +req.body.word;
      
          const messages = [];
          for (const [input_text, completion_text] of history) {
            messages.push({ role: "user", content: input_text });
            messages.push({ role: "assistant", content: completion_text });
          }
      
          messages.push({ role: "user", content: user_input });
      
          try {
            const completion = await openai.createChatCompletion({
              model: "gpt-3.5-turbo",
              messages: messages,
            });

            const completion_text = completion.data.choices[0].message.content;
            console.log(completion_text.split("/"));
            const words = completion_text.split("/")
            res.render("req_page", {words})
            history.push([user_input, completion_text]);
          } catch (error) {
            if (error.response) {
              console.log(error.response.status);
              console.log(error.response.data);
            } else {
              console.log(error.message);
            }
          }
      })();
})

app.listen(8081,function(){
    console.log("Servidor ativo! ")
})