
import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDB from "./src/config/db.js";








connectDB().then(() => {
    app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port} and URL http://localhost:${config.port}`);
    })
}).catch((error) => {
    console.log("Error connecting to MongoDB:", error);
})