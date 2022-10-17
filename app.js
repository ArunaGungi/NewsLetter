import bodyParser from "body-parser";
import express, { response } from "express";
import path from "path";
//import axios from "axios";
import https from "https";

const app = express();

const __dirname = path.resolve();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req,res) => {
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", async(req,res) => {

    const firstName =  req.body.fname;
    const lastName = req.body.lname;
    const Email =  req.body.email;

    console.log(firstName, lastName, Email);
    const data = {
        members : [
            {   
                email_address : Email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    //console.log(jsonData);

    const url = "https://us21.api.mailchimp.com/3.0/lists/93e4f81b63";

    const options = {
        method:"POST",
        auth:"aruna1:3f77d4df43d7bdba91c58443c08f163-us21"
    }

    //console.log(options);

    const request = https.request(url, options, (response) => {

        console.log("Status code is:",response.statusCode);

        if(response.statusCode === 200) {
            res.sendFile(__dirname+"/success.html");
        }
        else {
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", (data) => {
            //console.log(JSON.parse(data));
        })
    })
    // const request = await axios.post(url, options, (response) => {
    //     console.log(JSON.parse(response));
    //     // if(response.status === 200) {
    //     //     res.sendFile(__dirname,"/success.html");
    //     // }
    //     // else {
    //     //     res.sendFile(__dirname,"/failure.html");
    //     // }
    // })
    request.write(jsonData);
    request.end();
 })

app.post("/failure", (req,res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => console.log("http://localhost:3000"))
